/*
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreateTime: 2019/12/4
* */
import {match, print, use} from "./classkit";

rpc.exports = {
    classMatch: function (name: string) {
        return match(name);
    },
    classUse: function (name: string) {
        let clazz = use(name);
        if (clazz) {
            return JSON.stringify(clazz);
        } else {
            return "Unable to use <" + name + ">."
        }
    }
};