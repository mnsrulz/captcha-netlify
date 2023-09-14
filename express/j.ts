'use strict';
import express, { Router } from 'express';
import serverless from 'serverless-http';
const app = express();
const router = Router();
import cors from 'cors';
import { recon } from './captcha';
import { readdirSync } from 'node:fs'
router.get('/yt', async (req, res) => {
    const files = walkSync('./', []);

    const { v } = req.query;
    if (typeof (v) == 'string') {
        let resp;
        try {
            resp = await recon(v)
        } catch (error) {

        }
        res.json({
            resp,
            files
        });
    } else {
        res.status(400).json({ error: 'Query param v not defined' });
    }
});

app.use(cors());
app.use(express.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

export const handler = serverless(app);


var walkSync = function(dir, filelist) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
      if (fs.statSync(dir + file).isDirectory()) {
        filelist = walkSync(dir + file + '/', filelist);
      }
      else {
        filelist.push(file);
      }
    });
    return filelist;
  };