import express from "express";
import path, { dirname } from "path";
import modifiedTweets from "./modified-tweets.json" assert { type: "json" };
import { TwitterApi } from "twitter-api-v2";
import { GoogleSearch } from "google-search-results-nodejs";
import fs from "node:fs";

import { config } from "dotenv";
import axios from "axios";
config();
const app = express();
const tweets = Array.from(modifiedTweets);
let posted = 0;
let client;
const search = new GoogleSearch(
  "ec01141dcd32cac296bcbd22d47f26c5cf883dd4ba244f68a056d96f4f7a6266"
); //your API key from serpapi.com

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

const getJson = (params) => {
  return new Promise((resolve) => {
    search.json(params, resolve);
  });
};

async function downloadImage(imageUrl, destinationPath) {
  try {
    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream",
    });

    // Ensure the destination folder exists
    const destinationFolder = path.dirname(destinationPath);
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }

    response.data.pipe(fs.createWriteStream(destinationPath));

    return new Promise((resolve, reject) => {
      response.data.on("end", () => resolve(destinationPath));
      response.data.on("error", reject);
    });
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
}

const getResults = async (params) => {
  const imagesResults = [];
  const json = await getJson(params);
  //   while (true) {
  //     console.log(json)
  if (json.images_results) {
    imagesResults.push(
      ...json.images_results
        .filter((img) => img.source != "tensor")
        .splice(0, 2)
    );
    //   params.ijn ? (params.ijn += 1) : (params.ijn = 1);
  } else {
    console.log("no result found...");
  }
  //   }
  const original =
    imagesResults[Math.floor(Math.random() * (imagesResults.length - 1))]
      .original;
  const tempImg = downloadImage(
    original,
    original.split("/")[original.split("/").length - 1]
  );
  return tempImg;
};

async function postTweet(tweet, emotion) {
  if (!client) {
    console.log("client not created yet but creating....");
    await initUser();
    return "";
  }

  const params = {
    engine: "google",
    q: emotion + " aki and pawpaw meme",
    location: "nigeria",
    google_domain: "google.com",
    gl: "us",
    hl: "en",
    tbm: "isch",
  };

  try {
    const imageMeme = await getResults(params);

    const mediaIds = await Promise.all([client.v1.uploadMedia(imageMeme)]);
    const { data: createdTweet } = await client.v2.tweet({
      text: tweet,
      media: { media_ids: mediaIds },
    });
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
  const currentTweet = currentItem.tweet;
  const currentEmotion = currentItem.emotion;
  posted++;
  tweets.splice(randomTweet, 1);

  postTweet(currentTweet, currentEmotion);
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
