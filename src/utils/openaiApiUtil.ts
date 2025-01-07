import OpenAI from "openai";

const openaiApiUtil = new OpenAI({
	apiKey: process.env.REACT_APP_GPT_API_KEY,
	dangerouslyAllowBrowser: true
});

export async function getItineraries(
	location: string,
	startDate: string,
	finishDate: string,
	intensity: string,
	preferences: string[],
	contraFactual?: boolean
) {
	return openaiApiUtil.chat.completions.create({
		model: "gpt-3.5-turbo-16k",
		messages: [
			{
				"role": "system",
				"content": "Your task is to prepare a itinerary according to the user's preferences. Reply solely in JSON format. Your reply should only consist of the JSON response.\nIt should be an array of recommended itineraries.\nDo not include no actual attractions, we only need the general type of the roadtrip.\nMake sure to partially include the location in the names of the roadtrips.\n\nAll recommendations should span over the full itinerary of the roadtrip, all the days.\n\nDo not format the JSON! Minimize the whitespaces used for formatting. Doesn't need to be nice, just make sure it is valid JSON.\n\nInclude several alternatives, worst case at least 3, ideally at least 5, but more are very welcome. \n\nThe schema of the JSON response should be the following:\nThe array should contain Recommendation objects.\n\nRecommendation object constist of:\nid: unique integer identifier\nname: very descriptive name with less than 30 characters, it should be obvious what kind of a trip it is and where it is (location),\nlocation: broad location of the trip, region or country,\nlength: number - expected number of kilometers, if you don't know then make a guess, but try to not overshoot it if it's only a city walk, but give a higher value if car driving is necessary to different locations. It is OK to also give just a low number as 20 if the user is only staying in one city,\nconfidence: number 1-20 where numbers near 10 are desired, 1 means that there is little data about that kind of trips, 20 means that there is too much data about this kind of trips, which can skew the results.\ntags: Array of Tag objects. Select a subset of user's preferences that could match a given trip. Include also other tags matching from the list of all available tags.\n\nTag object constist of:\nname: string - name of the tag\nweight: an integer representing the importance measure of the tag in the given recommendation in range 20-90 like 27, 42, or 89.\n\n\n",
			},
			{
				"role": "user",
				"content": "I want to go to " + (contraFactual === undefined ? location : "any location except " + location) + " for a road trip from " + startDate + " to " + finishDate + ". \n\n"
					+ "I prefer to take a " + intensity + " intensity of the roadtrip.\n\n"
					+ "My preferences are the following: " + JSON.stringify(preferences) + "\n\n"
				  + "List of all available tags: [\"Mountain Hiking ⛰️\",\"National Park Exploration 🏞️\",\"Forest Trails 🌲\",\"Nature Walks 🚶️\",\"Camping 🏕️\",\"Lake Excursions 🚣\",\"Sunrise/Sunset Viewing 🌅\",\"City Tours 🏙️\",\"Shopping Districts 🛍️\",\"Urban Photography 📸\",\"Museum Visits 🏬\",\"Skyline Views 🌇\",\"Nightlife 🍸\",\"Street Food 🍜\",\"Scenic Drives 🗺️\",\"Coastal Walks 🏖️\",\"Train Journeys 🛤️\",\"Harbor Cruises 🚢\",\"Desert Safari 🏜️\",\"Para-gliding 🪂\",\"Skiing/Snowboarding ⛷️\",\"Cycling Tours 🚴‍♂️\",\"Motorbike Tours 🏍️\",\"Rock Climbing 🧗‍♂️\",\"Water Sports 🏄‍♂️\",\"Extreme Sports 🤸‍♂️\",\"Scenic Viewpoints 🏞️\",\"Wildlife Photography Spots 🦜\",\"Architectural Landmarks 🏛️\",\"Natural Wonders 🌄\",\"Sunrise/Sunset Photography 🌅\",\"Botanical Gardens 🌺\",\"Food Tours 🍲\",\"Wine Tastings 🍷\",\"Gourmet Food Markets 🥐\",\"Chocolate Tastings 🍫\",\"Cheese Tastings 🧀\",\"Local Cuisine 🍜\",\"Castle Visits 🏰\",\"Historical Sites 🏛️\",\"Ancient Ruins ⛏️\",\"Monuments 🗽\",\"Cultural Heritage Sites 🌍\",\"Archeological Sites 🔍\"]"
			}
		],
		temperature: 1,
		max_tokens: 6500,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
	});
}

