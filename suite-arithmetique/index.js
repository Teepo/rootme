import { parse } from 'node-html-parser';

import fetch from 'node-fetch';

const url = 'http://challenge01.root-me.org/programmation/ch1/';

(async () => {

    const response = await fetch(url, {
        credentials: 'include',
        headers : {
            Cookie : 'PHPSESSID=teepo',
        }
    });

    const body = await response.text();
    const root = parse(body);

    root.querySelector('link').remove();
    root.querySelector('iframe').remove();
    root.querySelectorAll('br').forEach(node => {
        node.remove();
    });

    let html = root.innerHTML;

    html = html.replaceAll('<html>', '');
    html = html.replaceAll('</html>', '');
    html = html.replaceAll('<body>', '');
    html = html.replaceAll('</body>', '');
    html = html.replaceAll('<sub>', '');
    html = html.replaceAll('</sub>', '');

    const bordel = html.split('You');

    const eq    = bordel[0].split('\n')[0].replaceAll('Un+1 = ', '');
    const nZero = bordel[0].split('\n')[1].replaceAll('U0 = ', '');
    const x     = bordel[1].replaceAll(' must find U', '');

    const eqA  = eq.match(/\[ (\S+) \+ U/)[1];
    const eqOp = eq.match(/\] ([\+\-]) \[ n \* (\S+) \]/)[1];
    const eqB  = eq.match(/\] ([\+\-]) \[ n \* (\S+) \]/)[2];

    const result = eval(`${eqA} * ${x} ${eqOp} ${eqB} * ${x} * (${x} - 1) / 2 + ${nZero}`);

    const r = await fetch('http://challenge01.root-me.org/programmation/ch1/ep1_v.php?result=' + result, {
        credentials: 'include',
        headers : {
            Cookie : 'PHPSESSID=teepo',
        }
    });

    const b = await r.text();

    console.log(b);
})();