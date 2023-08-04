const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const ejs = require("ejs");

const bodyParser = require("body-parser");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const api_key = process.env.API_KEY;
const sendgrid = process.env.SENDGRID;
const email = process.env.EMAIL;
const port = process.env.PORT;

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: api_key,
    },
  })
);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.post("/sendmail", async (req, res, next) => {
  return ejs.renderFile(
    "templates/message.ejs",
    { name: req.body.name, email: req.body.email, message: req.body.message },
    async (error, data) => {
      let messageOption = {
        to: email,
        from: sendgrid,
        subject: "Message from collinsfrontend.com",
        html: data,
      };
      try {
        await transporter.sendMail(messageOption);
        res.status(200).json({
          message: 'Email sent successfully!'
        })
      } catch (error) {
        console.log(error);
      }
    }
  );
});

app.listen(port || 3000, () => {});
