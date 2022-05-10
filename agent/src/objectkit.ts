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
    try {
        return Java.use("java.lang.Object").toString.apply(object);
    } catch (e) {
        return "" + object;
    }
}

export const searchHandles = (clazz: string, stop: boolean = false) => {
    let result: any = {};
    const f = () => {
        Java.choose(clazz, {
            onComplete: () => {
            },
            onMatch: (instance) => {
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
    Java.perform(f);
    return result;
};

export const getRealClassNameByHandle = (handle: string) => {
    let result: string | null = null;
    Java.perform(function () {
        const obj = Java.use("java.lang.Object");
        const jObject = Java.cast(ptr(handle), obj);
        result = getRealClassName(jObject);
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

export const getObjectFieldValue = (handle: string, field: string, clazz: string) => {
    let result: string = "null";
    Java.perform(function () {
        let origObject = getObjectByHandle(handle);
        let value;
        if (clazz) {
            let rClass = Java.use(clazz);
            let rField = rClass.class.getDeclaredField(field);
            rField.setAccessible(true);
            value = rField.get(origObject);
        } else {
            value = getOwnProperty(origObject, "_" + field);
            if (value == null) {
                value = getOwnProperty(origObject, field);
            }
            value = (value && hasOwnProperty(value, "value")) ? value.value : null;
        }
        if (value == null){
            value = "null";
        } else {
            const fieldHandle = getHandle(value);
            if (fieldHandle != null) {
                value = "[" + fieldHandle + "]: " + objectToStr(value).split("\n").join(" \\n ");
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

export const collectionDump = (handle: string) => {
    let result: any = [];
    Java.perform(function () {
        try {
            const collectionClass = Java.use("java.util.Collection");
            const collectionObject = getObjectByHandle(handle);
            const objectArray = collectionClass.toArray.apply(collectionObject);
            objectArray.forEach(function (element: any) {
                const eleHandle = getHandle(element);
                result.push('[' + eleHandle + ']: ' + objectToStr(element));
            });
        } catch (e) {
            console.error(e)
        }
    })
    return result;
}