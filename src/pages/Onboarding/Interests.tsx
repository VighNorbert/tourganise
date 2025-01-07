import React from 'react';

export default function Interests(props: { onContinue: () => void }) {
  const categories = [
        {
          "name": "Nature Escapes 🌿",
          "interests": [
            "Mountain Hiking ⛰️",
            "National Park Exploration 🏞️",
            "Forest Trails 🌲",
            "Nature Walks 🚶️",
            "Camping 🏕️",
            "Lake Excursions 🚣",
            "Sunrise/Sunset Viewing 🌅"
          ]
        },
        {
          "name": "City Breaks 🏙️",
          "interests": [
            "City Tours 🏙️",
            "Shopping Districts 🛍️",
            "Urban Photography 📸",
            "Museum Visits 🏬",
            "Skyline Views 🌇",
            "Nightlife 🍸",
            "Street Food 🍜"
          ]
        },
        {
          "name": "Scenic Sightseeing 🏞️",
          "interests": [
            "Scenic Drives 🗺️",
            "Coastal Walks 🏖️",
            "Train Journeys 🛤️",
            "Harbor Cruises 🚢",
            "Desert Safari 🏜️"
          ]
        },
        {
          "name": "Activities ⛷️",
          "interests": [
            "Para-gliding 🪂",
            "Skiing/Snowboarding ⛷️",
            "Cycling Tours 🚴‍♂️",
            "Motorbike Tours 🏍️",
            "Rock Climbing 🧗‍♂️",
            "Water Sports 🏄‍♂️",
            "Extreme Sports 🤸‍♂️"
          ]
        },
        {
          "name": "Photography Opportunities 📷",
          "interests": [
            "Scenic Viewpoints 🏞️",
            "Wildlife Photography Spots 🦜",
            "Architectural Landmarks 🏛️",
            "Natural Wonders 🌄",
            "Sunrise/Sunset Photography 🌅",
            "Botanical Gardens 🌺"
          ]
        },
        {
          "name": "Culinary Tours 🍽️",
          "interests": [
            "Food Tours 🍲",
            "Wine Tastings 🍷",
            "Gourmet Food Markets 🥐",
            "Chocolate Tastings 🍫",
            "Cheese Tastings 🧀",
            "Local Cuisine 🍜"
          ]
        },
        {
          "name": "Historical Landmarks 🏰",
          "interests": [
            "Castle Visits 🏰",
            "Historical Sites 🏛️",
            "Ancient Ruins ⛏️",
            "Monuments 🗽",
            "Cultural Heritage Sites 🌍",
            "Archeological Sites 🔍"
          ]
        }
      ];

  const [selectedInterests, setSelectedInterests] = React.useState([] as string[])


  return (
      <div className="container">
        <h2 className="h1 text-center mt-2 mb-4 font-madimione text-secondary">Let's get to know you better, Traveller!</h2>
        <p className="">
          Please select your interests from the list below. We will use this information to recommend tours that you might like.
        </p>

        <div className="interestScroller">
          {categories.map((category, c_index) => (
            <section className="mb-3" key={c_index}>
              <h2 className="h6">{category.name}</h2>
              <div className="d-flex flex-wrap">
                {category.interests.map((interest, i_index) => (
                  <div key={i_index}>
                    <input type="checkbox"
                           className="btn-check"
                           checked={selectedInterests.includes(interest)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedInterests([...selectedInterests, interest])
                              } else {
                                setSelectedInterests(selectedInterests.filter((i) => i !== interest))
                              }
                            }}
                           id={"btn-check-" + c_index + "-" + i_index} autoComplete="off"
                    />
                    <label className="btn btn-sm me-1 mb-1" style={{fontSize:"12px"}} htmlFor={"btn-check-" + c_index + "-" + i_index}>{interest}</label>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="text-center my-3">
          <div className="mb-3">
            <small className="text-danger-dark">
              {selectedInterests.length < 5 ? "Please select " + (5 - selectedInterests.length)  + " more interests to continue." : <span>&nbsp;</span>}
            </small>
          </div>

          <button
            className="btn btn-primary px-4 w-100"
            disabled={selectedInterests.length < 5}
            onClick={() => {
              localStorage.setItem('interests', JSON.stringify(selectedInterests));
              props.onContinue();
            }}>
            Continue
          </button>
          <button
            className="btn btn-outline-primary px-4 me-2 mt-2 w-100"
            onClick={() => {
              localStorage.setItem('interests', JSON.stringify(selectedInterests));
              props.onContinue();
            }}>
            Proceed without interests
          </button>
        </div>
      </div>
  );
}

