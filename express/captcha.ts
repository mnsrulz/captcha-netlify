let api: any;
let TessModule
import { gunzipSync } from 'zlib';
import { simd } from 'wasm-feature-detect';
import defaultParams from 'tesseract.js/src/worker-script/constants/defaultParams';
import defaultOutput from 'tesseract.js/src/worker-script/constants/defaultOutput';
const SIMPLE_PNG_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0CAIAAABqhmJGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASuSURBVHhe7dftVdswAIbRzsVAzMM0XabDUCOUxLYsWW4Jp+/pvf9w9GH76CHw4x2IJWAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAI9p8G/PbyY8rL2686g8t+vnqHTyfgIYfvz/26veTXn/UKX8+f0EU9bHrtu/6KfAN/AwEXAj7lFf2TBFw4nae8on+SgIvJ01n/KLzpDK+L3bT/Ap4O+HC+V12mTH+M3gzcLbIY/EO6HfxYp13k09nb6r3UqcdnjoCL3ll72J26h+35Oxy2XvZ0wOLaXq9v2+F1UC+7RZtMZ/DnfX1lwDOPzwUCLo7O2trtDK8H3M/iqoc6bj1subT68XTA/F7bGJooyzKbhTvLPHY8eJLHlbNX1DqYUVfdXbqwJjsCLsans37aNNJM6w68OR0wv9f9ymKw3k67yn2ZZpHlg3a3zis60s6oV+ZvlzMCLoanc3Dsdt9TdWT/lM8OmNjr5KY72jmzq1zfrbvXtVtmRMDF8HTWcgaaqIrD1U4G/MFewxrW262s5jS/Fzpmdts6mnHy+Fwl4GJ0OjsNrG1P/y7CNo3+gEt7jW56MVprNed7A/5w+n6YJ+BieDpnj/jO6pweTz0acGWvmZveL9XOmd3x6wKuTt8PEwRczLRw4eje1XX7c/cDruw1uuneOu2c4aOvzI57mJhRh1xZlQ0BF+Oz9vcF96fuB1zYa7R2b5mD6/XSwdfg8snj4q21+W/L02dfzIxhQMDFyTm6Hd7m+JYP7rPKT5sRuzhOBywm91rUkYc3fV9ltchtr8VmzuGOdfDB9N1tFYefNfdXLmyGjNZkhoCLUQufVqd/7z7rUcLW/XieDvg0s9difNOdRV5ePibt5vTuazusWbF9rs2E5v4mH58LBFyMW7g5OID7s9cMuTygmt9rcNPb5MrAz0lHc3Z9Ht7XZsxqxO36ZtLR/c0+PpMEzLOc/4LhrwmYZ6lfywJ+JgHzJPr9DgLmi23/zdXvcwmYL7YKWL1PJ2AIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmCI9f7+G6yFxVg/GyYwAAAAAElFTkSuQmCC';
// import { setImage } from './setImage'
// import TesseractCore from 'tesseract.js-core/tesseract-core-simd';
import tsc from 'tesseract.js-core/tesseract-core-simd';
import  dump  from 'tesseract.js/src/worker-script/utils/dump';
import  setImage  from 'tesseract.js/src/worker-script/utils/setImage';
// import { dump } from './dump';

import importImage  from 'tesseract.js/src/worker/node/loadImage';

export const recon = async (image: string) => {
    const fetchUrl = 'https://tessdata.projectnaptha.com/4.0.0/osd.traineddata.gz';
    const resp = await fetch(fetchUrl);
    if (!resp.ok) {
        throw Error(`Network error while fetching ${fetchUrl}. Response code: ${resp.status}`);
    }
    let data = new Uint8Array(await resp.arrayBuffer());

    // Check for gzip magic numbers (1F and 8B in hex)
    const isGzip = (data[0] === 31 && data[1] === 139) || (data[1] === 31 && data[0] === 139);

    if (isGzip) {
        data = gunzipSync(data);
    }

    const simdSupport = await simd();
    if (simdSupport) console.log('simd supported!!')

    TessModule = await tsc();

    console.log('TEssModule loaded!')

    TessModule.FS.writeFile(`./eng.traineddata`, data);

    console.log('trained data written!')

    api = new TessModule.TessBaseAPI();

    console.log('api loaded!')
    const langs = 'eng', oem = '3';
    if (api) {
        const status = api.Init(null, langs, oem);
        console.log(status);

        await setParameters({ payload: { params } });
        console.log('setting params!');

        const rotateRadiansFinal = 0;
        const img = await importImage(SIMPLE_PNG_BASE64);
        if(img){
            setImage(TessModule, api, img, rotateRadiansFinal);
            console.log('image set!')
        }

        api.Recognize(null);
        console.log('calling api recognize!')

        const pdfTitle = null, pdfTextOnly = null;
        const output = {
            blocks: true,
            text: true,
            hocr: true,
            tsv: true,
        };

        const { workingOutput, skipRecognition } = processOutput(output);

        const result = dump(TessModule, api, workingOutput, { pdfTitle, pdfTextOnly, skipRecognition });

        console.log(result.text);

        return result.text;

    } else {
        console.log('api is null');
    }

    // const ts = TessModule.FS['test']();
    // if (ts) {
    //     return '';
    // }
    return image;
}

let params = defaultParams;

const setParameters = async ({ payload: { params: _params } }, res?) => {
    const initParamNames = ['ambigs_debug_level', 'user_words_suffix', 'user_patterns_suffix', 'user_patterns_suffix',
        'load_system_dawg', 'load_freq_dawg', 'load_unambig_dawg', 'load_punc_dawg', 'load_number_dawg', 'load_bigram_dawg',
        'tessedit_ocr_engine_mode', 'tessedit_init_config_only', 'language_model_ngram_on', 'language_model_use_sigmoidal_certainty'];

    const initParamStr = Object.keys(_params)
        .filter((k) => initParamNames.includes(k))
        .join(', ');

    if (initParamStr.length > 0) console.log(`Attempted to set parameters that can only be set during initialization: ${initParamStr}`);

    Object.keys(_params)
        .filter((k) => !k.startsWith('tessjs_'))
        .forEach((key) => {
            api.SetVariable(key, _params[key]);
        });
    params = { ...params, ..._params };

    if (typeof res !== 'undefined') {
        res.resolve(params);
    }
};

// Combines default output with user-specified options and
// counts (1) total output formats requested and (2) outputs that require OCR
const processOutput = (output) => {
    const workingOutput = JSON.parse(JSON.stringify(defaultOutput));
    // Output formats were set using `setParameters` in previous versions
    // These settings are copied over for compatability
    if (params.tessjs_create_box === '1') workingOutput.box = true;
    if (params.tessjs_create_hocr === '1') workingOutput.hocr = true;
    if (params.tessjs_create_osd === '1') workingOutput.osd = true;
    if (params.tessjs_create_tsv === '1') workingOutput.tsv = true;
    if (params.tessjs_create_unlv === '1') workingOutput.unlv = true;

    const nonRecOutputs = ['imageColor', 'imageGrey', 'imageBinary', 'layoutBlocks', 'debug'];
    let recOutputCount = 0;
    for (const prop of Object.keys(output)) {
        workingOutput[prop] = output[prop];
    }
    for (const prop of Object.keys(workingOutput)) {
        if (workingOutput[prop]) {
            if (!nonRecOutputs.includes(prop)) {
                recOutputCount += 1;
            }
        }
    }
    const skipRecognition = recOutputCount === 0;
    return { workingOutput, skipRecognition };
};


