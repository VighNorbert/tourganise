# Tourganise Prototype


Authors:
- Norbert Vígh
- Eduard Žňava

---

We use npm 9.8.1 and node 18.18.1 to run the project.


---
## Installing the project

To start the project, you need to install the dependencies first. You can do this by running the following commands in the project directory:

```bash
npm install
cp .env.dist .env
```

Requirements:
- You need a openAI API key. Put it in the `REACT_APP_GPT_API_KEY` variable in the `.env` file.
- OPTIONAL: You will need a Google API key to have generated images for the trips (it uses the Google Search API).
You can get the key from the Google Cloud Console. 
Put it in the `REACT_APP_GOOGLE_API_KEY` variable in the `.env` file.


---
## Running the project
To start the project, you can then run the following command:

### `npm start`
