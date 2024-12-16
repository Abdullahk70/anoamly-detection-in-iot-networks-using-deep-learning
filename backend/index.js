import cors from "cors"
import bodyparser from "body-parser";
import express from "express"
import mongoose from "mongoose";


const app=express();
app.use(cors());
app.use(bodyparser.json({extends:true}));
app.use(bodyparser.urlencoded({extends:true}));

app.get("",async (req,res)=>{
  res.json(req.body.name);
});


const url="mongodb+srv://abdullah:123@cluster0.qfbdxft.mongodb.net/";
mongoose.connect(url).then(()=>{console.log("connected")});
app.listen(5000);