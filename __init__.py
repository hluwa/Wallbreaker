# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreatedTime: 2020/3/8 23:33

__description__ = "a plugin to help you understand java world."

import os

from objection.utils.plugin import Plugin

from .wallbreaker.agent.command import CommandAgent


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
                },
                'classsearch': {
                    'meta': 'search class by pattern',
                    'flags': [],
                    'exec': self.classsearch
                },
                'objectdump': {
                    'meta': 'quick view an object internal',
                    'flags': ['--fullname', "--as-class"],
                    'exec': self.objectdump
                },
                'objectsearch': {
                    'meta': 'search instance in heap',
                    'flags': [],
                    'exec': self.objectsearch
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

        self.plugin_agent.class_dump(target_name, pretty_print=True, short_name=short_name)

    def classsearch(self, args=None):
        pattern = args[0]
        instances = self.plugin_agent.class_match(pattern)
        print("\n".join(instances))

    def objectdump(self, args=None):
        """
        """
        short_name = True
        as_class = None
        handle = ""
        idx = 0
        while idx < len(args):
            arg = args[idx]
            if arg == "--fullname":
                short_name = False
            elif arg == "--as-class":
                as_class = args[idx + 1]
                idx += 1
            else:
                handle = arg
            idx += 1

        self.plugin_agent.object_dump(handle, as_class=as_class, pretty_print=True, short_name=short_name)

    def objectsearch(self, args=None):
        clsname = args[0]
        instances = self.plugin_agent.object_search(clsname, stop=False)
        for handle in instances:
            print("[{}]: {}".format(handle, instances[handle]))


namespace = 'wallbreaker'
plugin = WallBreaker
