import { createWorker } from 'tesseract.js';
import { SIMPLE_PNG_BASE64, recognize } from './captchaV2';
import { jimpify } from './jimpify';

const jimpedImage1 = await jimpify('https://captcha-netlify.netlify.app/samples/1.jpg');
const respo = await recognize(jimpedImage1);
console.log(respo.data)

const jimpedImage2 = await jimpify('https://captcha-netlify.netlify.app/samples/2.jpg');
const respo2 = await recognize(jimpedImage2);
console.log(respo2.data)