var express = require("express"); // require express module.
var app = express();
//var fs = require('fs');
// If it says its running use "killall -r node" for this error Error: listen EADDRINUSE 0.0.0.0:3000
var mysql = require('mysql');


var fs = require('fs');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const path = require('path'); // all application follow directory path
const VIEWS = path.join(__dirname, 'views'); // Allow the application access to the views folder

const fileUpload = require('express-fileupload');
app.use(fileUpload());


app.use(express.static("scripts")); // Allow access to scripts folder
app.use(express.static("images")); // Allow access to images folder
app.use(express.static("models")); // Allow access to models folder

app.set("view engine", "jade"); // Set the default view engine

var contact = require("./models/contact.json") // Allow access to contact json file


// ***** Define the database connection **** // 

const db = mysql.createConnection({
 host: 'hostingmysql304.webapps.net',
 user: 'liamme',
 password: 'L1Am39??',
 database: 'liam'
  
});


db.connect((err) => {
  if(err){
     console.log("You broke it")
         }
  else {
    console.log("Connected to database with style!")
  }
});


// Set up a function to greet us when a get request is called.

app.get('/', function(req, res) { // Call a get request when somebody visits the main url
    res.render('index', {root:VIEWS});   // Sending a response which is just a string.
  console.log("You made your first application work.... Well Done!")
        
});



//// *********************** UPLOADER ***************************** ////

app.get('/upload', function(req, res) { // Call a get request when somebody visits the main url
    res.render('upload', {root:VIEWS});   // Sending a response which is just a string.
 
        
});




app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  filename = sampleFile.name;
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./images/' + filename, function(err) {
    if (err)
      return res.status(500).send(err);
 console.log("Here is the image " + req.files.sampleFile)
    res.redirect('/');
  });
});

//////// ******************* UPLOADER END ************************** ///



// ******************************* SQL ROUTES START HERE **********************//
setInterval(function () {
    db.query('SELECT 1');
}, 5000);

// Route to cretate table 
app.get('/createtable', function(req,res){
  let sql = 'CREATE TABLE cars (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Price int, Image varchar(255), Country varchar(255))';
  let query = db.query(sql, (err, res) =>{
    if(err) throw err
    console.log(res)
  });
  
  res.send("The table was created");
});


// Route to cretate landmark 
app.get('/createitem', function(req,res){
  let sql = 'INSERT INTO landmarks (Name, Price, Image, Country) VALUES ("G.P.O.", 6, "gpo.jpg", "Ireland")';
  let query = db.query(sql, (err, res) =>{
    if(err) throw err
    console.log(res)
  });
  
  res.send("Item Inserted");
});


// This next function renders the products.html page whe somebody calls the /landmarks url
app.get('/landmarks', function(req, res) { // Call a get request when somebody visits the main url
   
  let sql = 'SELECT * FROM landmarks';
  let query = db.query(sql, (err, res1) =>{
    if(err) throw err
    console.log(res1)
    res.render('landmarks', {root:VIEWS, res1});   // Sending a response which is just a string.
  });
  
    
  console.log("You are on the landmarks page")
        
});


// Code to render create landmark pageXOffset

app.get('/createlandmark', function(req, res) { // Call a get request when somebody visits the main url
    res.render('createlandmark', {root:VIEWS});   // Sending a response which is just a string.
  console.log("You are now on a page to create a landmark!")
        
});



// Post Route to cretate landmark 
app.post('/createlandmark', function(req,res){
    /// Upload image also 
    if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  filename = sampleFile.name;
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./images/' + filename, function(err) {
    if (err)
      return res.status(500).send(err);
 console.log("Here is the image " + req.files.sampleFile)
    //res.redirect('/');
  });
  
  /// end upload image code
  
  
  let sql = 'INSERT INTO landmarks (Name, Price, Image, Country) VALUES ("'+req.body.name+'", '+req.body.price+', "'+filename+'", "'+req.body.location+'")';
  let query = db.query(sql, (err, res) =>{
    if(err) throw err
    console.log(res)
  });
  

  
  
  
  res.redirect("/landmarks");
});



// This next function renders the products.html page whe somebody calls the /landmarks url
app.get('/landmarks/:id', function(req, res) { // Call a get request when somebody visits the main url
   
  let sql = 'DELETE FROM landmarks WHERE Id = "'+req.params.id+'"';
  let query = db.query(sql, (err, res1) =>{
    if(err) throw err
    console.log(res1)
    console.log("Id being deleted " + req.params.id)
      // Sending a response which is just a string.
  });
  
  res.redirect("/landmarks");
  console.log("Its Gone !!!!")
        
});




app.get('/editsql/:id', function(req, res) {
   let sql = 'SELECT * FROM landmarks WHERE Id = "'+req.params.id+'"'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.render('editsql', {root: VIEWS, res1}); // use the render command so that the response object renders a HHTML page
  
 });
 
  console.log("edit sql page")
        
});



