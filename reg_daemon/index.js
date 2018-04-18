const port = 3000;
const beta_key = "1337";
let viboard_WIF;
const viboard_name = "viboard";
let golos = require("golos-js");
let fs = require('fs');


let express = require("express");
let app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.post("/", function (request, responce) {
  if (beta_key == request.body.beta_key) {
    let new_keys = [request.body.owner, request.body.active, request.body.posting, request.body.memo];
    create_account(request.body.new_account_name, new_keys, responce);
    // responce.send(create_result);
  } else {
    responce.setHeader("Access-Control-Allow-Origin", "*");
    responce.send("(-1) Invalid beta key");
  }
});

app.listen(port, function () {
  fs.readFile("../secret_files/viboard_WIF", ["utf8"], function (err, data) {
    if (err) {
      return console.log(err);
    }
    viboard_WIF = data.toString('utf8').trim();
    console.log("WIF got!");
    console.log("WIF got!");
  });

  console.log("Ready..");
});


function create_account(new_account_name, new_keys, responce) {
  console.log("Try to create account..");
  let fee = '1.500 GOLOS';
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

// const requestHandler = (request, response) => {
//   // create_account();
//   response.end('Hello Node.js Server!')
// };


// const server = http.createServer(requestHandler);
// server.listen(port, (err) => {
//   if (err) {
//     return console.log('something bad happened', err)
//   }
//
//   fs.readFile("../secret_files/viboard_WIF", ["utf8"], function (err, data) {
//     if (err) {
//       return console.log(err);
//     }
//     viboard_WIF = data.toString('utf8').trim();
//     // console.log("WIF:", viboard_WIF);
//
//     //create_account("vitestacc1", "secret_password");
//   });
//
//   console.log(`server is listening on ${port}`);
// });
