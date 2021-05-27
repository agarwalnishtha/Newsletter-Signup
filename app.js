const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); // since we have ststic files like signup.css and the static images references in our html file, if we don't use this static method
//of express, these files will not get rendered, thus we will be clubing these files/folders in another folder called public and then use the path location relative
// to public in th html code i.e for referencing signup.css we will write css/signup.css

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  console.log(firstName, lastName, email);

  const data = {
    members: [
      {
        email_address : email,
        status : "subscribed",
        merge_fields : {
          FNAME : firstName,
          LNAME : lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/943fcfb4fc";
  const options = {
    method : "POST",
    auth : "Nishtha:2e5c1e904978fe0088628a6dc8cd42ef-us6"
  }

  const request = https.request(url, options, function(response){
    response.on("data", function(data){
      const parsedData = JSON.parse(data);
      console.log(parsedData);

      console.log(parsedData.errors[0].error);

      if(parsedData.error_count == 0 && response.statusCode == 200){
        res.sendFile(__dirname + "/success.html");
      }
      else{
        // res.write("<h1>"+parsedData.errors[0].error+"</h1>");
        res.sendFile(__dirname + "/failure.html");
        // res.send();
      }

      // if(response.statusCode == 200){
      //   res.sendFile(__dirname + "/success.html");
      // }
      // else{
      //   res.sendFile(__dirname + "/failure.html");
      // }
      // console.log(response.statusCode);
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req,res){
  res.redirect("/");
});

app.listen(3000, function(){
  console.log("listening to port 3000");
});


// api key
  // 2e5c1e904978fe0088628a6dc8cd42ef-us6

// list id
// 943fcfb4fc
