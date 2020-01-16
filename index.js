const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const fetch=require("node-fetch");
const knex = require('knex');
// const knex1=require('knex')('config');
const cors = require('cors');
const fastcsv = require("fast-csv");
const fs = require("fs");
// const Pool = require("pg").Pool;
const {
    Parser
} = require('json2csv');
// var copyFrom = require('pg-copy-streams').from;
// const pg=require('pg');
// const client=new pg.Client();
// const copyTo = require('pg-copy-streams').to

// app.use(function(req, res, next) { res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); next(); });
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// app.use((req, res, next)=>{
//     // console.log(req);
//     console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
//     // console.log(bodyParser.json(req).body);
//     console.log(req.body);
//     next();
// });
app.use(cors());

const db = knex({
    client: 'pg',
    connection: {
        // host: '127.0.0.1',
        // user: 'postgres',
        // password: '1234',
        // database: 'onefourthlabstask'
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
});

//   const client = new Pool({
//     host: "127.0.0.1",
//     user: "postgres",
//     database: "onefourthlabstask",
//     password: "1234",
//     // port: 5432
//   });

app.get("/", (req, res) => {
    res.send("Namastey Duniyaa!");
});

app.get("/test", (req, resp) => {
    console.log(req);
    resp.json(
        "Namastey Duniyaa!"
    );
});

app.post("/insert", (req1, res) => {
    var {
        input,
        transliteration,
        lang
    } = req1.body;
    console.log(req1.body);
    console.log(input);
    if (input === undefined || input === '') {
        res.json({
            "success": false,
            "meta": {
                "message": "Empty fields are not accepted!"
            }
        });
        return;
    }
    db('transliterate')
        .insert({
            "input": input,
            "transliteration": transliteration,
            "lang": lang
        }).then((data) => {
            // console.log(data);
            res.json({
                "success": true
            });
        }).catch((err) => {
            console.log(err);
            res.json({
                "success": false,
                "meta": {
                    "message": err["detail"]
                }
            });
        });
    // resp.json(
    //     "Namastey Duniyaa!"
    // );
});

const sendingResponse = (resp) => {
    console.log("Sending Response!");
    const file = `${__dirname}/sample_table.csv`;
    // resp.download('./sample_table.csv');
    resp.download(file);
}

app.get("/download1", async (req, resp) => {
    // console.log(req.url.split("?")[1].split("=")[0]);
    // console.log(req.url.split("?")[1].split("=")[1]);
    lang = req.url.split("?")[1].split("=")[1];

    const {Parser} = require('json2csv');

    const fields = ['input', 'transliteration', 'lang'];
    const opts = {fields};

    db
    .select('*')
    .from('transliterate')
    .where('lang', '=', lang)
    .then(async (data) => {
        try {
            const parser = new Parser(opts);
            const csv = parser.parse(data);
            console.log(csv);
            fs.writeFile('file.csv', csv, function(err) {
            if (err) throw err;
            console.log('filed!');
            resp.download('file.csv');
            });
        } catch (err) {
            console.error(err);
        }
    }).catch((err)=>{
        console.log(err);
    });
});

app.get("/download", async (req, resp) => {
    // console.log(req);
    // console.log(req.body);
    // const {lang}=req.body;
    // console.log(lang);
    console.log(req.url.split("?")[1].split("=")[0]);
    console.log(req.url.split("?")[1].split("=")[1]);
    lang = req.url.split("?")[1].split("=")[1];
    // console.log(req.data);
    // const {lang}=req.data;
    // console.log(lang);

    // knex.schema.raw('COPY transliterate TO "home/Projects/Web Projects/TaskOneFourthLabs/taskonefourthlabsbackend" DELIMITER "," CSV HEADER;')
    // .then((data)=>{
    //     console.log(data);
    // }).catch((err)=>{
    //     console.log(err);
    // });
    // console.log("Here1!");
    // db.client.pool.acquire(function(err, client){
    //     console.log("Here1!");
    //     function done (err) {
    //         console.log("Here1!");
    //         knex.client.pool.release(client)
    //       if (err) console.log(err)
    //       else console.log('success')
    //     }
    //     var stream = client.query(copyFrom('COPY transliterate FROM STDIN'))
    //     var fileStream = fs.createReadStream('some_file.csv')
    //     fileStream.on('error', done)
    //     fileStream.pipe(stream).on('finish', done).on('error', done)
    //   });
    // await client.connect()
    // const q = `COPY temp_csv_table to STDOUT with csv DELIMITER ';'`
    // const dataStream = client.query(copyTo(q))

    // dataStream.on('error', async function (err) {
    // // Here we can controll stream errors
    // await client.end()
    // })
    // dataStream.on('end', async function () {
    // await client.end()
    // })
    console.log("<-------------------------------------------------------------------->");
    var jsonData;
    // new Promise(async (resolve, reject)=>{
    var flag = 0;
    db
        .select('*')
        .from('transliterate')
        .where('lang', '=', lang)
        .then(async (data) => {
            console.log(data);
            jsonData = data;
            const ws = fs.createWriteStream("sample_table.csv");
            await fastcsv
                .write(jsonData, {
                    headers: true
                })
                .on("finish", function () {
                    console.log("Postgres table transliterate exported to CSV file successfully.");
                    flag = 1;
                    return true;
                })
                .pipe(ws);
            console.log("Printintg WS");
            // console.log(ws);
            // await sendingResponse(resp);
        }).then((data) => {
            console.log("data:" + flag);
            if (flag === 1) {
                sendingResponse(resp);
            }
        }).catch((err) => {
            console.log(err);
            resp.send({
                "sucess": false,
                "meta": {
                    "message": err["detail"]
                }
            });
        });
    // })
});

app.get("/get", (req, resp) => {
    console.log("<!-----------Inside GET----------------!>");
    console.log(req.url.split("?")[1].split("=")); //.split("=")[1]
    // console.log(req.url.split("?").split("=")[2]);
    // var url=new URL(req.url);
    // var c=url.searchParams.get("");
});

app.listen(process.env.PORT || 8010, (err) => {
    if (!err) {
        if (process.env.PORT) {
            console.log(`Listening on port: ${process.env.PORT}`);
        } else {
            console.log("Listening on port 8010");
        }

    } else {
        console.log("Error launching the server!");
    }
});

// const fields=['input', 'transliteration', 'lang'];
// const opts={fields};
// try{
//     "input": input,
//     "transliteration": transliteration,
//     "lang": lang
//     const parser=new Parser({opts});
//     const csv=parser.parse(data);
//     console.log(csv);
//     resp.download();
// }
// catch(err){
//     console.log(err);
// }

// try{
// //    for()
// //     {
// //     }
//     fs.readFile('./sample_table.csv', (err, data) => {
//         if (err) throw err;
//         console.log(data);
//     });
// }
// catch(err){
//     console.log("Error!");
// }
// .then((data)=>{
//     console.log(data);
// });