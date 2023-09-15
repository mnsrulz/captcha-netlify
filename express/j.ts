'use strict';
import { promisify } from "util";
import express, { Router } from 'express';
import serverless from 'serverless-http';
const app = express();
const router = Router();
import cors from 'cors';
import Jimp from 'jimp';
// import { recon } from './captcha';
import { recognize } from './captchaV2';

router.get('/yt', async (req, res) => {
  const { v } = req.query;
  if (typeof (v) == 'string') {
    try {
      const jimpedImage = await jimpify(v);
      const resp = await recognize(jimpedImage);
      res.json({
        data: {
          text: resp.data.text
        }
      });
    } catch (error) {
      res.json({
        error
      });
    }
  } else {
    res.status(400).json({ error: 'Query param v not defined' });
  }
});

app.use(cors());
app.use(express.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

export const handler = serverless(app);

const jimpify = async (u) => {
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

  const boundGetBuffer = promisify(image.getBuffer.bind(image));
  return await boundGetBuffer();
  
}