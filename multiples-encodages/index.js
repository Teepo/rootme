import net from 'net';

import { detect as detectMorse,  decode as decodeMorse  } from './algo/morse.js';
import { detect as detectBase64, decode as decodeBase64 } from './algo/base64.js';
import { detect as detectBase32, decode as decodeBase32 } from './algo/base32.js';
import { detect as detectHex,    decode as decodeHex    } from './algo/hex.js';
import { decode as decodeAscii85 } from './algo/ascii85.js';

const URL  = 'challenge01.root-me.org';
const PORT = 52017;

const client = new net.Socket;

client.connect(PORT, URL);

client.on('data', data => {

    data = data.toString();

    let key = data.match("Decode this please: '(.*)'");

    if (!key) {
        return;
    }

    key = key[1] ?? false;

    let decodeMethod;

    if (detectHex(key)) {
        decodeMethod = decodeHex;
    }
    else if (detectBase32(key)) {
        decodeMethod = decodeBase32;
    }
    else if (detectBase64(key)) {
        decodeMethod = decodeBase64;
    }
    else if (detectMorse(key)) {
        decodeMethod = decodeMorse;
    }
    else {
        decodeMethod = decodeAscii85;
    }

     client.write(decodeMethod(key).toLowerCase() + "\n");
});

client.on('close', () => {
	console.log('Connection closed');
});