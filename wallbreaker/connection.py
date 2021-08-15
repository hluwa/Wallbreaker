# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreatedTime: 2019/12/7 20:54

import logging

import frida

ConnLogger = logging.getLogger("Connection")


class Connection:

    def __init__(self, device=None, process=None):
        self.device = device
        self.process = process
        self.session = None
        self.connect()

    def connected(self):
        return True if self.session else False

    def connect(self):
        self.disconnect()
        self.session = self.device.attach(self.process)
        ConnLogger.info("{}: connect, {}".format(self, "Success" if self.connected() else "Failed"))

    def disconnect(self):
        if self.session:
            self.session.detach()
            self.session = None
            ConnLogger.info("{}: disconnect.".format(self))

    def __str__(self):
        return "Connection(pid={}, connected:{})".format(self.process, self.connected())

    __repr__ = __str__

    def __del__(self):
        self.disconnect()


def create_connection(p_name=None, p_id=None, device=None, spawn=False):
    try:
        device = frida.get_usb_device() if device is None else device
    except:
        device = frida.get_remote_device() if device is None else device
    assert device, "Unable to connect android device"

    if p_name:
        if spawn:
            p_id = device.spawn(p_name)
        else:
            if p_id:
                processes = [process.pid for process in device.enumerate_processes()
                             if p_name in process.name and process.pid == p_id]
                if not processes: p_id = None

            if not p_id:
                p_id = device.get_process(p_name).pid
        assert p_id, "Unable to select process id from {}.".format(p_name)
    assert p_id, "Please give name or id of target process."

    return Connection(device, p_id)


class SessionConnection(Connection):

    def __init__(self, device, session):
        self.device = device
        self.session = session
        self.process = str(self.session)
