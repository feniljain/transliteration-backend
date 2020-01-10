const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const fetch=require("node-fetch");
const knex=require('knex');
// const knex1=require('knex')('config');
const cors=require('cors');
const fastcsv = require("fast-csv");
const fs = require("fs");
const Pool = require("pg").Pool;
const { Parser } = require('json2csv');
// var copyFrom = require('pg-copy-streams').from;
// const pg=require('pg');
// const client=new pg.Client();
// const copyTo = require('pg-copy-streams').to


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

const db=knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '1234',
      database : 'onefourthlabstask'
    }
  });

  const client = new Pool({
    host: "127.0.0.1",
    user: "postgres",
    database: "onefourthlabstask",
    password: "1234",
    // port: 5432
  });

app.get("/test",(req, resp)=>{
    console.log(req);
    resp.json(
        "Namastey Duniyaa!"
    );
});

app.post("/insert", (req, resp)=>{
    var {input, transliteration, lang}=req.body;
    console.log(req.body);
    db('transliterate')
    .insert({
        "input": input,
        "transliteration": transliteration,
        "lang": lang
    }).then((data)=>{
        console.log(data);
        resp.json({
            "success": true
        });
    }).catch((err)=>{
        console.log(err);
        resp.json({
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

app.post("/download", async (req, resp) =>{
    const {lang}=req.body;
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
    db
    .select('*')
    .from('transliterate')
    .where('lang', '=', lang)
    .then(async (data)=>{
        console.log(data);
        jsonData=data;

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
        const ws = fs.createWriteStream("sample_table.csv");
        await fastcsv
        .write(jsonData, { headers: true })
        .on("finish", function() {
            console.log("Postgres table transliterate exported to CSV file successfully.");
        })
        .pipe(ws);     
        console.log(ws);
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
        await resp.download('./sample_table.csv');
        // .then((data)=>{
        //     console.log(data);
        // });
    }).catch((err)=>{
        console.log(err);
        resp.send({
            "sucess": false,
            "meta": {
                "message": err["detail"]
            }
        });
    });
});

app.listen(process.env.port || 8010, (err)=>{
    if(!err){
        console.log("Listening on port 8010");
    }
    else{
        console.log("Error launching the server!");
    }
});