'use strict';
import ytdl from "ytdl-core";
// import ytdl from "@distube/ytdl-core";
// import youtubedl from 'youtube-dl-exec';
import express, { Router } from 'express';
import serverless from 'serverless-http';
const app = express();
const router = Router();
import cors from 'cors';

// const info = await ytdl.getInfo("http://www.youtube.com/watch?v=aqz-KE-bpKQ");

// const info = await youtubedl(`http://www.youtube.com/watch?v=aqz-KE-bpKQ`, {
//     dumpSingleJson: true,
//     allFormats: true
// })
// console.log(info.formats);

router.get('/', async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Hello from Express.js!</h1>');
    res.end();
});

router.get('/yt', async (req, res) => {
    const { v } = req.query;
    if (typeof (v) == 'string') {
        const info = await ytdl.getInfo(`http://www.youtube.com/watch?v=${v}`);
        // const info = await youtubedl(`http://www.youtube.com/watch?v=${v}`, {
        //     dumpSingleJson: true,
        //     allFormats: true
        // })
        res.json(info.formats);
    } else {
        res.status(400).json({ error: 'Query param v not defined' });
    }
});

app.use(cors());
app.use(express.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

export const handler = serverless(app);