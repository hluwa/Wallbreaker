/*
* Author: hluwa <hluwa888@gmail.com>
* HomePage: https://github.com/hluwa
* CreatedTime: 2019/12/4 01:35
* */

import Wrapper = Java.Wrapper;
import {isStatic} from "./utils";

export class ClassWrapper {
    private static cache: any = {};
    public static NONE: ClassWrapper = new ClassWrapper(null);
    public name: string;
    public super: string;
    public constructors: Array<any> = [];
    public staticMethods: any = {};
    public instanceMethods: any = {};
    public staticFields: any = {};
    public instanceFields: any = {};
    public implements: Array<string> = [];


    private constructor(handle: Wrapper | null) {
        // console.log('come into consturtor')
        if (!handle) {
            this.name = "NONE";
            this.super = "NONE";
            return
        }
        this.name = handle.$className;
        this.super = handle.class.getSuperclass().getName();

        // extract methods and fields
        const __this = this;


        const methods = handle.class.getDeclaredMethods()
        methods.forEach(function (method: any) {

            const wrapper = new MethodWrapper(__this, method, false)

            if (wrapper.isStatic) {
                if (!(__this.staticMethods.hasOwnProperty(wrapper.name))) {
                    __this.staticMethods[wrapper.name] = [];
                }
                __this.staticMethods[wrapper.name].push(wrapper);
            } else {
                if (!(__this.instanceMethods.hasOwnProperty(wrapper.name))) {
                    __this.instanceMethods[wrapper.name] = [];
                }
                __this.instanceMethods[wrapper.name].push(wrapper);

            }


        })


        const jConstructors = handle.class.getDeclaredConstructors()
        jConstructors.forEach(function (jConstructor: any) {
            const wrapper = new MethodWrapper(__this, jConstructor, true)
            __this.constructors.push(wrapper);
        });


        const fields = handle.class.getDeclaredFields()
        fields.forEach(function (field: any) {

            const wrapper = new FieldWrapper(field)
            if (wrapper.isStatic) {
                if (!(__this.staticFields.hasOwnProperty(wrapper.name))) {
                    __this.staticFields[wrapper.name] = [];
                }
                __this.staticFields[wrapper.name].push(wrapper);
            } else {
                if (!(__this.instanceFields.hasOwnProperty(wrapper.name))) {
                    __this.instanceFields[wrapper.name] = [];
                }
                __this.instanceFields[wrapper.name].push(wrapper);

            }
        });

        // get implemented interfaces
        const _this = this;
        handle.class.getInterfaces().forEach(function (interfaceClass: Wrapper) {
            _this.implements.push(interfaceClass.getName());
        });
    }

    public static byWrapper(handle: Wrapper) {
        const name = handle.class.getName();
        if (!(name in ClassWrapper.cache)) {
            ClassWrapper.cache[name] = new ClassWrapper(handle);
        }
        return ClassWrapper.cache[name];
    }
}


export class MethodWrapper {
    public name: string;
    public arguments: Array<any> = [];
    public retType: any;
    public isStatic: boolean;
    public isConstructor: boolean;
    public ownClass: string;

    constructor(own: ClassWrapper, handle: any, isConstructor: boolean) {
        const _this = this;
        this.ownClass = own.name;

        this.name = handle.getName();

        handle.getParameterTypes().forEach(function (t: any) {
            _this.arguments.push(t.getName());
        });

        this.isConstructor = isConstructor;
        if (!this.isConstructor) {
            this.retType = handle.getReturnType().getName()
        } else {
            this.retType = ''
        }


        this.isStatic = isStatic(handle)


    }
}


export class FieldWrapper {
    public name: string;
    public isStatic: boolean;
    public type: string;


    constructor(handle: any) {
        this.isStatic = isStatic(handle)
        this.name = handle.getName();
        this.type = handle.getType().getName();
    }
}