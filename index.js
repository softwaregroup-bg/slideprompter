#!/usr/bin/env node

/* eslint-disable no-console */
const puppeteer = require('puppeteer-core');
const path = require('path');
const config = require(path.join(process.cwd(), process.argv[2] || 'slides'));

function speak(what, voice) {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    let done, error;
    function next(current) {
        const item = what[current];

        const callnext = (delay = 1000) => function() {
            if (current + 1 >= what.length) {
                done(true);
            } else {
                setTimeout(() => next(current + 1), delay);
            }
        };

        switch (typeof item) {
            case 'string': {
                const utterThis = new SpeechSynthesisUtterance(what[current]);
                utterThis.onend = callnext();
                utterThis.onerror = error;
                utterThis.voice = window.speechSynthesis.getVoices().find(({name}) => name === (voice || 'Google UK English Female'));
                utterThis.pitch = 1;
                utterThis.rate = 1;
                synth.speak(utterThis);
                break;
            }
            case 'number':
                callnext(item)();
                break;
            default:
                done(true);
        }
    }
    return new Promise((resolve, reject) => {
        done = resolve;
        error = reject;
        next(0);
    });
}

const delay = time => new Promise((resolve, reject) => setTimeout(resolve, time));

(async() => {
    const browser = await puppeteer.launch({
        executablePath: config.chrome,
        headless: false,
        defaultViewport: null,
        ignoreDefaultArgs: [
            '--enable-automation',
            '--enable-blink-features=IdleDetection',
            '--disable-component-extensions-with-background-pages',
            '--disable-features=Translate'
        ],
        args: [
            '--start-fullscreen'
        ]
    });
    const page = (await browser.pages())[0];
    await page.goto(config.start);
    await page.keyboard.down('ControlLeft');
    await page.keyboard.press('F5');
    await page.keyboard.up('ControlLeft');
    const context = await page.mainFrame().executionContext();
    await context.evaluate(speak, ['3', 1000], config.voice);
    await context.evaluate(speak, ['2', 1000], config.voice);
    await context.evaluate(speak, ['1', 7000], config.voice);
    for (const item of config.script.split(/\n\n|\r\n\r\n/g).map(text => text.trim())) {
        if (item.toLowerCase() === 'next') {
            await delay(1000);
            await page.keyboard.press('Space');
        } else if (item.toLowerCase().startsWith('wait')) {
            await delay(parseInt(item.split(' ')[1]) * 1000);
        } else {
            console.log(item);
            await context.evaluate(speak, [item], config.voice);
        }
    }
})();
