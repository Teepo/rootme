const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~';

export function decode(string) {
    return new Buffer.from(fromBase85(string)).toString('ascii');
};

function fromBase85(input) {

    let decoded = [];
  
    let i = 0;
    
    let block, blockBytes;
    
    while (i < input.length) {

        const digits = input
            .substr(i, 5)
            .split('')
            .map(chr => {
                return ALPHABET.indexOf(chr);
            });

        block =
            digits[0] * 52200625 +
            digits[1] * 614125 +
            (i + 2 < input.length ? digits[2] : 84) * 7225 +
            (i + 3 < input.length ? digits[3] : 84) * 85 +
            (i + 4 < input.length ? digits[4] : 84);

        blockBytes = [
            (block >> 24) & 0xff,
            (block >> 16) & 0xff,
            (block >> 8) & 0xff,
            block & 0xff,
        ];

        if (input.length < i + 5) {
            blockBytes.splice(input.length - (i + 5), 5);
        }

        decoded.push.apply(decoded, blockBytes);
        i += 5;
    }

    return decoded;
}