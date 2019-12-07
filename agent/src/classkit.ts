/*
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreateTime: 2019/12/4
* */

import Wrapper = Java.Wrapper;
import {ClassWrapper} from "./struct";
import Method = Java.Method;

export const match = (name: string) => {
    let result: Array<string> = [];
    try {
        Java.perform(function () {
            Java.enumerateLoadedClasses({
                onComplete: function () {
                },
                onMatch: function (p1: string) {
                    if (p1.startsWith("[")) {
                        return
                    }
                    if (p1.match(name)) {
                        result.push(p1)
                    }
                }
            })
        });
    } catch (e) {
    }
    return result;
};

export const use = (name: string) => {
    let result = null;
    Java.perform(function () {
        result = ClassWrapper.byWrapper(Java.use(name));
    });
    return result;
};

export const print = (clazz: ClassWrapper) => {
    let buff = "";
    buff += "className: " + clazz.name + "\n";
    buff += "superClass: " + clazz.super + "\n";
    buff += "implements: " + "\n";
    clazz.implements.forEach(function (interfaceClass) {
        buff += "\t" + interfaceClass + "\n";
    });
    buff += "\nmethods:\n";
    Object.getOwnPropertyNames(clazz.staticMethods).forEach(function (name) {
        buff += "\t" + name + ":\n";
        clazz.staticMethods[name].forEach(function (overload: Method) {
            const argTypes = overload.argumentTypes;
            buff += '\t\t<static> ';
            if (argTypes.length > 0) {
                buff += '.overload(\'' + overload.argumentTypes.map(t => t.className).join('\', \'') + '\')\n';
            } else {
                buff += '.overload()\n';
            }
        });
        buff += "\n"
    });
    Object.getOwnPropertyNames(clazz.instanceMethods).forEach(function (name) {
        buff += "\t" + name + ":\n";
        clazz.instanceMethods[name].forEach(function (overload: Method) {
            const argTypes = overload.argumentTypes;
            buff += '\t\t';
            if (argTypes.length > 0) {
                buff += '.overload(\'' + overload.argumentTypes.map(t => t.className).join('\', \'') + '\')\n';
            } else {
                buff += '.overload()\n';
            }
        });
        buff += "\n"
    });
    buff += "\nfields:\n";
    Object.getOwnPropertyNames(clazz.staticFields).forEach(function (name) {
        let field = clazz.staticFields[name];
        let typeName = field.fieldReturnType.className;
        buff += "\t static " + name + ": " + typeName + '\n';
    });
    Object.getOwnPropertyNames(clazz.instanceFields).forEach(function (name) {
        let field = clazz.instanceFields[name];
        let typeName = field.fieldReturnType.className;
        buff += "\t static " + name + ": " + typeName + '\n';
    });
    return buff
};