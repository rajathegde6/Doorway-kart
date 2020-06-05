var express=require("express");
var connection = require('./../config');

module.exports.rshop=function(req,res){
  var today = new Date();

var data={
  	 	"shopname":req.body.shopname,
  	   "shopcatagory": req.body.catagory,
  	  "shopdetails":req.body.details,
  		   "date":today
};

connection.query('INSERT INTO shops SET ?',data, function (error, results, fields) {
  if (error) {
    res.json({
        status:false,
        message:'there are some error with query'
    });
  }else{

    connection.query('SELECT * FROM users WHERE name= ?',data.shopname, function (error, results, fields) {
      if (error) {
        res.json({
          status:false,
          message:"try again"
         });      }
         else{

        if(results.length >0){

          res.redirect('/');

        }
        else{
          res.json({
              status:false,
            message:"kindly create your account , however data has been added succesfully & sucessfully partnered with the shop "
          });
        }
      }
    });
  }
});
};
