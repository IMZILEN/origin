const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const form = req.body;
  const fName = form.firstName;
  const lName = form.lastName;
  const email = form.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/0e24e00280";
  const options = {
    method: "post",
    auth: "imzilen:86bf56d4cfef18ea1cc986c655a0e6c7-us17",
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }

      console.log(JSON.parse(data));
    });
  });

  app.post("/failure", function (req, res) {
    res.redirect("/");
  });

  request.write(jsonData);
  request.end();
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Listening...");
});

// MAILCHIMP
// API key : 86bf56d4cfef18ea1cc986c655a0e6c7-us17
// List id : 0e24e00280
