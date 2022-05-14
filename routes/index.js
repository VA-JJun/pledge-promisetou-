var express = require("express");
var router = express.Router();
const locationModel = require("../model/location");
const locationModel2 = require("../model/location2");

/* GET home page. */
router.get("/", (req, res, next)=> {
  res.render("index", { title: "Express" });
});

router.get("/upload",(req, res, next)=>{
  res.render("upload");
});

router.post("/location",(req,res,next)=>{
  const {title, address, lat, lng} =req.body;
  let location = new locationModel();
  location.title =title;
  location.address = address;
  location.lat = lat;
  location.lng = lng;
  
  location.save().then((result)=> {
    console.log(result);
    res.json({
      message:"success",
    });
  })
  .catch((error)=>{
    console.log(error);
    res.json({
      message:"error",
    });
  });
});

router.get("/location", (req, res, next) => {
  locationModel.find({}, { _id:0, __v:0}).then((result)=> {
    console.log(result);
    res.json({
      message: "success",
      data: result,
    });
  }).catch((error) => {
    res.json({
      message: "error",
    });
  });
});


router.get("/upload2",(req, res, next)=>{
  res.render("upload2");
});

router.post("/location2",(req,res,next)=>{
  const {title, address, lat, lng} =req.body;
  let location2 = new locationModel2();
  location2.title =title;
  location2.address = address;
  location2.lat = lat;
  location2.lng = lng;
  
  location2.save().then((result)=> {
    console.log(result);
    res.json({
      message:"success",
    });
  })
  .catch((error)=>{
    console.log(error);
    res.json({
      message:"error",
    });
  });
});

router.get("/location2", (req, res, next) => {
  locationModel2.find({}, { _id:0, __v:0}).then((result)=> {
    console.log(result);
    res.json({
      message: "success",
      data: result,
    });
  }).catch((error) => {
    res.json({
      message: "error",
    });
  });
});

module.exports = router;
