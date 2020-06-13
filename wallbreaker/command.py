# Author: hluwa <hluwa888@gmail.com>
# HomePage: https://github.com/hluwa
# CreatedTime: 2019/12/7 22:59
import json
import logging
import os

import click

from .utils import DvmDescConverter

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


class CommandAgent(Agent):

    def on_message(self, message, data):
        if message['type'] == 'send':
            print("[*] {0}".format(message))
        else:
            print(message)

    def class_match(self, pattern):
        return self._rpc.class_match(pattern)

    def class_use(self, name):
        return json.loads(self._rpc.class_use(name))

    def class_dump(self, name, handle=None, pretty_print=False, short_name=True):
        target = self.class_use(name)
        result = ""
        if pretty_print:
            click.secho("")
        class_name = str(target['name'])
        if '.' in class_name:
            pkg = class_name[:class_name.rindex('.')]
            class_name = class_name[class_name.rindex('.') + 1:]
            result += "package {};\n\n".format(pkg)
            if pretty_print:
                click.secho("package ", fg="blue", nl=False)
                click.secho(pkg + "\n\n", nl=False)

        result += "class {}".format(class_name) + " {\n\n"
        if pretty_print:
            click.secho("class ", fg="blue", nl=False)
            click.secho(class_name, nl=False)
            click.secho(" {\n\n", fg='red', nl=False)

        def handle_fields(fields, can_preview=None):
            _handle = handle
            if can_preview is None:
                can_preview = _handle is not None
            elif can_preview and _handle is None:
                _handle = target['name']
            append = ""
            for field in fields:
                try:
                    if short_name:
                        t = DvmDescConverter(field['type']).short_name()
                    else:
                        t = DvmDescConverter(field['type']).to_java()
                    append += '\t'
                    if pretty_print:
                        click.secho("\t", nl=False)
                    append += "static " if field['isStatic'] else ""
                    if pretty_print:
                        click.secho("static " if field['isStatic'] else "", fg='blue', nl=False)
                    append += t + " "
                    if pretty_print:
                        click.secho(t + " ", fg='blue', nl=False)

                    value = None
                    if can_preview:
                        value = self.object_get_field(_handle, field['name'])
                    append += '{};{}\n'.format(field["name"], " => {}".format(value) if value is not None else "")
                    if pretty_print:
                        click.secho(field['name'], fg='red', nl=False)
                        click.secho(";", nl=False)
                        if value is not None:
                            click.secho(" => ", nl=False)
                            click.secho(value, fg='bright_cyan', nl=False)
                        click.secho("")
                except:
                    append += "<unknown error>\n"
                    if pretty_print:
                        click.secho("<unknown error>", fg="red", nl=False)
                        click.secho()

            append += '\n'
            if pretty_print: click.secho("\n", nl=False)
            return append

        static_fields = target['staticFields']
        instance_fields = target['instanceFields']

        result += "\t/* static fields */\n"
        if pretty_print:
            click.secho("\t/* static fields */", fg="bright_black")
        result += handle_fields(static_fields.values(), can_preview=True)

        result += "\t/* instance fields */\n"
        if pretty_print:
            click.secho("\t/* instance fields */", fg="bright_black")
        result += handle_fields(instance_fields.values())

        def handle_methods(methods):
            append = ""
            for method in methods:
                try:
                    if short_name:
                        args_s = [DvmDescConverter(arg).short_name() for arg in method['arguments']]
                    else:
                        args_s = [DvmDescConverter(arg).to_java() for arg in method['arguments']]
                    args = ", ".join(args_s)
                    append += '\t'
                    if pretty_print:
                        click.secho("\t", nl=False)
                    append += "static " if method['isStatic'] else ""
                    if pretty_print:
                        click.secho("static " if method['isStatic'] else "", fg='blue', nl=False)
                    retType = method['retType']
                    if short_name: retType = DvmDescConverter(retType).short_name()
                    retType = retType + " " if not method['isConstructor'] else ""
                    append += retType
                    if pretty_print:
                        click.secho(retType, fg='blue', nl=False)
                    append += method['name'] + '('
                    if pretty_print:
                        click.secho(method['name'], fg='red', nl=False)
                        click.secho("(", nl=False)
                    append += args + ");\n"
                    if pretty_print:
                        for index in range(len(args_s)):
                            click.secho(args_s[index], fg='green', nl=False)
                            if index is not len(args_s) - 1:
                                click.secho(", ", nl=False)
                        click.secho(");\n", nl=False)
                except:
                    append += "<unknown error>({})\n".format(method)
                    if pretty_print:
                        click.secho("<unknown error>({})".format(method), fg="bright_red", nl=False)
                        click.secho("")
            return append

        constructors = target['constructors']
        instance_methods = target['instanceMethods']
        static_methods = target['staticMethods']

        result += "\t/* constructor methods */\n"
        if pretty_print:
            click.secho("\t/* constructor methods */", fg="bright_black")
        result += handle_methods(constructors)
        result += "\n"
        if pretty_print: click.secho("")

        result += "\t/* static methods */\n"
        if pretty_print:
            click.secho("\t/* static methods */", fg="bright_black")
        for name in static_methods:
            result += handle_methods(static_methods[name])
        result += "\n"
        if pretty_print: click.secho("")

        result += "\t/* instance methods */\n"
        if pretty_print:
            click.secho("\t/* instance methods */", fg="bright_black")
        for name in instance_methods:
            result += handle_methods(instance_methods[name])
        result += "\n}\n"
        if pretty_print: click.secho("\n}\n", fg='red', nl=False)
        return result

    def object_search(self, clazz, stop=False):
        return self._rpc.object_search(clazz, stop)

    def object_dump(self, handle, **kwargs):
        handle = str(handle)
        return self.class_dump(self.object_get_classname(handle), handle=handle, **kwargs)

    def object_get_classname(self, handle):
        return self._rpc.object_get_class(handle)

    def object_get_field(self, handle, field):
        return self._rpc.object_get_field(handle, field)
