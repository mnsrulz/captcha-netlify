'use strict';
import Jimp from 'jimp';

export const jimpify = async (u): Promise<Buffer> => {
  console.log(`loading the image`);
  const resp = await fetch(u)
  if (!resp.ok) throw new Error(`non okay response ${resp.status}:${resp.statusText} received!`);
  const arrayBuffer = await resp.arrayBuffer();
  console.log(`reading the image buffer completd`);
  const image = await Jimp.read(Buffer.from(arrayBuffer));

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
  // const imgPath = `./${imageName}.png`;
  image.scale(0.2)
  image.dither16();
  // image.write(imgPath);

  return new Promise((resolve, reject) => {
    image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
      resolve(buffer)
    });
  })
}