import { JoyConRight } from "./joycon.js";

/**
 *
 *
 * @class HVCController
 * @extends {JoyConRight}
 */
class HVCController extends JoyConRight {
  /**
   *Creates an instance of HVCController.
   * @param {HIDDevice} device
   * @memberof HVCController
   */
  constructor(device) {
    super(device);
  }

  /**
   *
   *
   * @param {*} packet
   * @memberof HVCController
   */
  _receiveInputEvent(packet) {
    this.dispatchEvent(new CustomEvent('hidinput', { detail: packet }));
  }
}

export { HVCController };