export async function getItineraryPlan(
	location: string,
	startDate: string,
	finishDate: string,
	intensity: string,
	preferences: string[],
	roadTripName: string
) {
	return openaiApiUtil.chat.completions.create({
		model: "gpt-3.5-turbo-16k",
		messages: [
			{
				"role": "system",
				"content": "Your task is to prepare a thorough itinerary according to the user's preferences. \nPlease prepare a thorough road trip itinerary according to my preferences. Reply solely in JSON format. Include also times from and to when the user should be visiting a given point of interest in the itinerary. Your reply should only consist of the JSON response.\n\nIt should be a JSON object as described below.\n\nInclude several spots every day, based on the selected intensity by the user.\n\nThe itinerary should take place over all the days as mentioned by the user.\n\nDo not format the JSON! Minimize the whitespaces used for formatting. Doesn't need to be nice, just make sure it is valid JSON.\n\nThe schema of the JSON response should be the following:\nThe object should contain an array named \"days\" of objects of type DayItinerary.\n\nThe DayItinerary object contains:\ndate: ISO date of the day,\nattractions: an array of Attraction objects.\n\nThe Attraction object contains:\nname: short name of the attraction to be visited,\ndesctiption: a short description of the attraction and what activities should the user try,\ntime: a time range when the user should be at the given spot during that day, might be in hours or time of day.\n\n\n "
			},
			{
				"role": "user",
				"content": "I want to go to " + location + " for a road trip from " + startDate + " to " + finishDate + ". \n\n"
					+ "I prefer to take a " + intensity + " intensity of the roadtrip.\n\n"
					+ "My preferences are the following: " + JSON.stringify(preferences) + "\n\n"
					+ "I'm interested in a roadtrip that you recommended with the name: " + roadTripName
			}
		],
		temperature: 1,
		max_tokens: 10000,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
	});
}


export async function getAccommodations(
	location: string,
	roadTripName: string,
	attractionNames: string[],
	preferences: string[]
) {
	return openaiApiUtil.chat.completions.create({
		model: "gpt-4",
		messages: [
			{
				"role": "system",
				"content": "Your task is to prepare a list of possible accommodations according to the user's preferences. Reply solely in JSON format. Your reply should only consist of the JSON response.\n" +
					"It should be an array of recommended accommodations.\n" +
					"The accommodations do not need to be existent, it is enought that it makes sense in the setting of the given location.\n" +
					"\n" +
					"Do not format the JSON! Minimize the whitespaces used for formatting. Doesn't need to be nice, just make sure it is valid JSON.\n" +
					"\n" +
					"Include several alternatives, worst case at least 3. Make sure that they fit the user's preferences as good as possible. \n" +
					"\n" +
					"The schema of the JSON response should be the following:\n" +
					"The array should contain Accommodation objects.\n" +
					"\n" +
					"Recommendation object constist of:\n" +
					"name: name of the accommodation,\n" +
					"description: short description of the accommodation in a form of a listing,\n" +
					"pricePerNight: cost of a night stay in local currency,\n" +
					"currency: 3 letter code of the local currency,\n" +
					"location: specific location of the accommodation, preferably including street address,\n" +
					"tags: list of preferences that match the user's requirements in the given accommodation"
			},
			{
				"role": "user",
				"content": "I want to go to " + location + " for a road trip. \n\n" +
					"The roadtrip's general name is: " + roadTripName + ", and includes the following attractions:\n" +
					JSON.stringify(attractionNames) + "\n\n" +
					"My accommodation preferences are the following: " + JSON.stringify(preferences) + "\n\n"
			}
		],
		temperature: 1,
		max_tokens: 6500,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
	});
}

