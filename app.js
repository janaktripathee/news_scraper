var express = require("express");  
var axios = require("axios"); 
var cheerio = require("cheerio"); 
var mongojs = require("mongojs");
var app = express();

app.set('view engine', 'ejs');

var databaseUrl = "scraper"; 
var collections = ["allScrapedData"]; 

var db = mongojs(databaseUrl, collections); 
db.on("error", function(error){
	console.log("Error: ", error); 
}); 


app.get('/', function(req, res){
	res.render('pages/index', {
		allstory: []
	}); 
})

app.get("/home", function(req, res){
	db.allScrapedData.find({}, function(error, found){
		if(error) throw error; 
		else res.render('pages/index', {
			allstory: found
		})
	})
})

app.post("/scrape", function(req, res){
  axios.get("http://www.echojs.com/").then(function(response){
  	console.log(response,"response");
		var $ = cheerio.load(response.data); 
		$(".River__hed___re6RP").each(function(i, el){
			var title = $(el).text();
			var desc = $(el).parent().siblings(".River__riverItemBody___347sz").children("h5").text();
			console.log(desc,"description");
			var link = 'https:www.newyorker.com' + $(el).parent().attr("href");
			
			if (title && desc && link){
				db.allScrapedData.insert({
					title: title, 
					desc: desc,
					link: link
				},
				function(err, inserted){
					if(err) throw err; 
					else console.log(inserted); 
				});

			}
				
		});
	});
  res.redirect('/home');
})



app.listen(3000, function() {
  console.log("App running on port 3000!");
});
