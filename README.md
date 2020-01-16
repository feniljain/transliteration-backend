# transliterationBackend

## Quick Start

The backend is built in NodeJs and is hosted [here](https://obscure-gorge-36873.herokuapp.com/). To run the backend, after cloning the repo enter "cd taskonefourthlabsbackend" and run "npm install".

After the installation is completed, enter "npm start". The backend will start listening on port 8010.

## Available Routes:

### GET

"/": Returns "Namastey Duniyaa!", just for testing the activeness of backend.<br />
"/download": Route to accept the language in the request url and convert it into csv using json2csv.<br />
"/download1": Route to accept the language in the request url and convert it into csv using fastcsv.<br />

### POST

"/insert": For making a new entry in the database.

Request parameter accepted: input, transliteration, lang.

input: Corresponding to input string.
transliteration: translated form of input. 
lang: translation language used.
