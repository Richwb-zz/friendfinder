var express = require('express');
var router = express.Router();
var path = require("path");
var app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/friends', function(req, res, next) {
	console.log("test2");
	console.log(app.get('data'));
	res.render('friends', {retrievedData : app.get('data')});
});

router.post('/friends', function(req, res, next) {
  var fs = require('fs');

  	var scores = [];
	var addNewFriend = {};
	var friends = [];
	var friendsList;

	for(var key in req.body){
		if(key !== "name"){
			scores.push(req.body[key].trim());
		}
	}

	addNewFriend = {
		name: req.body["name"].trim(),
		scores: scores
	};

	fs.readFile(path.join(__dirname, "../data/friends.js"), function(err, data){
		if(err){
			console.log(err);
		}
		friendsList = JSON.parse(data);
		findMatch(friendsList, scores, res);


		friendsList.push(addNewFriend);

		// fs.writeFile(path.join(__dirname, "../data/friends.js"), JSON.stringify(friendsList), function(err){
		// 	if(err){
		// 		console.log(err);
		// 	}
		// });
	});
});

function findMatch(possibleMatches, yourScores, res){
	var matches = [];
	var bestMatch = 0;
	var thisPersonScores = [];
	var matchTestScore = 0;

	for (var i = 0; i < possibleMatches.length; i++) {
		matchTestScore = 0;
		thisPersonScores = possibleMatches[i]["scores"];

		for (var j = 0; j < thisPersonScores.length; j++) {
			matchTestScore += Math.abs(thisPersonScores[j] - yourScores[j]);
		}
		
		if(matchTestScore < bestMatch || matches.length === 0){
			bestMatch = matchTestScore;
			matches = [[i, matchTestScore]]
		}else if(matchTestScore === bestMatch){
			matches.push([possibleMatches[i]["name"], matchTestScore]);
		}
	}
	console.log("test");
	res.render('friends', {"data" : matches});
}

module.exports = router;