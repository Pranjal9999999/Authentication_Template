//jshint esversion:6
require("dotenv").config();
const express=require("express");
const app=express();
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const md5=require("md5");
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://127.0.0.1:27017/userDB")
.catch(function(err){
    console.log(err);
});
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
const secret=process.env.SECRET;
//userSchema.plugin(encrypt,{secret:secret, encryptedFields:['password']})
const User=mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");

});
app.get("/login",function(req,res){
    res.render("login");

});
app.post("/login",function(req,res){
    User.findOne({email:req.body.username,password:md5(req.body.password)})
    .then(function(result){
        console.log("User logged in successfully");
        console.log(result);
        res.render("secrets");

    })
    .catch(function(err){
        console.log(err);
    });
})
app.get("/register",function(req,res){
    res.render("register");
    

});
app.post("/register",function(req,res){
    const user=new User({email:req.body.username, password:md5(req.body.password)});
    user.save()
    .then(function(){
        res.render("secrets");

    })
    .catch(function(err){
        console.log(err);
    })

})
app.listen(3000,function(req,res){
    console.log("Server started on port 3000.");
});