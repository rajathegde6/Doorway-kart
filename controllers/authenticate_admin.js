/* jshint esversion: 6 */

var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');


var connection = require('./../config');




module.exports.auth=function(req,res){



    var email=req.body.adminemail;
    var password=req.body.adminpassword;


    connection.query('SELECT * FROM admin WHERE admin_uid = ?',[email], function (error, results, fields) {
      if (error) {
          $(".alert").show().html("try again");
      }else{

        if(results.length >0){

  decryptedString = cryptr.decrypt(results[0].admin_psw);
            if(password==decryptedString){
              sess=req.session;
              sess.email=email;

      res.redirect('/admindash');
            }else{
                res.json({
                  status:false,
                  message:"Username and password of admin does not match"
                 });
            }

        }
        else{
          res.json({
              status:false,
            message:" admin  does not exits"
          });
        }
      }
    });
};
