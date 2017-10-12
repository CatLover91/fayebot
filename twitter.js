var config = require('./config');
var core = require('./core');
var T = require('twit');
var tweetQueue = [];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkTweetQueue(){
  if (tweetQueue.length > 0){
    var newTweet = tweetQueue.shift();
    if (loggingEnabled === true){
      console.log('Posting new tweet:');
      console.log(newTweet);    
    }

    twitter.post('statuses/update',
    {
      status: newTweet.text,
      in_reply_to_status_id: newTweet.id
    }, function(err, data, response) {
      if (loggingEnabled === true){
        if (err){
          console.log('ERROR');
          console.log(err);          
        }
        else{
          console.log('NO ERROR');          
        }
      }
    });
  }

var twitter = new T(config.twitter);

var stream = twitter.stream('statuses/filter', { track: '@' + config.username });

stream.on('tweet', function (tweet) {
  var reply = core.reply("local-user", tweet.text);
  if (loggingEnabled === true){
    console.log('New Tweet!');
    console.log(tweet.id + ': ' + tweet.text);
    console.log('Adding response to queue:');
    console.log('@' + tweet.user.screen_name + ' ' + reply);
  }

  tweetQueue.push({
    id: tweet.id_str,
    text: '@' + tweet.user.screen_name + ' ' + reply
  });
});

checkTweetQueue();