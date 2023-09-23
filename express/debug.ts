import { createWorker } from 'tesseract.js';
import { SIMPLE_PNG_BASE64, recognize } from './captchaV2';
import { jimpify } from './jimpify';

const jimpedImage = await jimpify('https://captcha-netlify.netlify.app/samples/jhc2caqrv44rrt5vrqkavkrfvqodw52vbixnjopnya.jpg');
const respo = await recognize(jimpedImage);
console.log(respo.data)