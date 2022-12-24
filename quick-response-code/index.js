import fs from 'fs';

import fetch from 'node-fetch';

import terminalImage from 'terminal-image';

import { parse } from 'node-html-parser';

import { createCanvas, loadImage } from 'canvas';

import jsQR from "jsqr";
import Jimp from "jimp";

import QrCode from 'qrcode-reader';

import { MultiFormatReader, BarcodeFormat, DecodeHintType, RGBLuminanceSource, BinaryBitmap, HybridBinarizer } from '@zxing/library';

const canvas = createCanvas(900, 900);
const ctx = canvas.getContext('2d');

const URL = 'http://challenge01.root-me.org/programmation/ch7/';

(async () => {

    const response = await fetch(URL, {
        credentials: 'include',
        headers : {
            Cookie : 'PHPSESSID=teepo',
        }
    });

    const body = await response.text();
    const root = parse(body);

    const img = root.querySelector('img');

    const imgForCanvas = await loadImage(img.getAttribute('src'));

    ctx.drawImage(imgForCanvas, 0, 0, 900, 900);

    [[54, 54], [54, 666], [666, 54]].map(coord => {
        
        const [x, y] = coord;

        ctx.fillStyle = '#000';
        ctx.fillRect(x, y, 180, 180);

        ctx.fillStyle = '#fff';
        ctx.fillRect(x+24, y+24, 126, 126);

        ctx.fillStyle = '#000';
        ctx.fillRect(x+51, y+51, 72, 72);
    });

    const imgData = ctx.createImageData(900, 900);

    const dataURL = ctx.canvas.toBuffer('image/png');

    const out = fs.createWriteStream('./media.png')
    const stream = ctx.canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => {

        const a = fs.readFileSync('./media.png');

        Jimp.read(a, function(err, image) {
            const qrcode = new QrCode;
            qrcode.callback = function(err, value) {
                if (err) {
                    console.error(err);
                }
                console.log(value);
            };
            qrcode.decode({ width : 900, height : 900 }, image.bitmap);
        });

        const decoded = jsQR(imgData.data, 900, 900);

        console.log(decoded);

        // ----------

        const hints = new Map();
        const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX/*, ...*/];

        hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

        const reader = new MultiFormatReader();

        const luminanceSource = new RGBLuminanceSource(imgData.data, 900, 900);
        const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

        const r = reader.decode(binaryBitmap, hints);

        console.log(r);
    });

    // console.log(await terminalImage.buffer(dataURL));
})();