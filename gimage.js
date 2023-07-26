import {GoogleSearch} from "google-search-results-nodejs";
import { config } from "dotenv";
config();

const search = new GoogleSearch("ec01141dcd32cac296bcbd22d47f26c5cf883dd4ba244f68a056d96f4f7a6266"); //your API key from serpapi.com

const searchQuery = "bugatti chiron";

const params = {
    engine: "google",
    q: "aki and pawpaw laughing",
    location: "Austin, Texas, United States",
    google_domain: "google.com",
    gl: "us",
    hl: "en",
    tbm: "isch"
  }
const getJson = () => {
  return new Promise((resolve) => {
    search.json(params, resolve);
  });
};

const getResults = async () => {
  const imagesResults = [];
  const json = await getJson();
//   while (true) {
//     console.log(json)
    if (json.images_results) {
      imagesResults.push(...json.images_results.filter(img=>img.source != 'tensor').splice(0,9));
    //   params.ijn ? (params.ijn += 1) : (params.ijn = 1);
    } else {
        console.log('no result found...')
    }
//   }
  return imagesResults;
};

getResults().then((result) => console.dir(result, { depth: null }));