// Post Route to cretate landmark 
app.post('/editsql/:word', function(req,res){
  let sql = 'UPDATE landmarks SET Name = "'+req.body.name+'", Price = '+req.body.price+', Image = "'+req.body.image+'", Country = "'+req.body.location+'" WHERE Id = '+req.params.word+'';
  let query = db.query(sql, (err, res) =>{
    if(err) throw err
    console.log(res)
  });
  
  res.redirect("/landmarks");
});



// Page to show individual landmark
app.get('/show/:id', function(req, res) { // Call a get request when somebody visits the main url
   
  let sql = 'SELECT * FROM landmarks WHERE Id = "'+req.params.id+'"';
  let query = db.query(sql, (err, res1) =>{
    if(err) throw err
    console.log(res1)
    res.render('show', {root:VIEWS, res1});   // Sending a response which is just a string.
 
  });
  
    
  console.log("You are on the landmarks page")
        
});


// Search function 

app.post('/search', function(req, res){
 
 let sql = 'SELECT * FROM landmarks WHERE name LIKE "%'+req.body.search+'%"';
  let query = db.query(sql, (err, res1) =>{
    if(err) throw err
    console.log(res1)
    res.render('landmarks', {root:VIEWS, res1});   // Sending a response which is just a string.
  });
  

 
});

// end search function



//***************** JSON ROUTES START HERE ******************************//






// This next function renders the contacts.html page whe somebody calls the /contact url
app.get('/contact', function(req, res) { // Call a get request when somebody visits the main url
    res.render('contact', {root:VIEWS, contact});   // Sending a response which is just a string.
  console.log("You are on the contact sent page")
        
});


// This next function renders the contacts.html page whe somebody calls the /contact url
app.get('/contactus', function(req, res) { // Call a get request when somebody visits the main url
    res.render('addcontact', {root:VIEWS});   // Sending a response which is just a string.
  console.log("You are on the contact us page")
        
});




app.post('/contactus', function(req, res){
	var count = Object.keys(contact).length; // Tells us how many products we have its not needed but is nice to show how we can do this
	console.log(count);
	
	// This will look for the current largest id in the reviews JSON file this is only needed if you want the reviews to have an auto ID which is a good idea 
	
	function getMax(contacts , id) {
		var max
		for (var i=0; i<contacts.length; i++) {
			if(!max || parseInt(contact[i][id]) > parseInt(max[id]))
				max = contacts[i];
			
		}
		return max;
	}
	
	var maxPpg = getMax(contact, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
	
	// create a new product based on what we have in our form on the add page 
	
	var contactsx = {
    name: req.body.name,
    id: newId,
    Comment: req.body.Comment,
    email: req.body.email
    
  };
  
  console.log(contactsx);
  var json = JSON.stringify(contact); // Convert our json data to a string
  
  // The following function reads the new data and pushes it into our JSON file
  
  fs.readFile('./models/contact.json', 'utf8', function readFileCallback(err, data){
    if(err){
     throw(err);
         
    } else {
      
      contact.push(contactsx); // add the data to the json file based on the declared variable above
      json = JSON.stringify(contact, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile('./models/contact.json', json, 'utf8')
    }
    
  })
  res.redirect("/contact");
  
});



// here is the code to delete json data
app.get("/deletecontact/:id", function(req, res){
  var json = JSON.stringify(contact); // Convert our json data to a string
  
  var keyToFind = parseInt(req.params.id) // Getes the id from the URL
  var data = contact; // Tell the application what the data is
  var index = data.map(function(d) {return d.id;}).indexOf(keyToFind)
  console.log("variable Index is : " + index)
  console.log("The Key you ar looking for is : " + keyToFind);
  
  contact.splice(index, 1);
  json = JSON.stringify(contact, null, 4); // converts the data to a json file and the null and 4 represent how it is structuere. 4 is indententation 
      fs.writeFile('./models/contact.json', json, 'utf8')
  res.redirect("/contact");
});



app.get('/editcontact/:id', function(req, res){
 function chooseProd(indOne){
   return indOne.id === parseInt(req.params.id)
  
 }
 
  var indOne = contact.filter(chooseProd);
  
   res.render('editcontact' , {indOne});
 
 });




// Create post request to edit the individual review
app.post('/editcontact/:id', function(req, res){
 var json = JSON.stringify(contact);
 var keyToFind = parseInt(req.params.id); // Id passed through the url
 var data = contact; // declare data as the reviews json file
  var index = data.map(function(contact) {return contact.id;}).indexOf(keyToFind)
 //var index = data.map(function(contact){contact.id}).keyToFind // use the paramater passed in the url as a pointer to find the correct review to edit
  //var x = req.body.name;
 var y = req.body.Comment
 var z = parseInt(req.params.id)
 contact.splice(index, 1, {name: req.body.name, Comment: y, id: z, email: req.body.email});
 json = JSON.stringify(contact, null, 4);
 fs.writeFile('./models/contact.json', json, 'utf8'); // Write the file back
 res.redirect("/");
});

// end post request to edit the individual review





// Set up the location that the application runs on (The server)

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  console.log("You are no connected......")
  
  
});