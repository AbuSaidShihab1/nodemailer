const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const port = process.env.port || 8000;
const nodemailer = require("nodemailer");
const multer = require("multer");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const filenamer = Date.now() + "-" + file.originalname;
    cb(null, filenamer);
  },
});
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "shihabmoni15@gmail.com",
    pass: "hduwmlisadkbpglj",
  },
});
app.get("/", (req, res) => {
  try {
    res.render("form");
  } catch (err) {
    console.log(err);
  }
});
app.post("/form", upload.single("img"), async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const info = await transporter.sendMail({
      from: email, // sender address
      to: "shihabmoni15@gmail.com", // list of receivers
      subject: "Test Purpose", // Subject line
      text: message,
      attachments: [
        {
          filename: req.file.filename,
          path: `./public/images/${req.file.filename}`,
        },
      ], // plain text body
    });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, function () {
  console.log("Running...");
});
