var express=require("express");
var connection = require('./../config');

module.exports.admin=function(req,res){
  var today = new Date();

var data={
   "id":req.body.pid,
  	 	"productname":req.body.productname,
  	   "price":req.body.price,
  	  "quantity":req.body.quantity,
  	   "catagory": req.body.catagory,
  	  "details":req.body.details,
  		   "date":today
};

connection.query('INSERT INTO product SET ?',data, function (error, results, fields) {
  if (error) {
    res.json({
        status:false,
        message:'there are some error with query'
    });
  }else{

        res.redirect('/');

  }
});
};
