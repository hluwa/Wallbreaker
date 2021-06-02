# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreatedTime: 2019/12/7 23:21
import logging
import traceback

import frida

from wallbreaker.agent.command import Agent
from wallbreaker.connection import create_connection

logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(asctime)s <%(funcName)s> - %(message)s")

test_process = 'com.genymotion.superuser'
TestLogger = logging.getLogger("UnitTest")


def test_connection():
    connection = create_connection(p_name=test_process)
    assert connection.connected()
    connection.disconnect()
    assert not connection.connected()


def test_connection_multi_process():
    device = frida.get_usb_device()
    processes = [process.pid for process in device.enumerate_processes() if test_process in process.name]
    if len(processes) < 2:
        TestLogger.warning("Can't find multi process of target")
        return
    connection = create_connection(p_name=test_process, p_id=processes[1])
    assert connection.connected()


def test_agent():
    connection = create_connection(p_name=test_process)
    assert connection.connected()
    agent = Agent(connection)
    assert agent.attached()
    agent.detach()
    assert not agent.attached()


tests = [test_connection, test_agent, test_connection_multi_process]

if __name__ == '__main__':
    for test in tests:
        name = test.__name__
        try:
            test()
            print("[*] {} success.".format(name))
        except Exception as e:
            print("[*] {} failed: {}".format(name, e))
            traceback.print_exc()
