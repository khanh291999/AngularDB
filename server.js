//Import npm packages
const User = require("./models/userModel");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

const MONGODB_URI =
  "mongodb+srv://khanh:khanh123@grafana.45g6s.mongodb.net/Grafana?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!!!!!");
});
app.listen(PORT, console.log(`Sever is starting at ${PORT}`));
//Model

//Saving data to our mongo database
const data = {};

// instance of the model

//HTTP request logger
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan());
app.use("/users", require("./routes/userRouter"));

app.all("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//user
app.get("/user", (req, res) => {
  const data = {};

  User.find({})
    .then((data) => {
      // console.log('Data: ', data);
      res.json(data);
    })
    .catch((error) => {
      console.log("error: ", daerrorta);
    });
});

app.get("/user/:id", (req, res) => {
  const data = {};
  User.findOne({
    id: req.params.id,
  })
    .then((data) => {
      // console.log('Data: ', data);
      res.json(data);
    })
    .catch((error) => {
      console.log("error: ", daerrorta);
    });
});

app.post("/user", (req, res) => {
  const data = req.body;

  const newUser = new User(data);
  newUser.save((error) => {
    if (error) {
      res.status(500).json({ msg: "Sorry, internal server errors" });
    }
    return res.json({
      msg: " Your data has been saved!!!",
    });
  });
});

app.delete("/user/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const removedPost = await User.remove({ id: req.params.id });
    res.json(removedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

app.patch("/user/:_id", async (req, res) => {
  try {
    const updatePost = await User.updateOne(
      { _id: req.params._id },
      {
        $set: {
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          role: req.body.role,
        },
      }
    );
    res.json(updatePost);
  } catch (err) {
    res.json({ message: err });
  }
});
