/*
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreatedTime: 2020/6/12 22:09
* */

import Wrapper = Java.Wrapper;
import {getHandle, getOwnProperty, hasOwnProperty} from "./utils";
import {ClassWrapper} from "./struct";
import {use} from "./classkit";

let handleCache: any = {};

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
                    result[handle] = objectToStr(instance);
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

export const getObjectFieldValue = (handle: string, field: string) => {
    let result: string = "null";
    Java.perform(function () {
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
        const origObject = handleCache[handle];

        let value = getOwnProperty(origObject, field);
        if (value == null) {
            value = getOwnProperty(origObject, "_" + field);
        }
        if (value != null) {
            value = value.value;

            if (value == null) {
                value = "null"
            }

            const handle = getHandle(value);
            if (handle != null) {
                handleCache[handle] = value;
                value = "[" + handle + "]: " + objectToStr(value).split("\n").join(" \\n ");
            }
        } else {
            value = "null"
        }
        result = value.toString()
    });

    return result
};