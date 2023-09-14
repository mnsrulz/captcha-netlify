'use strict';
import express, { Router } from 'express';
import serverless from 'serverless-http';
const app = express();
const router = Router();
import cors from 'cors';

router.get('/yt', async (req, res) => {
    const { v } = req.query;
    if (typeof (v) == 'string') {
        res.json({
            hello: 'world'
        });
    } else {
        res.status(400).json({ error: 'Query param v not defined' });
    }
});

app.use(cors());
app.use(express.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

export const handler = serverless(app);