import express from "express";
import path, { dirname } from "path";
import modifiedTweets from "./modified-tweets.json" assert { type: "json" };
import { TwitterApi } from "twitter-api-v2";
import { config } from "dotenv";
import { schedule } from "node-cron";
config();
const app = express();
const tweets = Array.from(modifiedTweets);
let posted = 0;
let client;

app.use(express.static(path.join(dirname(import.meta.url), "/")));

app.get("*", (req, res) => {
  res.json({
    posted,
    remaining: tweets.length,
  });
});
const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(" app is listening on port " + port);
});





async function initUser() {
    console.log("initializing user...🤩🤩")
    try {
      client = new TwitterApi({
        appKey: process.env.TWITTER_KEY,
        appSecret: process.env.TWITTER_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      });
  console.log("client created sucessfully..;.😁😁😁")
      const user = await client.v2.me();
      console.log(user);
      job.on('complete', () => {
        console.log('Cron job completed.');
      });
      startWork()
      // Start the cron job
      job.start();
      
    } catch (err) {
      console.log(err);
    }
    

  }
  
  async function postTweet(tweet) {
    if (!client) {
      console.log("client not created yet but creating....");
      await initUser();
      return "";
    }
  
    const { data: createdTweet } = await client.v2.tweet(tweet);
    console.log("tweet posted...😀")
    return createdTweet;
  }
  
  
  async function startWork() {
    if (tweets.length < 1) {
      console.log("finished working..😎😎😎, please add more tweets...")
      job.stop()
      return;
    }
    console.log('working...')
    const randomTweet = Math.floor(Math.random() * (tweets.length - 1));
    const currentTweet = tweets[randomTweet];
    posted++;
    tweets.splice(randomTweet, 1);
  
    postTweet(currentTweet);
  }
  const cronExpression = '*/15 * * * *'; // Cron expression to run every 15 minutes
  const job = schedule(cronExpression, startWork);
  
      await initUser();