/*
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreateTime: 2019/12/4
* */

import {ClassWrapper} from "./struct";

export const match = (name: string) => {
    let result: Array<string> = [];
    try {
        Java.perform(function () {
            Java.enumerateLoadedClassesSync().forEach(function (p1: string) {
                if (p1.startsWith("[")) {
                    return
                }
                if (p1.match(name)) {
                    result.push(p1)
                }
            })
        });
    } catch (e) {
    }
    return result;
};

export const use = (name: string) => {
    let result = ClassWrapper.NONE;
    Java.perform(function () {
        result = ClassWrapper.byWrapper(Java.use(name));
    });
    return result;
};
