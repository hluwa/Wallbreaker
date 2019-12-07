# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreatedTime: 2019/12/7 21:08
import logging
import traceback

import frida

logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(asctime)s <%(funcName)s> - %(message)s")
TestLogger = logging.getLogger("UnitTest")


def test_devices():
    devices = frida.enumerate_devices()
    assert devices
    connected = False
    for device in devices:
        if device.type == 'usb':
            connected = True
            TestLogger.info("Detected device: %s" % device.name)
    if not connected:
        TestLogger.warning("Unable to detect device")


tests = [test_devices]
if __name__ == '__main__':
    for test in tests:
        name = test.__name__
        try:
            test()
            print("[*] %s success" % name)
        except Exception as e:
            print("[*] %s failed: %s" % name, e)
            traceback.print_exc()
