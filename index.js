/* jshint esversion: 6 */

var express=require("express");
var bodyParser=require('body-parser');
var paypal = require('paypal-rest-sdk');

var connection = require('./config');
var app = express();

var session= require('express-session');
var adminsession= require('express-session');

var path = require('path');

var authenticateController=require('./controllers/authenticate-controller');
var registerController=require('./controllers/register-controller');

var admindash=require('./controllers/admindashboard');
var adminpass=require('./controllers/authenticate_admin');
var shopreg=require('./controllers/reg_shop');

app.use(session({

  secret:'sshh',
  resave:true,
  saveUninitialized: true,
  cookie:{ maxAge:60000}

}));

app.engine('html',require('ejs').renderFile);
app.set('view engine','html');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

var sess;
app.get('/', function (req, res) {
  sess=req.session;
  if(sess.email){
    return res.redirect("/home");
  }
   res.sendFile( __dirname + "/" + "freelancemantra.html" );
});

app.get('/home', function(req, res) {
sess=req.session;
  if(sess.email){
res.render('home',{data:sess.email});}
else{
  res.send('please login to view');
}
});

app.get('/logoutadmin', function(req, res) {
sess=req.session;
if(sess.email)
{
delete sess.email;
res.sendFile( __dirname + "/" + "adminlogin.html" );


}else{
  res.send("failed to delete session");
}
});

var ses;
app.get('/logout', function(req, res) {
sess=req.session;
if(sess.email)
{
delete sess.email;
res.sendFile( __dirname + "/" + "freelancemantra.html" );


}else{
  res.send("failed to delete session");
}
});

app.get('/adminlogin', function(req, res) {
res.sendFile( __dirname + "/" + "adminlogin.html" );
});


app.get('/admindash', function(req, res) {
  sess=req.session;
  if(sess.email){
    res.sendFile( __dirname + "/" + "admindash.html" );}
else{
  res.send('please login with admin account to view');
}
});

app.get('/addproducts', function(req, res) {
  sess=req.session;
  if(sess.email){
    res.sendFile( __dirname + "/" + "addproducts.html" );}
else{
  res.send('please login with admin account to view');
}
});


app.get('/register_shops', function(req, res) {
  sess=req.session;
  if(sess.email){
    res.sendFile( __dirname + "/" + "register_shops.html" );}
else{
  res.send('please login with admin account to view');
}
});

app.get('/shop', function(req, res) {

var data=[];
  connection.query("SELECT * FROM product", function (err,rows, fields) {
    if (err)
      throw err;

    for(i=0;i<rows.length;i++)
    {
    data.push(rows[i]);
    }

         console.log(data);
         res.render('prod',{data:data,ele:data.length});


  });
});

app.get('/electronicsproduct',function(req,res){
connection.query("SELECT * from product where catagory='electronics'",
function(err, rows, fields) {
if (err) throw err;
var data=[];
for(i=0;i<rows.length;i++)
{
data.push(rows[i]);
}
console.log(rows);
res.render('electronics',{data:data,ele:data.length});
});
});

app.get('/fashionproducts',function(req,res){

connection.query("SELECT * from product where catagory='fashion'",
function(err, rows, fields) {
if (err) throw err;
var data=[];
for(i=0;i<rows.length;i++)
{
data.push(rows[i]);

}
console.log(rows);
    res.render('products', { data: data, ele: data.length });
    
});

});


paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AYval0vYoYahmzdUquCnU95-V3I3LkOqLScr8PlhnDmyWnQpad0CUnCvdoslASPlr3zNHqvhRN5LsYbm',
  'client_secret': ''
});

app.post('/pay', (req,res) =>
{


    var data={
       "fullname":req.body.firstname,
      	 	"email":req.body.email,
      	   "address":req.body.address,
      	  "city":req.body.city,
      	   "state": req.body.state,
      	  "zip":req.body.zip



    };

    connection.query('INSERT INTO billing SET ?',data, function (error, results, fields) {
      if (error) {
        res.json({
            status:false,
            message:'there are some error with query'
        });
      }else{
  console.log(data);
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:8012/success",
        "cancel_url": "http://localhost:8012/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "item",
                "sku": "item",
                "price": "60.00",
                "currency": "INR",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "INR",
            "total": "60.00"
        },
        "description": "good to see you"
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else
    {
  for(let i=0;i<payment.links.length;i++)
  {
    if(payment.links[i].rel === "approval_url")
    {
      res.redirect(payment.links[i].href);
    }
  }

}
});


      }
    });





});

app.get('/success',(req,res) =>
{
  const payerId= req.query.PayerID;
  const paymentId= req.query.PaymentID;

const execute_payment_json ={
"payer_id":payerId,
"transactions":[{
  "amount":{
    "currency":"INR",
    "total":"60.00"

  }
}]
};
paypal.payment.execute(paymentid, execute_payment_json, function (error, payment)
{
  if(error){
    console.log(error.response);
    throw error;
  }else{
console.log("get payment response");
console.log(JSON.stringify(payment));
    res.send('success');
  }
});

});

app.get('/cancel',(req,res)=>
  res.send('cancelled'));

/* route to handle login and registration */
app.post('/api/register',registerController.register);
app.post('/api/authenticate',authenticateController.authenticate);
app.post('/api/admin',admindash.admin);
app.post('/api/auth',adminpass.auth);
app.post('/api/rshop',shopreg.rshop);


console.log(authenticateController);
app.post('/controllers/register-controller', registerController.register);
app.post('/controllers/authenticate-controller', authenticateController.authenticate);
app.post('/controllers/admindashboard', admindash.admin);
app.post('/controllers/authenticate_admin', adminpass.auth);
app.post('/controllers/reg_shop', shopreg.rshop);

module.exports = app;
app.listen(8012);
