const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownLoader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();
require("./db/mongoose");
const User = require("./models/user");
const Place = require("./models/place");
const Booking = require('./models/booking');


const port = process.env.PORT || 3000;

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.get("/test", (req, res) => {
  res.json("test ok");
});

function getUserDataFromReq(req) {
  return new Promise((resolve,reject)=>{
    jwt.verify(req.cookies.token,process.env.JWT_SECRET, {}, async (error,userData)=>{
      if (error) throw error;
      resolve(userData)
    })
  })
}
app.post("/register", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send();
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).send();
    }
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      {}
    );

    res.cookie("token", token).status(200).send(user);
  } catch (error) {}
});

app.get("/profile", async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
      if (error) throw error;
      const { name, email, _id } = await User.findById(userData.id);
      res.send({ name, email, _id });
    });
  } else {
    res.send(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").send(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";

  const options = {
    url: link,
    dest: __dirname + "/uploads/" + newName,
  };
  await imageDownLoader.image(options);
  res.send(newName);
});
const uploadMiddleware = multer({
  dest: "uploads/",
});
app.post("/upload", uploadMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }
  res.send(uploadedFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    description,
    addedPhotos,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price
  } = req.body;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
    if (error) throw error;
    const placeDoc = await Place.create({
      owener: userData.id,
      title,
      address,
      description,
      photos:addedPhotos,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.status(201).send(placeDoc);
  });
});

app.get('/user-places', (req,res)=>{
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData)=> {
        const {id} = userData;
        res.send( await Place.find({owener: id}))
    })
})
app.get('/places/:id', async(req, res) => {
    const {id} = req.params;
    res.send( await Place.findById(id))
})
app.patch('/places', async (req,res) => {
  const {token} = req.cookies;
  const {

    id,title,address,description,
    addedPhotos,perks,extraInfo,
    checkIn,checkOut,maxGuests,price,
  } = req.body;
jwt.verify(token, process.env.JWT_SECRET, {}, async (error, userData) => {
  if (error) throw error;
  const placeDoc = await Place.findById(id);
  if (userData.id === placeDoc.owener.toString()){
    placeDoc.set({  
       title,address,description,
      addedPhotos,perks,extraInfo,
      checkIn,checkOut,maxGuests,price});

      await placeDoc.save();
      res.send('ok')
  }
})
})
app.get('/places', async(req, res) => {
 res.send( await Place.find())
})
app.get('/place/:id', async(req,res) => {
  const {id} =  req.params
  const place = await Place.findById(id)
  res.status(200).send(place)
})
app.post('/bookings',async(req,res) => {
  const userData = await getUserDataFromReq(req);
  const {place, checkIn, checkOut, name, phone,price} = req.body
 const booking = await Booking.create({
    place, checkIn, checkOut, name, phone,price,
    user: userData.id
  })
  await booking.save()
  res.status(201).send(booking)
})


app.get('/bookings', async(req,res) => {
const userData = await getUserDataFromReq(req);
res.send(await Booking.find({user: userData.id}).populate('place'))
});
app.listen(port, () => {
  console.log(`The server is runnung on port ${port}`);
});
