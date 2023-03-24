//jshint esversion:6
const express=require("express");
const app=express();
const ejs=require("ejs");
const bodyParser=require("body-parser");
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){

});
app.listen(3000,function(req,res){
    console.log("Server started on port 3000.");
});