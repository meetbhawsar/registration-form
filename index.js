const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();
app.use(express.static("pages"));

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose
  .connect(
    `mongodb+srv://${username}:${password}@cluster0.pvy7lcu.mongodb.net/registrationFormDB`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: Number,
  password: String,
  cpassword: String,
});
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/newform.html");
});
app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/success.html");
});
app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, contact, password, cpassword } = req.body;
    console.log("Received data:", req.body);

    const existingUser = await Registration.findOne({ email: email });
    if (!existingUser) {
      const registrationData = new Registration({
        name,
        email,
        contact,
        password,
        cpassword,
      });
      await registrationData.save();
      res.redirect("/success");
      console.log("user Created");
    } else {
      alert("User already exist");
      res.redirect("/error");
      console.log("Already Registered");
    }
  } catch (error) {
    res.send("error");
    console.log(error);
    res.redirect("/error");
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
