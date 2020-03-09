# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreatedTime: 2020/3/8 23:33

__description__ = "a plugin to help you understand java world."

import os

from objection.utils.plugin import Plugin

from .wallbreaker.command import CommandAgent


class ObjectionAgent(CommandAgent):
    def __init__(self, objection_plugin):
        self.plugin = objection_plugin
        super().__init__()

    def attach(self):
        self._rpc = self.plugin.api


class WallBreaker(Plugin):

    def __init__(self, ns):
        """
            Creates a new instance of the plugin
            :param ns:
        """

        self.script_path = os.path.join(os.path.dirname(__file__), "agent/_agent.js")

        implementation = {
            'meta': 'help you understand java world.',
            'commands': {
                'classdump': {
                    'meta': 'quick view a class struct',
                    'flags': ['--fullname'],
                    'exec': self.classdump
                }
            }
        }

        super().__init__(__file__, ns, implementation)

        self.inject()

        self.plugin_agent = ObjectionAgent(self)

    def classdump(self, args=None):
        """
        """
        short_name = True
        target_name = ""
        for arg in args:
            if arg == "--fullname":
                short_name = False
            else:
                target_name = arg

        self.plugin_agent.class_dump(target_name, petty_print=True, short_name=short_name)


namespace = 'wallbreaker'
plugin = WallBreaker
