/*
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreatedTime: 2020/6/12 22:09
* */

import Wrapper = Java.Wrapper;
import {getOwnProperty, hasOwnProperty} from "./utils";

var handleCache: any = {};

function getRealClassName(object: Wrapper) {
    let objClass = Java.use("java.lang.Object").getClass.apply(object);
    return Java.use("java.lang.Class").getName.apply(objClass)
}

function getHandle(object: Wrapper) {
    if (hasOwnProperty(object, "$handle")) {
        return object.$handle;
    }
    if (hasOwnProperty(object, "$h")) {
        return object.$h
    }
    return null
}

function objectToStr(object: Wrapper) {
    return Java.use("java.lang.Object").toString.apply(object);
}

export const searchHandles = (clazz: string, stop: boolean = false) => {
    var result: any = {};
    Java.perform(function () {
            Java.choose(clazz, {
                onComplete: function () {
                },
                onMatch: function (instance) {
                    var handle = getHandle(instance);
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
    var result: string | null = null;
    Java.perform(function () {
        try {

            let obj = Java.use("java.lang.Object");
            let jObject = Java.cast(ptr(handle), obj);
            result = getRealClassName(jObject);
        } catch (e) {

        }
    });
    return result;
};

export const getObjectFieldValue = (handle: string, field: string) => {
    var result: string = "null";
    Java.perform(function () {
        if (!hasOwnProperty(handleCache, handle)) {
            let origClassName = getRealClassNameByHandle(handle);
            if (!origClassName) {
                return
            }
            handleCache[handle] = Java.cast(ptr(handle), Java.use(origClassName));
        }
        let origObject = handleCache[handle];

        var value = getOwnProperty(origObject, field);
        if (value == null) {
            value = getOwnProperty(origObject, "_" + field);
        }

        if (value != null) {
            value = value.value;

            if (value == null) {
                value = "null"
            }

            let handle = getHandle(value);
            if (handle != null) {
                value = "[" + handle + "]: " + objectToStr(value).split("\n").join(" \\n ");
            }
        } else {
            value = "null"
        }
        result = value.toString()
    });

    return result
};