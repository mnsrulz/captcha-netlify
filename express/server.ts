'use strict';
import express, { Router } from 'express';
import { join } from 'path';
import serverless from 'serverless-http';
const app = express();
const router = Router();
import Jimp from 'jimp';
// import { createWorker } from 'tesseract.js';
import Tesseract from 'tesseract.js';
import cors from 'cors';

router.get('/', async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});

router.get('/resolve', async (req, res) => {
  const { u } = req.query;
  if (typeof (u) == 'string') {
    const image = await Jimp.read(u);

    const imageName = new URL(u).pathname.split('/').pop();
    image.crop(21, 7, 36, 12);
    image.contrast(0.2)
    image.scale(100)

    for (var x = 0; x < image.bitmap.width; x++) {
      for (var y = 0; y < image.bitmap.height; y++) {
        let currentColor = image.getPixelColor(x, y);

        var rgb = Jimp.intToRGBA(currentColor);
        const min = 240;

        if (rgb.r + rgb.g + rgb.b > min) {
          let newVal = 255;
          image.setPixelColor(Jimp.rgbaToInt(newVal, newVal, newVal, newVal), x, y);
        }
      }
    }
    const imgPath = `./${imageName}.png`;
    image.scale(0.2)
    image.dither16();
    image.write(imgPath);

    res.json({
      msg: 'converted the image'
    });

    // try {
    //   const tsresult = await Tesseract.recognize(
    //     './../out.png',
    //     'eng',
    //     { logger: m => console.log(m) }
    //   )
    //   const { text } = tsresult.data;
    //   const result = {
    //     text
    //   };
    //   res.json(result);
    // } catch (error) {
    //   res.json({
    //     errorMessage: `an error occurred while recognizing the text using Tesseract`,
    //     innerError: error
    //   });
    // }


    // const worker = await createWorker({
    //   logger: m => console.log(m),
    // });

    // const lang = 'eng+por'; //por

    // (async () => {
    //   // await worker.load();
    //   await worker.loadLanguage(lang);
    //   await worker.initialize(lang);
    //   await worker.setParameters({
    //     tessedit_char_whitelist: '0123456789',
    //   });

    //   const { data: { text } } = await worker.recognize(imgPath);
    //   console.log(`recognized: ${text}`);
    //   await worker.terminate();

    //   const result = {
    //     text
    //   };
    //   res.json(result);
    // })()

  } else {
    res.status(400).json({ error: 'Query param u not defined' });
  }
});

router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(cors());
app.use(express.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(join(__dirname, '../index.html')));

export const handler = serverless(app);