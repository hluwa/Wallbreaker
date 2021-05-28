/*
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreateTime: 2019/12/4
* */
import {match, use} from "./classkit";
import {
    collectionDump,
    getObjectFieldValue,
    getRealClassNameByHandle,
    instanceOf,
    mapDump,
    searchHandles
} from "./objectkit";

rpc.exports = {
    classMatch: function (name: string) {
        return match(name);
    },
    classUse: function (name: string) {
        const clazz = use(name);
        return JSON.stringify(clazz);
    },
    objectSearch: function (clazz: string, stop: boolean) {
        return searchHandles(clazz, stop);
    },
    objectGetClass: function (handle: string) {
        return getRealClassNameByHandle(handle);
    },
    objectGetField: function (handle: string, field: string, clazz: string) {
        return getObjectFieldValue(handle, field, clazz);
    },
    instanceOf: function (handle: string, className: string) {
        return instanceOf(handle, className);
    },
    mapDump: function (handle: string) {
        return mapDump(handle);
    },
    collectionDump: function (handle: string) {
        return collectionDump(handle);
    }
};