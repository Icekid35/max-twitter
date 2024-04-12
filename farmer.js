import express from "express";
import modifiedTweeets from "./modified-tweeets.json" assert { type: "json" };

import { TwitterApi } from "twitter-api-v2";
import path, { dirname } from "path";

import { config } from "dotenv";

config();
const app = express();
const tweets = Array.from(modifiedTweeets);
let posted = 0;
let client;

async function initUser() {
  console.log("initializing user...🤩🤩");
  try {
    client = new TwitterApi({
      appKey: process.env.TWITTER_KEY,
      appSecret: process.env.TWITTER_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
    console.log("client created sucessfully..;.😁😁😁");
    const user = await client.v2.me();
    console.log(user);
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

 
  try {
   
    const { data: createdTweet } = await client.v2.tweet({
      text: tweet,
    });

await client.v2.reply(
  '@shahroonk1 @realbesttester @cryptogems555 @kenwgmi @CertLucas @NobleCoins @TweetByFarmer @zoyakhan_x @Vindicatedchidi @Cosmos_Ti @Noahhweb3 @MineOmegaCoin ' + Math.floor(Math.random()*100),
  createdTweet.id,
);

    console.log("tweet posted...😀");
    return createdTweet;
  } catch (err) {
    console.log(err);
  }
}

async function startWork() {
  if (tweets.length < 1) {
    console.log("finished working..😎😎😎, please add more tweets...");
    return;
  }
  console.log("working...");
  const randomTweet = Math.floor(Math.random() * (tweets.length - 1));
  const currentItem = tweets[randomTweet];
  const currentTweet = currentItem
   posted++;
 

  postTweet(currentTweet);
}

await initUser();

app.use(express.static(path.join(dirname(import.meta.url), "/")));

app.get("/work", async (req, res) => {
  let data = await startWork();
  res.json(data);
});
app.get("/status", async (req, res) => {
  let me = await client.v2.me();
  res.json(me);
});
app.get("/data", (req, res) => {
  res.json(tweets);
});
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
