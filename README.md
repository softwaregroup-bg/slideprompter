# Slideprompter

Presents Google Slides and narrates them with synthesized voice.

## Usage

```sh
npx slideprompter
```

## Configuration

Slideprompter will look at the current directory for a file named
`slides.js` or `slides.json` with the following settings:

- **chrome**: path to the chrome browser executable
- **start**: URL of the start slide
- **script**: the text to speak.

Due to limitations of the speech synthesis API, long texts need to be broken down
and separated by empty lines.

Use the text `'Next'` to advance to the next slide or animation.

Here is an example:

```js
module.exports = {
    chrome: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    start: 'https://docs.google.com/presentation/...',
    script: `
    Welcome this is the first slide.

    Next

    This is the second slide

    Next

    This is animation in the second slide.

    If the text is very long, it must be broken by including empty lines.

    Next

    This is the last slide.
    Good bye!
    `
};
```

## Recording the presentation

To record the presentation use your favorite screen recorder, for example
use `WIN+ALT+R` under Windows.

>> NOTE
>> You may need to edit puppeteer-core/lib/cjs/puppeteer/node/BrowserRunner.js
>> ant set detached: true
