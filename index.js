var express         = require("express"),
    app             = express(),
    expressSanitizer= require("express-sanitizer"),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    nodeMailer      = require("nodemailer");
    
//APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//RESTFUL ROUTES
app.get("/", function(req, res){
   res.render("index"); 
});

//SEND EMAIL
app.get("/sendEmail", function(req, res){
    
    //Remember how to receive the data sent by the user via POST in 'req'
    //in the front-end javasctipt, update the screen to give the feedback to 
    //the user in the case of success in 'res'
    
    var transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });
    
    var mailOptions = {
      from: req.query.email,
      to: 'wagnerlopes.au@gmail.com',
      subject: req.query.name + ' - ' + req.query.phone,
      text: req.query.message + "<br>Email: " + req.query.email
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    
   res.render("index"); 
});

//SEND EMAIL
app.post("/sendEmail", function(req, res){

  //Send email to wagnerlopes.au@gmail.com
  var from = req.body.email;
  var to = 'wagnerlopes.au@gmail.com';
  var subject = req.body.name + ' - ' + req.body.phone;
  var text = req.body.message + "\n\nEmail: " + req.body.email;
  sendEmail (from, to, subject, text);

  //Send feedback email to the client
  from = 'wagnerlopes.au@gmail.com';
  to = req.body.email;
  subject = 'Contact - Wagner Lopes';
  text = "Hi " + req.body.firstName + ",\n\nThank you for contacting me!\n\nI will analyze your email and get back to you as soon as possible, ok?\n\nYour Message: \n\n======\n" + req.body.message + "\n=====\n\n\nBest Regards!\nWagner Lopes\nwagnerlopes.au@gmail.com\n+61 451 631 417";

  sendEmail (from, to, subject, text);
  
  res.render("index"); 
});

function sendEmail (from, to, subject, text) {
  var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'wagnerlopes.au@gmail.com',
      pass: 'Testparm#3'
    },
    tls:{
      rejectUnauthorized: false
    }
    // host: 'smtp.zoho.com',
    // port: 465,
    // secure: true, // use SSL
    // auth: {
    //     user: 'me@wagnerlopes.com.au',
    //     pass: 'Testparm#3'
    // }
  });
  
  var mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: text,
    replyTo: from
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

app.listen(process.env.PORT, process.env.IP, function(){
  console.log(`Server started on: http://localhost:${process.env.PORT} / ${process.env.EMAIL} / ${process.env.PASS}`); 
});