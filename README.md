# transliterationBackend

## Quick Start

The backend is built in NodeJs and is hosted [here](https://obscure-gorge-36873.herokuapp.com/). To run the backend, after cloning the repo enter "cd taskonefourthlabsbackend" and run "npm install". After completing follow the database setup instructions as given below.

As you complete the whole setup, enter "npm start". The backend will start listening on port 8010.

## Available Routes:

### GET

"/": Returns "Namastey Duniyaa!", just for testing the activeness of backend.<br />
"/download": Route to accept the language in the request url and convert it into csv using json2csv package.<br />
"/download1": Route to accept the language in the request url and convert it into csv using fastcsv package.<br />

### POST

"/insert": For making a new entry in the database.<br />
Request parameter accepted: input, transliteration, lang.<br />
input: Corresponding to input string.
transliteration: translated form of input. 
lang: translation language used.

## For Database Setup:

Install the postgres database on your local machine, and setup a user named postgres with your custom password.

After doing so create a database named onefourthlabstask follwed by a table named transliterate having three fields, namely, input, transliteration, and lang.

After completing above steps, move onto backend file, i.e. index.js, where make sure to uncomment lines 36 to 39 and comment lines 40 and 41. After uncommenting change the password in line 38 to your own password (set by you while setting up the database).

Now you are good to go!

## Note

Routing and proper file structure is not added in the project as it was a simple project with not many routes to call, its presented as a monolithic code itself in index.js file.

In case of any discripancies please feel free to open issues, I will revert to them as soon as possible!
