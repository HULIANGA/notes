Function.prototype.myApply = function (thisArg, arg) {
    thisArg.fn = this
    var result = thisArg.fn(...arg)
    delete thisArg.fn
    return result
}
Function.prototype.myCall = function (thisArg, ...arg) {
    thisArg.fn = this
    var result = thisArg.fn(...arg)
    delete thisArg.fn
    return result
}

Function.prototype.myBind = function (thisArg, ...arg) {
    if (typeof this !== "function") {
        throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var that = this

    var nullFunc = function () {};
    var newFunc = function () {
        return that.myCall(this instanceof newFunc ? this : thisArg, ...arg.concat([...arguments]))
    }
    nullFunc.prototype = this.prototype;
    newFunc.prototype = new nullFunc();
    return newFunc
}

function func1(x, y) {
    this.x = x;
    this.y = y;
}
const obj = {}
var func2 = func1.myBind(obj, 1)
func2(2)
console.log(obj.x, obj.y) // 1 2

const obj2 = new func2(3)
console.log(obj2.x, obj2.y) // 2, 3
console.log(obj2 instanceof func1) // true
console.log(obj2 instanceof func2) // true
