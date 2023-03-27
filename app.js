//jshint esversion:6
require("dotenv").config();
const express=require("express");
const app=express();
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const passport= require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const session=require("express-session");
//const md5=require("md5");
//const bcrypt=require("bcrypt");
//const saltRounds=10;
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://127.0.0.1:27017/userDB")
.catch(function(err){
    console.log(err);
});
//mongoose.set("useCreateIndex", true);
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
userSchema.plugin(passportLocalMongoose);
//userSchema.plugin(encrypt,{secret:secret, encryptedFields:['password']})
const User=mongoose.model("User",userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
    res.render("home");

});
app.get("/login",function(req,res){
    res.render("login");

});
app.post("/login",function(req,res){
    const user=new User({
        username:req.body.username,
        password:req.body.password
    });
    req.login(user,function(err){
        if(err){
            console.log(err);
            res.redirect("/login");

        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })
    
    
});
app.get("/register",function(req,res){
    res.render("register");
    

});
app.post("/register",function(req,res){
    User.register({username:req.body.username},req.body.password,function(err,user){
        if(err){
         console.log(err);
         res.redirect("/register");}
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        } 
         
    })
    
   
        
});
app.get("/secrets",function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }
    else
     res.redirect("/login");

});
app.post("/secrets",function(req,res){


});
app.get("/logout",function(req,res){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});
    


app.listen(3000,function(req,res){
    console.log("Server started on port 3000.");
});