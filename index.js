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
        user: 'hi.wagnerlopes@gmail.com',
        pass: 'Testparm#3'
      }
    });
    
    var mailOptions = {
      from: req.query.email,
      to: 'hi.wagnerlopes@gmail.com',
      subject: req.query.name + ' - ' + req.query.phone,
      text: req.query.message
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

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server started!"); 
});