# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreatedTime: 2020/3/8 23:33

__description__ = "a plugin to help you understand the class."

import os

from objection.utils.plugin import Plugin


class WallBreaker(Plugin):

    def __init__(self, ns):
        """
            Creates a new instance of the plugin
            :param ns:
        """

        self.script_path = os.path.join(os.path.dirname(__file__), "agent/_agent.js")

        implementation = {
            'meta': 'help you understand the class.',
            'commands': {
                'dump': {
                    'meta': 'quick view an class struct',
                    'exec': self.classdump
                }
            }
        }

        super().__init__(__file__, ns, implementation)

        self.inject()

    def classdump(self, args=None):
        """
        """
        pass
        # main.dump(state_connection.gadget_name, self.api)


namespace = 'wallbreaker'
plugin = WallBreaker