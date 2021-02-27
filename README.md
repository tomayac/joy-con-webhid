# Joy-Con WebHID

A [WebHID](https://web.dev/hid) driver for
[Nintendo Joy-Cons](https://en.wikipedia.org/wiki/Joy-Con) with support for all buttons, analog
sticks, and the device's gyroscope and accelerometer sensors.

## Demo

See the [live demo](https://tomayac.github.io/joy-con-webhid/demo/) of the driver.

<img width="800" alt="Joy-Con WebHID demo showing two Joy-Cons slightly tilted with one of the analog sticks moved to the right on one Joy-Con and the 'A' button pressed on the other." src="https://user-images.githubusercontent.com/145676/101152193-01fc4f80-3623-11eb-8afd-50485f2807c6.png">

Another demo is [Chrome Dino WebHID](https://github.com/tomayac/chrome-dino-webhid), where you
can play the Chrome dino game 🦖 over WebHID by jumping with a Joy-Con controller in your pocket.

[![Joy-Con WebHID Chrome dino demo](https://img.youtube.com/vi/HuhQXXgDnCQ/0.jpg)](https://www.youtube.com/watch?v=HuhQXXgDnCQ)

## Installation

```bash
npm install --save joy-con-webhid
```

## Requirements

In order to test this _locally_, you need to flip the
`chrome://flags/#enable-experimental-web-platform-features` flag in Chrome.

For using it on your _production site_, register for the
[WebHID origin trial](https://developers.chrome.com/origintrials/#/register_trial/1074108511127863297),
then add the obtained token to your site as in
[this commit](https://github.com/tomayac/joy-con-webhid/commit/a19e541b365305eb440998b3a329989ddb361952).
To learn more about origin trials, you can read
[this article](https://web.dev/origin-trials/).

## Usage

Make sure you have a pairing button on your page.

```html
<button class="connect" type="button">Connect Joy-Con</button>
```

Import the script and hook up the pairing button.
Then create an interval that waits for Joy-Cons to appear,
which can happen after pairing, on page load when previously paired Joy-Cons are reconnected,
and when Joy-Cons wake up again after being idle.

```js
import * as JoyCon from './node_modules/dist/index.js';

// For the initial pairing of the Joy-Cons. They need to be paired one by one.
// Once paired, Joy-Cons will be reconnected to on future page loads.
document.querySelector('.connect').addEventListener('click', async () => {
  // `JoyCon.connectJoyCon()` handles the initial HID pairing.
  // It keeps track of connected Joy-Cons in the `JoyCon.connectedJoyCons` Map.
  await JoyCon.connectJoyCon();
});

// Joy-Cons may sleep until touched and fall asleep again if idle, so attach
// the listener dynamically, but only once.
setInterval(async () => {
  for (const joyCon of JoyCon.connectedJoyCons.values()) {
    if (joyCon.eventListenerAttached) {
      continue;
    }
    // Open the device and enable standard full mode and inertial measurement
    // unit mode, so the Joy-Con activates the gyroscope and accelerometers.
    await joyCon.open();
    await joyCon.enableStandardFullMode();
    await joyCon.enableIMUMode();
    // Get information about the connected Joy-Con.
    console.log(await joyCon.getDeviceInfo());
    // Listen for HID input reports.
    joyCon.addEventListener('hidinput', ({ detail }) => {
      // Careful, this fires at ~60fps.
      console.log(`Input report from ${joyCon.device.productName}:`, detail);
    });
    joyCon.eventListenerAttached = true;
  }
}, 2000);
```

## Why not use the Gamepad API?

The [Gamepad API](https://w3c.github.io/gamepad/)
supports Joy-Con controllers out-of-the-box,
but since the API (currently) does not have a concept of orientation,
the Joy-Cons' accelerometer and gyroscope data cannot be accessed.
The buttons and analog sticks are fully exposed, though.
If all you need is this, then by all means
[go for the Gamepad API](https://web.dev/gamepad/).

## Acknowledgements

This project takes heavy inspiration from [@wazho](https://github.com/wazho)'s
[ns-joycon](https://github.com/wazho/ns-joycon),
which in turn is based on [@dekuNukem](https://github.com/dekuNukem)'s
[Nintendo_Switch_Reverse_Engineering](https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering).

## License

Apache 2.0.
