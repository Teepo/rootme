import base32 from 'hi-base32';

export function detect(string) {
    return /^([A-Z2-7=]{8})+$/.test(string);
};

export function decode(string) {
    return base32.decode(string);
};