import atob from 'atob';

import isBase64 from 'is-base64';

export function detect(string) {
    return isBase64(string);
};

export function decode(string) {
    return atob(string);
};