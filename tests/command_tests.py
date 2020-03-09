# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreatedTime: 2019/12/8 00:26
import logging
import traceback
from wallbreaker.command import CommandAgent
from wallbreaker.connection import create_connection

logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(asctime)s <%(funcName)s> - %(message)s")

test_process = 'org.lineageos.trebuchet'
TestLogger = logging.getLogger("UnitTest")


def test_class_match():
    connection = create_connection(p_name=test_process)
    assert connection.connected()
    agent = CommandAgent(connection)
    assert agent.attached()
    classes = agent.class_match("android.content.*")
    assert len(classes) > 1


def test_class_use():
    connection = create_connection(p_name=test_process)
    assert connection.connected()
    agent = CommandAgent(connection)
    assert agent.attached()
    class_desc = agent.class_use("android.content.ContentProvider")
    assert "Unable to use" not in class_desc


tests = [test_class_match, test_class_use]

if __name__ == '__main__':
    for test in tests:
        name = test.__name__
        try:
            test()
            print("[*] {} success.".format(name))
        except Exception as e:
            print("[*] {} failed: {}".format(name, e))
            traceback.print_exc()
