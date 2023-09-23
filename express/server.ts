import express, { Router } from 'express';
import serverless from 'serverless-http';
const app = express();
const router = Router();
import cors from 'cors';
import { recognize } from './captchaV2';
import { jimpify } from './jimpify';

router.get('/captcha', async (req, res) => {
  const { i } = req.query;
  if (typeof (i) == 'string') {
    try {
      const jimpedImage = await jimpify(i);
      const resp = await recognize(jimpedImage);
      res.json({
        data: {
          text: resp.data.text.trim()
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
