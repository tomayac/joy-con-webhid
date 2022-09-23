import {
  connectJoyCon,
  connectedJoyCons,
  JoyConLeft,
  JoyConRight,
  GeneralController,
} from '../src/index.js';

const connectButton = document.querySelector('#connect-joy-cons');
const connectButtonRingCon = document.querySelector('#connect-ring-con');
const debugLeft = document.querySelector('#debug-left');
const debugRight = document.querySelector('#debug-right');
const showDebug = document.querySelector('#show-debug');
const rootStyle = document.documentElement.style;

connectButton.addEventListener('click', connectJoyCon);

const visualize = (joyCon, packet) => {
  if (!packet || !packet.actualOrientation) {
    return;
  }
  const {
    actualAccelerometer: accelerometer,
    buttonStatus: buttons,
    actualGyroscope: gyroscope,
    actualOrientation: orientation,
    actualOrientationQuaternion: orientationQuaternion,
    ringCon: ringCon,
  } = packet;

  if (joyCon instanceof JoyConLeft) {
    rootStyle.setProperty('--left-alpha', `${orientation.alpha}deg`);
    rootStyle.setProperty('--left-beta', `${orientation.beta}deg`);
    rootStyle.setProperty('--left-gamma', `${orientation.gamma}deg`);
  } else if (joyCon instanceof JoyConRight) {
    rootStyle.setProperty('--right-alpha', `${orientation.alpha}deg`);
    rootStyle.setProperty('--right-beta', `${orientation.beta}deg`);
    rootStyle.setProperty('--right-gamma', `${orientation.gamma}deg`);
  }

  if (joyCon instanceof GeneralController) {
    // From left.
    document.querySelector('#up').classList.toggle('highlight', buttons.up);
    document.querySelector('#down').classList.toggle('highlight', buttons.down);
    document.querySelector('#left').classList.toggle('highlight', buttons.left);
    document
      .querySelector('#right')
      .classList.toggle('highlight', buttons.right);
    document
      .querySelector('#capture')
      .classList.toggle('highlight', buttons.capture);
    document
      .querySelector('#l')
      .classList.toggle('highlight', buttons.l || buttons.zl);
    document
      .querySelector('#l')
      .classList.toggle('highlight', buttons.l || buttons.zl);
    document
      .querySelector('#minus')
      .classList.toggle('highlight', buttons.minus);
    document
      .querySelector('#joystick-left')
      .classList.toggle('highlight', buttons.leftStick);
    // From right.
    document.querySelector('#a').classList.toggle('highlight', buttons.a);
    document.querySelector('#b').classList.toggle('highlight', buttons.b);
    document.querySelector('#x').classList.toggle('highlight', buttons.x);
    document.querySelector('#y').classList.toggle('highlight', buttons.y);
    document.querySelector('#home').classList.toggle('highlight', buttons.home);
    document
      .querySelector('#r')
      .classList.toggle('highlight', buttons.r || buttons.zr);
    document
      .querySelector('#r')
      .classList.toggle('highlight', buttons.r || buttons.zr);
    document.querySelector('#plus').classList.toggle('highlight', buttons.plus);
    document
      .querySelector('#joystick-right')
      .classList.toggle('highlight', buttons.rightStick);

    // for N64Controller
    const joystick = packet.analogStickLeft;
    const joystickMultiplier = 10;
    document.querySelector('#joystick-left').style.transform = `translateX(${
      joystick.horizontal * joystickMultiplier
    }px) translateY(${joystick.vertical * joystickMultiplier}px)`;
  } else if (joyCon instanceof JoyConLeft) {
    const joystick = packet.analogStickLeft;
    const joystickMultiplier = 10;
    document.querySelector('#joystick-left').style.transform = `translateX(${
      joystick.horizontal * joystickMultiplier
    }px) translateY(${joystick.vertical * joystickMultiplier}px)`;

    document.querySelector('#up').classList.toggle('highlight', buttons.up);
    document.querySelector('#down').classList.toggle('highlight', buttons.down);
    document.querySelector('#left').classList.toggle('highlight', buttons.left);
    document
      .querySelector('#right')
      .classList.toggle('highlight', buttons.right);
    document
      .querySelector('#capture')
      .classList.toggle('highlight', buttons.capture);
    document
      .querySelector('#l')
      .classList.toggle('highlight', buttons.l || buttons.zl);
    document
      .querySelector('#l')
      .classList.toggle('highlight', buttons.l || buttons.zl);
    document
      .querySelector('#minus')
      .classList.toggle('highlight', buttons.minus);
    document
      .querySelector('#joystick-left')
      .classList.toggle('highlight', buttons.leftStick);
  } else if (joyCon instanceof JoyConRight) {
    const joystick = packet.analogStickRight;
    const joystickMultiplier = 10;
    document.querySelector('#joystick-right').style.transform = `translateX(${
      joystick.horizontal * joystickMultiplier
    }px) translateY(${joystick.vertical * joystickMultiplier}px)`;

    document.querySelector('#a').classList.toggle('highlight', buttons.a);
    document.querySelector('#b').classList.toggle('highlight', buttons.b);
    document.querySelector('#x').classList.toggle('highlight', buttons.x);
    document.querySelector('#y').classList.toggle('highlight', buttons.y);
    document.querySelector('#home').classList.toggle('highlight', buttons.home);
    document
      .querySelector('#r')
      .classList.toggle('highlight', buttons.r || buttons.zr);
    document
      .querySelector('#r')
      .classList.toggle('highlight', buttons.r || buttons.zr);
    document.querySelector('#plus').classList.toggle('highlight', buttons.plus);
    document
      .querySelector('#joystick-right')
      .classList.toggle('highlight', buttons.rightStick);

    document.querySelector('#rc-st').value = ringCon.strain;
  }

  // test led and rumble
  if (buttons.a || buttons.up) {
    joyCon.blinkLED(0);
  }
  if (buttons.b || buttons.down) {
    joyCon.setLED(0);
  }
  if (buttons.x || buttons.right) {
    joyCon.resetLED(0);
    joyCon.rumble(600, 600, 0);
  }
  if (buttons.y || buttons.left) {
    joyCon.rumble(600, 600, 0.5);
  }

  if (showDebug.checked) {
    const controller = joyCon instanceof JoyConLeft ? debugLeft : debugRight;
    controller.querySelector('pre').textContent =
      JSON.stringify(orientation, null, 2) +
      '\n' +
      JSON.stringify(orientationQuaternion, null, 2) +
      '\n' +
      JSON.stringify(gyroscope, null, 2) +
      '\n' +
      JSON.stringify(accelerometer, null, 2) +
      '\n';
    const meterMultiplier = 300;
    controller.querySelector('#acc-x').value =
      accelerometer.x * meterMultiplier;
    controller.querySelector('#acc-y').value =
      accelerometer.y * meterMultiplier;
    controller.querySelector('#acc-z').value =
      accelerometer.z * meterMultiplier;

    const gyroscopeMultiplier = 300;
    controller.querySelector('#gyr-x').value =
      gyroscope.rps.x * gyroscopeMultiplier;
    controller.querySelector('#gyr-y').value =
      gyroscope.rps.y * gyroscopeMultiplier;
    controller.querySelector('#gyr-z').value =
      gyroscope.rps.z * gyroscopeMultiplier;
  }
};

// Joy-Cons may sleep until touched, so attach the listener dynamically.
setInterval(async () => {
  for (const joyCon of connectedJoyCons.values()) {
    if (joyCon.eventListenerAttached) {
      continue;
    }
    await joyCon.enableVibration();
    joyCon.addEventListener('hidinput', (event) => {
      visualize(joyCon, event.detail);
    });
    joyCon.eventListenerAttached = true;

    connectButtonRingCon.onclick = async () => await joyCon.enableRingCon();
  }
}, 2000);

showDebug.addEventListener('input', (e) => {
  document.querySelector('#debug').style.display = e.target.checked
    ? 'flex'
    : 'none';
});
