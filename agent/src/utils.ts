/*
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreatedTime: 2020/6/13 00:30
* */

import Wrapper = Java.Wrapper;

export function hasOwnProperty(obj: any, name: string) {
    try {
        return obj.hasOwnProperty(name) || name in obj;
    } catch (e) {
        return obj.hasOwnProperty(name)
    }
}

export function getOwnProperty(obj: any, name: string) {
    if (!hasOwnProperty(obj, name)) {
        return null;
    }
    let result = null;
    try {
        result = obj[name];
        if (result) {
            return result
        }
    } catch (e) {
    }

    try {
        result = obj.getOwnProperty(name);
        if (result) {
            return result;
        }
    } catch (e) {
    }
    return result
}

export function getHandle(object: Wrapper) {
    if (hasOwnProperty(object, '$handle')) {
        if (object.$handle != undefined) {
            return object.$handle;
        }
    }
    if (hasOwnProperty(object, '$h')) {
        if (object.$h != undefined) {
            return object.$h;
        }
    }
    return null;
    //return object.hashCode()
}

export const isStatic = (obj: any) => (obj.getModifiers() & 0x8) != 0