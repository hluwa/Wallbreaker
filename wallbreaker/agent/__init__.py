import logging
import os

AgentLogger = logging.getLogger("Agent")


class Agent:
    def __init__(self, connection=None, script_file=None):
        if script_file is None:
            script_file = os.path.join(os.path.dirname(__file__), "../agent/_agent.js")
        self._connection = connection
        self._script_file = script_file
        self._script = None
        self._rpc = None
        self.attach()

    def on_message(self, message, data):
        pass

    def attached(self):
        return True if self._rpc else False

    def attach(self):
        self.detach()

        if not self._connection.connected():
            self._connection.connect()
        assert self._connection and self._connection.connected(), "Unable to attach agent."

        try:
            script = open(self._script_file, encoding='utf-8').read()
        except:
            raise Exception("Unable to read agent script.")

        self._script = self._connection.session.create_script(script)
        assert self._script, "Unable to create agent from script."

        self._script.on('message', lambda message, data: self.on_message(message, data))
        self._script.load()

        self._rpc = self._script.exports
        AgentLogger.info("{}: Attach.".format(self))

    def detach(self):
        if self._script:
            self._script.unload()
            self._script = None
            self._rpc = None
            AgentLogger.info("{}: Detach.".format(self))

    def __str__(self):
        return "{}<{}, attached={}>".format(self.__class__.__name__, self._connection, self.attached())

    __repr__ = __str__

    def __del__(self):
        self.detach()
