/*
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreateTime: 2019/12/4
* */
import {match, print, use} from "./classkit";

rpc.exports = {
    classMatch: function (name: string) {
        let result: Array<string> = [];
        let wrappers = match(name);
        wrappers.forEach(function (wrapper) {
            result.push(wrapper)
        });
        return result
    },
    classUse: function (name: string) {
        let clazz = use(name);
        if (clazz) {
            return print(clazz);
        } else {
            return "Unable to use <" + name + ">."
        }
    }
};