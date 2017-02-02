var express = require('express');
var path = require('path');
var github = require('octonode');
var MongoClient=require('mongodb').MongoClient;
var client = github.client(process.env.token);


MongoClient.connect('mongodb://localhost:27017/gdg',function(err,db){
		var col=db.collection('data');
		col.remove({},function(err,docs){
			console.log("Data removed");
	});
});


var ghorg = client.org('GDGVIT');
ghorg.repos(1,52,function(err,data){
	console.log(ghorg);
	// console.log(data);
	data.forEach(function(repo){
		var name=repo.full_name;
		var ghrepo=client.repo(name);
		ghrepo.issues(1,function(err,issue){
				MongoClient.connect('mongodb://localhost:27017/gdg',function(err,db){
					var col=db.collection('data');
					col.insert({name:name,issue:issue},function(err,docs){
						console.log("Repo Inserted");
					});
				});			
		});
	});
});


var app = express();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
