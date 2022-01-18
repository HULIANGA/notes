// Function.prototype.myApply = function (thisArg, arg) {
//     thisArg.fn = this
//     var result = thisArg.fn(...arg)
//     delete thisArg.fn
//     return result
// }
// Function.prototype.myCall = function (thisArg, ...arg) {
//     thisArg.fn = this
//     var result = thisArg.fn(...arg)
//     delete thisArg.fn
//     return result
// }

// Function.prototype.myBind = function (thisArg, ...arg) {
//     if (typeof this !== "function") {
//         throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
//     }

//     var that = this
//     var newFunc = function () {
//         return that.apply(this instanceof newFunc ? this : thisArg, arg.concat([...arguments]))
//     }
//     newFunc.prototype = Object.create(this.prototype)
//     return newFunc
// }

// function func1(x, y) {
//     this.x = x;
//     this.y = y;
// }
// const obj = {}
// var func2 = func1.myBind(obj, 1)
// func2(2)
// console.log(obj.x, obj.y) // 1 2

// const obj2 = new func2(3)
// console.log(obj2.x, obj2.y) // 2, 3
// console.log(obj2 instanceof func1) // true
// console.log(obj2 instanceof func2) // true


// function parseNumber (val) {
//     const num = Number(val)
//     if (isNaN(num)) {
//         throw new Error('请传入数字');
//     }
//     // return num.toLocaleString('zh-CN', {
//     //     style: 'currency',
//     //     currency: 'CNY'
//     // })
//     return num.toLocaleString('zh-CN', {
//         maximumFractionDigits: 2
//     })
// }

// function parseNumber2 (val) {
//     const str = val.toString()
//     var num = 0, float = null
//     if (str.indexOf('.') > -1) {
//         [num, float] = str.split('.')
//     } else {
//         num = str
//     }
//     num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
//     float && (float = `.${parseFloat(`0.${float}`).toFixed(2).split('.')[1]}`)
//     return num + float
// }

// function parseNumber3 (val) {
//     var numberFormat = new Intl.NumberFormat('zh-CN', {
//         maximumFractionDigits: 2
//     })
//     return numberFormat.format(val)
// }

// console.log(parseNumber('15233453423423.5559291'))
// console.log(parseNumber2('15233453423423.5559291'))
// console.log(parseNumber3('15233453423423.5559291'))


// function throttle (func, time) {
//     var timeout
//     var prev = 0
//     var inTimeout = false
//     return function () {
//         var context = this
//         var args = arguments

//         var now = new Date().getTime()
//         if (!inTimeout && now - prev > time) {
//             prev = now
//             func.apply(this, arguments)
//         } else {
//             if (!timeout) {
//                 inTimeout = true
//                 timeout = setTimeout(function () {
//                     timeout = null
//                     func.apply(context, args)
//                 }, time)
//             }
//         }
//     }
// }

// var throttleFunc = throttle(function () {
//     console.log(new Date().getTime())
// }, 3000)

// setInterval(function () {
//     throttleFunc()
// }, 100)


// function debounce (func, time) {
//     var timeout
//     var immediate = true

//     return function () {
//         var context = this
//         var arg = arguments
//         if (immediate) {
//             immediate = false
//             func.apply(context, arg)
//         } else {
//             timeout && clearTimeout(timeout)
//             immediate = false
//             timeout = setTimeout(function () {
//                 func.apply(context, arg)
//             }, time)
//         }
//     }
// }


// var debounceFunc = debounce(function () {
//     console.log(new Date().getTime())
// }, 3000)

// setInterval(function () {
//     debounceFunc()
// }, 100)


// function Person (name, age) {
//     this.name = name
//     this.age = age
// }
// Person.prototype.sayHi = function () {
//     console.log(`Hi, i'm ${this.name}.`)
// }

// function Teacher (name, age, subject) {
//     Person.call(this, name, age)

//     this.subject = subject
// }

// // `Object.create()` 方法创建一个新对象，使用现有的对象来提供新创建的对象的 `__proto__`。通过这个方法来继承
// Teacher.prototype = Object.create(Person.prototype)
// Teacher.prototype.constructor = Teacher
// Person.prototype.sayHi = function () {
//     console.log(`Hi, i'm ${this.name}, i'm ${this.subject} teacher.`)
// }

// var teacher1 = new Teacher('huliang', 28, 'code')

// console.log(teacher1)


function Parent (name) {
    this.name = name
}
Parent.prototype.sayHi = function () {
    console.log(`Hi, i'm ${this.name}`)
}

function Child (age) {
    this.age = age
}

Child.prototype = new Parent('hh')

var a = new Child(12)
var b = new Child(24)

console.log(a.name)
console.log(a.age)
a.sayHi()
console.log(b.name)
console.log(b.age)
a.__proto__.name = 'abc'
console.log(a.name)
console.log(b.name)