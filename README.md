# Joy-Con WebHID

A [WebHID](https://web.dev/hid) driver for
[Nintendo Joy-Cons](https://en.wikipedia.org/wiki/Joy-Con) with support for all buttons, analog
sticks, and the device's gyroscope and accelerometer sensors.

## Demo

<img
width="800"
alt="Joy-Con WebHID demo showing two Joy-Cons slightly tilted with one of the analog sticks moved to the right on one Joy-Con and the 'A' button pressed on the other."
src="https://user-images.githubusercontent.com/145676/101152193-01fc4f80-3623-11eb-8afd-50485f2807c6.png"

>

See the [live demo](https://tomayac.github.io/joy-con-webhid/demo/) of the driver.

## Installation

```bash
npm install --save joy-con-webhid
```

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

## Acknowledgements

This project takes heavy inspiration from @wazho's [ns-joycon](https://github.com/wazho/ns-joycon),
which in turn is based on @dekuNukem's
[Nintendo_Switch_Reverse_Engineering](https://github.com/dekuNukem/Nintendo_Switch_Reverse_Engineering).

## License

Apache 2.0.
