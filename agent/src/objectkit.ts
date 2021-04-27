/*
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreatedTime: 2020/6/12 22:09
* */

import Wrapper = Java.Wrapper;
import {getHandle, getOwnProperty, hasOwnProperty} from "./utils";

export let handleCache: any = {};

function getRealClassName(object: Wrapper) {
    const objClass = Java.use("java.lang.Object").getClass.apply(object);
    return Java.use("java.lang.Class").getName.apply(objClass)
}

function objectToStr(object: Wrapper) {
    return Java.use("java.lang.Object").toString.apply(object);
}

export const searchHandles = (clazz: string, stop: boolean = false) => {
    let result: any = {};
    Java.perform(function () {
            Java.choose(clazz, {
                onComplete: function () {
                },
                onMatch: function (instance) {
                    const handle = getHandle(instance);
                    if (handle != null) {
                        result[handle] = objectToStr(instance);
                    }

                    if (stop) {
                        return "stop"
                    }
                },
            });
        }
    );
    return result;
};

export const getRealClassNameByHandle = (handle: string) => {
    let result: string | null = null;
    Java.perform(function () {
        try {
            const obj = Java.use("java.lang.Object");
            const jObject = Java.cast(ptr(handle), obj);
            result = getRealClassName(jObject);
        } catch (e) {

        }
    });
    return result;
};

const getObjectByHandle = (handle: string) => {
    if (!hasOwnProperty(handleCache, handle)) {
        if (handle.startsWith("0x")) {
            const origClassName = getRealClassNameByHandle(handle);
            if (!origClassName) {
                return
            }
            handleCache[handle] = Java.cast(ptr(handle), Java.use(origClassName));
        } else {
            handleCache[handle] = Java.use(handle)
        }

    }
    return handleCache[handle];
}

export const getObjectFieldValue = (handle: string, field: string) => {
    let result: string = "null";
    Java.perform(function () {
        const origObject = getObjectByHandle(handle);
        let value = getOwnProperty(origObject, field);
        if (value == null) {
            value = getOwnProperty(origObject, "_" + field);
        }
        if (value == null || value.value == null) {
            value = "null"
        } else {
            value = value.value;
            if (value == null) {
                value = "null"
            } else {
                const handle = getHandle(value);
                if (handle != null) {
                    value = "[" + handle + "]: " + objectToStr(value).split("\n").join(" \\n ");
                }
            }
        }
        result = value.toString()
    });
    return result;
};

export const instanceOf = (handle: string, className: string) => {
    let result: boolean = false;
    Java.perform(function () {
        try {
            const targetClass = Java.use(className);
            const newObject = Java.cast(getObjectByHandle(handle), targetClass);
            result = !!newObject;
        } catch (e) {
            result = false;
        }
    })
    return result;
};


export const mapDump = (handle: string) => {
    let result: any = {};
    Java.perform(function () {
        try {
            const mapClass = Java.use("java.util.Map");
            const entryClass = Java.use("java.util.Map$Entry");
            const mapObject = getObjectByHandle(handle);
            const entrySet = mapClass.entrySet.apply(mapObject).iterator();
            while (entrySet.hasNext()) {
                const entry = Java.cast(entrySet.next(), entryClass);
                const key = entry.getKey();
                const keyHandle = getHandle(key);
                if (key == null || keyHandle == null) {
                    continue
                }

                const value = entry.getValue();
                const valueHandle = getHandle(value);
                if (value == null || valueHandle == null) {
                    continue
                }

                result["[" + keyHandle + "]: " + objectToStr(key)] = "[" + valueHandle + "]: " + objectToStr(value);
            }
        } catch (e) {
            console.error(e)
        }
    })
    return result;
}