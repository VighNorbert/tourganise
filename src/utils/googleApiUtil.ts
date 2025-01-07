import axios from "axios";

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SEARCH_ENGINE_ID = process.env.REACT_APP_GOOGLE_SEARCH_ENGINE_ID;

export async function getImageUrlFromGoogle(description: string): Promise<string | null> {
  if (!API_KEY || !SEARCH_ENGINE_ID) {
    console.error("Google API key or search engine ID not set.");
    return null;
  }

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(description)}&searchType=image`;

    console.log(url)

    const response = await axios.get(url);

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[0].link;
    } else {
      console.log("No images found for the given description.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching image from Google:", error);
    return null;
  }
}
