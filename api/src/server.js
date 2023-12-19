require("dotenv").config({path:"../.env"})
require('./connections/mongo.connection')();
// const quranCtrl = require('./controllers/quran.controller');

// (async()=>{
//    const {ok,data,message}=  await quranCtrl.queryDb("I alone is worthy of your worship");
//    console.log({ok,data,message})

// })()


const {APP_PORT} = require("./configs")
const express = require("express");
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/api/v1/quran", require("./routes/quran.route")());


app.listen(APP_PORT, () => {
    console.log(`Quran Microservice listening on port: ${APP_PORT}`)
});
