import React from 'react';

export default function AccommodationPreferences(props: { onContinue: () => void }) {
  const accommodationPreferences = [
    {
      "name": "Accommodation Types 🏠",
      "options": [
        "Hotel 🏨",
        "Motel / Hostel 🏠",
        "AirBnB 🏡",
        "Campground ⛺",
        "RV Park 🚐",
        "Resort 🏖️",
        "Cabin or Cottage 🏡",
        "Farm Stay 🚜",
        "Treehouse 🌳",
        "Boat House ⛵"
      ]
    },
    {
      "name": "Quality ✨",
      "options": [
        "Cleanliness 🧼",
        "Good Reviews 👍",
        "Comfort 🛏️",
        "Safety 🚨",
        "Staff Friendliness 😀",
        "Value for Money 💰",
        "Quietness 🔇",
        "Room Size 🛌"
      ]
    },
    {
      "name": "Services 🛎️",
      "options": [
        "Luggage Storage 🧳",
        "Laundry Facilities 🧺",
        "24/7 Front Desk 🛎️",
        "Pet-Friendly 🐕",
        "Free Wi-Fi 📶",
        "Free Parking 🅿️",
        "Private Bathroom 🚽",
      ]
    },
    {
      "name": "Accessibility ♿",
      "options": [
        "Wheelchair Accessible ♿",
        "Parking 🅿️",
        "Elevator/Lift 🛎️",
        "Non-Smoking Rooms 🚭",
        "No Pets Allowed 🚫",
        "Dietary Options 🍽️",
        "Family-Friendly 👨‍👩‍👧‍👦"
      ]
    }
  ];

  const [selectedPreferences, setSelectedPreferences] = React.useState([] as string[])


  return (
    <div className="container">
      <h2 className="h1 text-center mt-2 mb-4 font-madimione text-secondary">What is your perfect accommodation?</h2>
      <p className="">
        Please select the accommodation aspects that you find most important to help us recommend the best accommodation options for you.
      </p>

      <div className="interestScroller">
        {accommodationPreferences.map((category, c_index) => (
          <section className="mb-3" key={c_index}>
            <h2 className="h6">{category.name}</h2>
            <div className="d-flex flex-wrap">
              {category.options.map((option, i_index) => (
                <div key={i_index}>
                  <input type="checkbox"
                         className="btn-check"
                         checked={selectedPreferences.includes(option)}
                         onChange={(e) => {
                           if (e.target.checked) {
                             setSelectedPreferences([...selectedPreferences, option])
                           } else {
                             setSelectedPreferences(selectedPreferences.filter((i) => i !== option))
                           }
                         }}
                         id={"btn-check-" + c_index + "-" + i_index} autoComplete="off"
                  />
                  <label className="btn btn-sm me-1 mb-1" style={{fontSize: "12px"}}
                         htmlFor={"btn-check-" + c_index + "-" + i_index}>{option}</label>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="my-3">
        <div className="mb-3">
          <small className="text-danger-dark">
            <span>&nbsp;</span>
          </small>
        </div>

        <button
          className="btn btn-primary px-4 w-100"
          disabled={selectedPreferences.length === 0}
          onClick={() => {
            localStorage.setItem('accommodation', JSON.stringify(selectedPreferences));
            props.onContinue();
          }}>
          Continue
        </button>
        <button
          className="btn btn-outline-primary px-4 mt-2 w-100"
          onClick={() => {
            localStorage.setItem('accommodation', JSON.stringify(selectedPreferences));
            props.onContinue();
          }}>
          Proceed without preferences
        </button>
      </div>
    </div>
  );
}

