var MongoClient=require('mongodb').MongoClient;
var express=require('express');
var router=express.Router();
var Twit = require('twit');

var T = new Twit({
  consumer_key:         process.env.consumer_key,
  consumer_secret:      process.env.consumer_secret,
  access_token:         process.env.access_token,
  access_token_secret:  process.env.access_token_secret
});




MongoClient.connect('mongodb://localhost:27017/gdg',function(err,data){
	var col=data.collection('data');
	col.find({}).limit(1000).toArray(function(err,docs){
		var n=docs.length;
		var d=new Date();
		var currentDate=d.toISOString();
		for(i=0;i<n;i++){
			if(docs[i]["issue"]!==null){
				if(docs[i]["issue"][0] !=undefined){
				for(j=0;j<docs[i]["issue"].length;j++){
					
					var dateCreated=new Date(docs[i]["issue"][j].created_at);
					var currentDate=new Date(d.toISOString());
					dateCreatedInSeconds = dateCreated.getTime() * 1000,
    				currentDateInSeconds = currentDate.getTime() * 1000,
    				difference = Math.abs(dateCreatedInSeconds - currentDateInSeconds);
    				var difference=difference/(1000000*60*60*24*30);
    				

    				if(difference<5){
    					console.log(docs[i]["issue"][j].created_at);
    					console.log(docs[i]["name"]);
    					console.log(docs[i]["issue"][j].body);
						console.log(docs[i]["issue"][j].state);
						console.log(docs[i]["issue"][j].comments);

						if(docs[i]["issue"][j].comments==0 && docs[i]["issue"][j].state=='open'){
							T.post('statuses/update', 
								{ status: "New issue opened in last hour to which you have not reponded:\n Repository: https://github.com/" + docs[i]["name"]}, 
								function(err, data, response) {
							});
						}
						
    				}
				}
				

			}
			}
			
			
		}
		
	});
});


module.exports=router;
