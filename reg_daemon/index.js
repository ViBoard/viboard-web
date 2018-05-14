const port = 300;
let viboard_WIF;
let reCAPTCHA;
let email_password = "";
const viboard_name = "viboard";

let golos = require("golos-js");
let fs = require('fs');
let sqlite3 = require('sqlite3').verbose();
let express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
var Recaptcha = require('express-recaptcha').Recaptcha;
var recaptcha;
reCAPTCHA = "6LcUeVMUAAAAAMcK8p-N-4RbLJIrFuKIIc_FY_oy";
recaptcha = new Recaptcha('6LcUeVMUAAAAAJogwdxvfVdWUuhCc6C8j2HsO4kz', reCAPTCHA);


let db = new sqlite3.Database('email_confirmation.sqlite');
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function getConfirmKey() {
  let min = 1000000000000;
  let max = 9999999999999;
  return Math.round(Math.random() * (max - min) + min);
}

app.get('/', function(req, res){
  res.render('login', { captcha:recaptcha.render() });
});

app.post("/", recaptcha.middleware.verify, function (request, responce) {
  responce.setHeader("Access-Control-Allow-Origin", "*");
  //console.log(request.body);

  if (request.body.purpose == "add") {
    if(!request.recaptcha.error) {
      responce.send("(0) Captcha verified");
    } else {
      responce.send("(-1) Error captcha verifying");
      return;
    }

    let confirm_key = getConfirmKey();
    db.serialize(function () {
      db.get(`SELECT * FROM user_list WHERE email = '${request.body.email}'`, function (err, row) {
        console.log("ROW check:", row, !!row);
        if (!row) {
          let add = db.prepare(`INSERT INTO email_confirmation (login, email, owner_key, active_key, posting_key, memo_key, confirm_key) VALUES (
            '${request.body.new_account_name}', '${request.body.email}', '${request.body.owner}',
              '${request.body.active}', '${request.body.posting}', '${request.body.memo }', '${confirm_key}')`);
          add.run();
          add.finalize();
          send_email(request.body.new_account_name, confirm_key, request.body.email);
          responce.send("(0) Now confirm email");
        } else {
          responce.send("(-1) Email already registered");
        }
      });


    });
  } else if (request.body.purpose == "confirm") {
    console.log("Confirm..");
    let email = "";
    db.serialize(function () {
      console.log("exisits?", request.body.new_account_name, request.body.confirm_key);
      db.get(`SELECT * FROM email_confirmation WHERE login = '${request.body.new_account_name}' AND confirm_key = '${request.body.confirm_key}'`, function (err, row) {
        console.log("ROW:", row, !!row);
        if (row) {
          email = row.email;
          let new_keys = [row.owner_key, row.active_key, row.posting_key, row.memo_key];
          create_account(request.body.new_account_name, new_keys, responce);

          db.run(`DELETE FROM email_confirmation WHERE login = '${request.body.new_account_name}' AND confirm_key = '${request.body.confirm_key}'`, function (err, row) {
            console.log("Delete..");
          });

          db.run(`INSERT INTO user_list (login, email) VALUES ('${request.body.new_account_name}', '${email}')`, function (err, row) {
            console.log("Insert new user..");
          });
        } else {
          responce.send("(-1) No data in DB");
        }
      });
    });
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
  //fs.readFile("../secret_files/reCAPTCHA", ["utf8"], function (err, data) {
  //  if (err) {
  //    return console.log(err);
  //  }
  //  reCAPTCHA = data.toString('utf8').trim();
  //  recaptcha = new Recaptcha('6LcUeVMUAAAAAJogwdxvfVdWUuhCc6C8j2HsO4kz', reCAPTCHA);
  //  console.log("reCAPTCHA got!");
  //});
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

      db.run("CREATE TABLE IF NOT EXISTS user_list (" +
        " login text," +
        " email text" +
        ")");

      db.all("SELECT * from email_confirmation", function (err, rows) {
        console.log(rows);
      });

      // db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
      //   console.log(row.id + ": " + row.info);
      // });
    });

    // db.serialize(function () {
    //   db.run("CREATE TABLE IF NOT EXISTS user_list (" +
    //     " login text," +
    //     " email text," +
    //     ")");
    // });


    console.log("Ready..");
  });
});

function create_account(new_account_name, new_keys, responce) {
  console.log("Try to create account..");
  let fee = '2.000 GOLOS';
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
      responce.send("(0) Created");
    } else {
      console.error("Error! -> ", err.payload.error.data.code, err.payload.error.data.message);
      let answer = "(" + err.payload.error.data.code + ") " + err.payload.error.data.message;
      responce.send(answer);
    }
  });
}

function send_email(login, code, email) {
  console.log("Try to send email", login, code, email);
  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 587, // 587 not secure
      secure: false, // true for 465, false for other ports
      auth: {
        user: "confirm@viboard.me",
        pass: "cote-key"
      }
    });

    let mailOptions = {
      from: '"Команда ViBoard" <confirm@viboard.me>', // sender address
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
