export function detect(string) {
    return /[0-9A-Fa-f]{6}/g.test(string);
};

export function decode(s) {
    const r = [];
    for (let i = 0; i < s.length; i += 2) {
        r.push(String.fromCharCode(parseInt(s.substr(i, 2), 16)))
    }
    return r.join('');
};