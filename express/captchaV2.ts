import w from 'tesseract.js/src/worker-script/index'
import getCore from 'tesseract.js/src/worker-script/node/getCore';
import gunzip from 'tesseract.js/src/worker-script/node/gunzip';
import cache from 'tesseract.js/src/worker-script/node/cache';
import options from 'tesseract.js/src/constants/defaultOptions';
import { loadImage } from 'tesseract.js/src/worker/node'

export const SIMPLE_PNG_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0CAIAAABqhmJGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASuSURBVHhe7dftVdswAIbRzsVAzMM0XabDUCOUxLYsWW4Jp+/pvf9w9GH76CHw4x2IJWAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAI9p8G/PbyY8rL2686g8t+vnqHTyfgIYfvz/26veTXn/UKX8+f0EU9bHrtu/6KfAN/AwEXAj7lFf2TBFw4nae8on+SgIvJ01n/KLzpDK+L3bT/Ap4O+HC+V12mTH+M3gzcLbIY/EO6HfxYp13k09nb6r3UqcdnjoCL3ll72J26h+35Oxy2XvZ0wOLaXq9v2+F1UC+7RZtMZ/DnfX1lwDOPzwUCLo7O2trtDK8H3M/iqoc6bj1subT68XTA/F7bGJooyzKbhTvLPHY8eJLHlbNX1DqYUVfdXbqwJjsCLsans37aNNJM6w68OR0wv9f9ymKw3k67yn2ZZpHlg3a3zis60s6oV+ZvlzMCLoanc3Dsdt9TdWT/lM8OmNjr5KY72jmzq1zfrbvXtVtmRMDF8HTWcgaaqIrD1U4G/MFewxrW262s5jS/Fzpmdts6mnHy+Fwl4GJ0OjsNrG1P/y7CNo3+gEt7jW56MVprNed7A/5w+n6YJ+BieDpnj/jO6pweTz0acGWvmZveL9XOmd3x6wKuTt8PEwRczLRw4eje1XX7c/cDruw1uuneOu2c4aOvzI57mJhRh1xZlQ0BF+Oz9vcF96fuB1zYa7R2b5mD6/XSwdfg8snj4q21+W/L02dfzIxhQMDFyTm6Hd7m+JYP7rPKT5sRuzhOBywm91rUkYc3fV9ltchtr8VmzuGOdfDB9N1tFYefNfdXLmyGjNZkhoCLUQufVqd/7z7rUcLW/XieDvg0s9difNOdRV5ePibt5vTuazusWbF9rs2E5v4mH58LBFyMW7g5OID7s9cMuTygmt9rcNPb5MrAz0lHc3Z9Ht7XZsxqxO36ZtLR/c0+PpMEzLOc/4LhrwmYZ6lfywJ+JgHzJPr9DgLmi23/zdXvcwmYL7YKWL1PJ2AIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmAIJmCI9f7+G6yFxVg/GyYwAAAAAElFTkSuQmCC';
w.setAdapter({
    getCore,
    gunzip,
    fetch,
    ...cache,
})

export const init = async () => {
    await startJob({
        jobId: '1',
        action: 'load',
        payload: {
            langs: 'eng',
            options
        }
    });

    await startJob({
        jobId: '1',
        action: 'loadLanguage',
        payload: {
            langs: 'eng',
            options
        }
    })

    await startJob({
        jobId: '1',
        action: 'initialize',
        payload: {
            langs: "eng",
            oem: 3,
            config: {},
        }
    });

    await startJob({
        jobId: '1',
        action: 'setParameters',
        payload: {
            params: {
                //tessedit_char_whitelist: '0123456789'
            }
        }
    });
}

export const recognize = async (imageSrc: string | Buffer) => {
    await initApi;
    const img = await loadImage(imageSrc)
    return await startJob({
        jobId: '1',
        action: 'recognize',
        payload: {
            image: img, options: {},
            output: {
                blocks: false, text: true, hocr: false, tsv: false
            }
        }
    });
}

const startJob = (p: {
    jobId: string,
    action: string,
    payload: any
}) => {
    return new Promise((res, rej) => {
        w.dispatchHandlers(p, (o) => {
            if (o.status == 'reject') rej(o);
            if (o.status !== 'resolve') return;
            res(o);
        });
    });
}

const initApi = init();