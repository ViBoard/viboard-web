const port = 3000;
const beta_key = "1337";
let viboard_WIF;
let email_password = "";
const viboard_name = "viboard";

let golos = require("golos-js");
let fs = require('fs');
let sqlite3 = require('sqlite3').verbose();
let express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');

let db = new sqlite3.Database('email_confirmation.sqlite');
let app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.post("/", function (request, responce) {
  if (request.body.purpose == "add") {
    if (beta_key == request.body.beta_key) {
      let confirm_key = "6iuhrfu9hf3whs9";
      db.serialize(function () {
        let add = db.prepare(`INSERT INTO email_confirmation (login, email, owner_key, active_key, posting_key, memo_key, confirm_key) VALUES (
      '${request.body.new_account_name}', '${request.body.email}', '${request.body.owner}',
        '${request.body.active}', '${request.body.posting}', '${request.body.memo }', '${confirm_key}')`);
        add.run();
        add.finalize();
        send_email(request.body.new_account_name, confirm_key, request.body.email);
      });
      responce.setHeader("Access-Control-Allow-Origin", "*");
      responce.send("(0) Now confirm email");
      //create_account(request.body.new_account_name, new_keys, responce);
    } else {
      responce.setHeader("Access-Control-Allow-Origin", "*");
      responce.send("(-1) Invalid beta key");
    }
  } else if (request.body.purpose == "confirm") {
    console.log("Confirm..");
    let is_confirmed = false;
    db.serialize(function () {
      db.each(`SELECT * FROM email_confirmation WHERE login = '${request.body.new_account_name}' AND confirm_key = '${request.body.confirm_key}'`, function (err, row) {
        console.log("ROW:", row, row? true:false);
        let new_keys = [row.owner_key, row.active_key, row.posting_key, row.memo_key];
        create_account(request.body.new_account_name, new_keys, responce);
        is_confirmed = false;
      });
      db.run(`DELETE FROM email_confirmation WHERE login = '${request.body.new_account_name}' AND confirm_key = '${request.body.confirm_key}'`, function (err, row) {
        console.log("Delete..", row)
      });
    });
    if(!is_confirmed) {
      responce.setHeader("Access-Control-Allow-Origin", "*");
      responce.send("(-1) No data in DB");
    }
  }
});

app.listen(port, function () {
  fs.readFile("../secret_files/viboard_WIF", ["utf8"], function (err, data) {
    if (err) {
      return console.log(err);
    }
    viboard_WIF = data.toString('utf8').trim();
    console.log("WIF got!");
  });
  fs.readFile("../secret_files/info_mail_password", ["utf8"], function (err, data) {
    if (err) {
      return console.log(err);
    }
    email_password = data.toString('utf8').trim();
    console.log("Email password got!");

    console.log("Check DB..");

    db.serialize(function () {
      db.run("CREATE TABLE IF NOT EXISTS email_confirmation (" +
        " login text," +
        " email text," +
        " owner_key text," +
        " active_key text," +
        " posting_key text," +
        " memo_key text," +
        " confirm_key test" +
        ")");

      db.all("SELECT * from email_confirmation", function (err, rows) {
        console.log(rows);
      });

      // db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
      //   console.log(row.id + ": " + row.info);
      // });
    });

    console.log("Ready..");
  });
});

function create_account(new_account_name, new_keys, responce) {
  console.log("Try to create account..");
  let fee = '1.000 GOLOS';
  let owner = {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [[new_keys[0], 1]]
  };
  let active = {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [[new_keys[1], 1]]
  };
  let posting = {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [[new_keys[2], 1]]
  };
  let memoKey = new_keys[3];
  let jsonMetadata = '{}';

  console.log("\nCreate:", viboard_WIF, fee, viboard_name, new_account_name, owner, active, posting, memoKey, jsonMetadata);
  console.log("\n");

  golos.broadcast.accountCreate(viboard_WIF, fee, viboard_name, new_account_name, owner, active, posting, memoKey, jsonMetadata, function (err, result) {
    if (!err) {
      // console.log('accountCreate', result);
      responce.setHeader("Access-Control-Allow-Origin", "*");
      responce.send("(0) Created");
    } else {
      console.error("Error! -> ", err.payload.error.data.code, err.payload.error.data.message);
      let answer = "(" + err.payload.error.data.code + ") " + err.payload.error.data.message;
      responce.setHeader("Access-Control-Allow-Origin", "*");
      responce.send(answer);
    }
  });
}

function send_email(login, code, email) {
  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 587, // 587 not secure
      secure: false, // true for 465, false for other ports
      auth: {
        user: "info@viboard.me",
        pass: "cote-key"
      }
    });

    let mailOptions = {
      from: '"Команда ViBoard" <info@viboard.me>', // sender address
      to: email, // list of receivers
      subject: 'Подтвердите электронную почту', // Subject line
      text: `Нажмите на эту ссылку, чтобы подтвердить почтовый адрес: https://viboard.me/confirm?name=${login}&code=${code}`, // plain text body
      html: `<h3>Регистрация на сайте ViBoard</h3><br>` +
      `Имя аккаунта: <b>${login}</b><br>` +
      `Нажмите на эту ссылку, чтобы подтвердить почтовый адрес: ` +
      `<a href="https://viboard.me/confirm?name=${login}&code=${code}" title="Ссылка для подтверждения">https://viboard.me/confirm?name=${login}&code=${code}</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
  });
}
