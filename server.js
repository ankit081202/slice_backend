const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
const User = require("./userModel");
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.send("hello");
});

const foodschema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    varients: [],
    prices: [],
    category: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const db = mongoose.model("Food", foodschema);

app.post("/post", async (req, res) => {
  const data = new db({
    name: req.body.name,
    varients: req.body.varients,
    prices: req.body.prices,
    category: req.body.category,
    image: req.body.image,
    description: req.body.description,
  });
  const val = data.save();
  res.send("posted");
});

app.post("/api/users/register", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  newUser.save();
  console.log("registered successfully");
});

app.post("/api/users/login", async (req, res) => {
  const {email,password} = req.body
  try{
    const user = await User.find({email,password})
    if(user.length>0){
      const currentuser = {
        name: user[0].name,
        email: user[0].email,
        _id: user[0]._id,
      };
      res.send(currentuser);
    }else{
      return res.status(400).json({message:"Invalid Credentials"});
    }
  }catch(err){
    return res.status(400).json({message:"Something went wrong"});
  }
});

app.get("/api/foods/allData", async (req, res) => {
  try {
    const alldata = await db.find({});
    res.send(alldata);
  } catch (error) {
    console.log(error);
  }
});

mongoose
  .connect(
    "mongodb+srv://ankit1234kishan:Ankit2002@cluster0.kn3zeg7.mongodb.net/Food?retryWrites=true&w=majority"
  )
  .then(() => console.log("connected to database"))
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
