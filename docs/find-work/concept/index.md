## 原型
JavaScript 是基于原型的语言。

- 每个函数都有 `prototype` 属性。
- 每个对象都有 `__proto__` 属性，指向这个对象的构造函数的 `prototype` 属性。
- `prototype` 也是一个对象，也有 `__proto__` 属性，指向 `Object.prototype`，`Object.prototype` 的 `__proto__` 是 `null`。
- `prototype` 还有一个 `constructor` 属性，指向构造函数本身。
- 关系如下图所示：
    ![image.png](./prototype.png)
- `Object.create()` 方法创建一个新对象，使用现有的对象来提供新创建的对象的 `__proto__`。通过这个方法来继承

## 原型链
当获取一个对象的属性时，会先从对象本身寻找，如果没有再到对象的 `__proto__` 寻找，还没有就再到对象的 `__proto__` 的 `__proto__` 寻找，直到 `Object.prototype`。

## 继承
### 通过原型链继承
1. 定义一个父类，添加属性和方法
    ``` javascript
    function Person (name, age) {
        this.name = name
        this.age = age
    }
    Person.prototype.sayHi = function () {
        console.log(`Hi, i'm ${this.name}.`)
    }
    ```
2. 定义子类，在子类的构造函数里调用父类构造函数，添加自己的属性，添加自己的方法或重写方法
    ``` javascript
    function Teacher (name, age, subject) {
        Person.call(this, name, age)

        this.subject = subject
    }
    Person.prototype.sayHi = function () {
        console.log(`Hi, i'm ${this.name}, i'm ${this.subject} teacher.`)
    }
    ```
3. 将子类的 `prototype.__proto__` 指向父类的 `prototype` 
    ```js{8}
    function Teacher (name, age, subject) {
        Person.call(this, name, age)

        this.subject = subject
    }

    // `Object.create()` 方法创建一个新对象，使用现有的对象来提供新创建的对象的 `__proto__`。通过这个方法来继承
    Teacher.prototype = Object.create(Person.prototype)

    Person.prototype.sayHi = function () {
        console.log(`Hi, i'm ${this.name}, i'm ${this.subject} teacher.`)
    }
    ```
4. 上面一步操作后，子类的 `prototype.constructor` 将会指向父类的构造函数，需要修改为子类构造函数
    ```js{9}
    function Teacher (name, age, subject) {
        Person.call(this, name, age)

        this.subject = subject
    }

    // `Object.create()` 方法创建一个新对象，使用现有的对象来提供新创建的对象的 `__proto__`。通过这个方法来继承
    Teacher.prototype = Object.create(Person.prototype)
    Teacher.prototype.constructor = Teacher

    Person.prototype.sayHi = function () {
        console.log(`Hi, i'm ${this.name}, i'm ${this.subject} teacher.`)
    }
    ```
### 几种继承的区别
https://github.com/mqyqingfeng/Blog/issues/16
## this
### this指向
- 在全局环境中 this 指向全局对象
    - 浏览器中是 window
    - node 环境中是 global
    - web worker 中是 self
    - 可以用 **globalThis** 在不同环境中获取全局 this 对象

- 在函数中谁调用 this 就指向谁
    - 可以通过 call 和 apply 改变函数的 this 指向
        ```javascript
        // 对象可以作为 bind 或 apply 的第一个参数传递，并且该参数将绑定到该对象。
        var obj = {a: 'Custom'};

        // 声明一个变量，并将该变量作为全局对象 window 的属性。
        var a = 'Global';

        function whatsThis() {
        return this.a;  // this 的值取决于函数被调用的方式
        }

        whatsThis();          // 'Global' 因为在这个函数中 this 没有被设定，所以它默认为 全局/ window 对象
        whatsThis.call(obj);  // 'Custom' 因为函数中的 this 被设置为obj
        whatsThis.apply(obj); // 'Custom' 因为函数中的 this 被设置为obj

        // --------------------------------------------------------

        function add(c, d) {
            return this.a + this.b + c + d;
        }

        var o = {a: 1, b: 3};

        // 第一个参数是用作“this”的对象
        // 其余参数用作函数的参数
        add.call(o, 5, 7); // 16

        // 第一个参数是用作“this”的对象
        // 第二个参数是一个数组，数组中的两个成员用作函数参数
        add.apply(o, [10, 20]); // 34
        ```
    - 可以使用 bind 创建一个固定 this 的新函数
        ``` javascript
        function f(){
            return this.a;
        }

        var g = f.bind({a:"azerty"});
        console.log(g()); // azerty

        var h = g.bind({a:'yoo'}); // bind只生效一次！
        console.log(h()); // azerty

        var o = {a:37, f:f, g:g, h:h};
        console.log(o.a, o.f(), o.g(), o.h()); // 37, 37, azerty, azerty
        ```
    - 严格模式和非严格模式有区别
        ``` javascript
        function f1(){
            return this;
        }
        //在浏览器中：
        f1() === window;   //在浏览器中，全局对象是window

        //在Node中：
        f1() === globalThis;

        function f2(){
            "use strict"; // 这里是严格模式
            return this;
        }

        f2() === undefined; // true
        ```
    - 箭头函数中，this与封闭词法环境的this保持一致
        ``` javascript
        var globalObject = this;
        var foo = (() => this);
        console.log(foo() === globalObject); // true
        ```

- js中函数的范围很广，以下列举各种情况
    - 当函数作为对象里的方法被调用时，this 被设置为**调用该函数的对象**。
        ``` javascript
        var o = {
            prop: 37,
            f: function() {
                return this.prop;
            }
        };

        console.log(o.f()); // 37
        // 这里调用 f 的是 o，所以 this 指向 o；如果是 o.d.f()，那么 this 就指向 d
        ```
    - 原型链中的 this 同上
    - getter 和 setter 中的 this 同上
    - 构造函数中的 this 指向被构造的对象
        ``` javascript
        function C (val) {
            this.a = val;
        }

        var o = new C(2);

        console.log(o.a); // logs 2
        ```
    - DOM事件处理函数中的 this 指向触发事件的元素
        ``` javascript
        // 被调用时，将关联的元素变成蓝色
        function bluify(e){
            console.log(this === e.currentTarget); // 总是 true

            // 当 currentTarget 和 target 是同一个对象时为 true
            console.log(this === e.target);
            this.style.backgroundColor = '#A5D9F3';
        }

        // 获取文档中的所有元素的列表
        var elements = document.getElementsByTagName('*');

        // 将bluify作为元素的点击监听函数，当元素被点击时，就会变成蓝色
        for(var i=0 ; i<elements.length ; i++){
            elements[i].addEventListener('click', bluify, false);
        }
        ```
    - 内联事件处理函数中的 this 指向监听器所在的DOM元素
        ``` javascript
        <button onclick="alert(this.tagName.toLowerCase());">
            Show this
        </button>
        // alert 会显示 button
        ```


### 实现bind
bind特点：
- 传入 this，返回一个固定 this 的函数
- 传入预置参数，调用返回的新函数时可以传入补充参数
- 返回的新函数可以使用 new，原先传入的 this 会被忽略，预置参数仍有效
``` javascript
function func1(x, y) {
    this.x = x;
    this.y = y;
}
const obj = {}
var func2 = func1.bind(obj, 1)
func2(2)
console.log(obj.x, obj.y) // 1 2

const obj2 = new func2(3)
console.log(obj2.x, obj2.y) // 2, 3
console.log(obj2 instanceof func1) // true
console.log(obj2 instanceof func2) // true
```
**借助 call 或 apply 实现 bind：**
1. 第一步，传入 this 并返回一个新函数
    ``` javascript
    Function.prototype.myBind = function (thisArg) {
        var that = this
        return function () {
            return that.apply(thisArg, [...arguments])
        }
    }
    ```

2. 第二步，传入预置参数
    ``` javascript
    Function.prototype.myBind = function (thisArg, ...arg) {
        var that = this
        return function () {
            return that.apply(thisArg, arg.concat([...arguments]))
        }
    }
    ```
    这里用了 [解构语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#%E8%AF%AD%E6%B3%95) 取函数传参，也可以用 `Array.prototype.slice` 方法从 arguments 截取。

3. 第三步，支持 new
    ``` javascript
    Function.prototype.myBind = function (thisArg, ...arg) {
        if (typeof this !== "function") {
            throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var that = this
        var newFunc = function () {
            return that.apply(this instanceof newFunc ? this : thisArg, arg.concat([...arguments]))
        }
        newFunc.prototype = Object.create(this.prototype)
        return newFunc
    }
    ```
    - 如果不是函数调用 bind，抛出错误
    - `this instanceof newFunc` 区分是普通函数调用还是构造函数调用
    - 使用 `Object.create` 让新函数继承原函数

**不借助 call 或 apply 实现 bind**

那就先自己实现一个call 或 apply
- 将原本的函数添加到传入的 this 属性里
- 调用这个函数
- 删除添加的属性
- 返回函数执行结果
- call 和 apply 只是传参格式不同，使用解构赋值可以很方便取值，如果不使用 es6 语法，则需要循环 arguments，拼接之后通过 eval 执行函数

### 实现call
``` javascript
Function.prototype.myCall = function (thisArg, ...arg) {
    thisArg.fn = this
    var result = thisArg.fn(...arg)
    delete thisArg.fn
    return result
}
```

### 实现apply
``` javascript
Function.prototype.myApply = function (thisArg, arg) {
    thisArg.fn = this
    var result = thisArg.fn(...arg)
    delete thisArg.fn
    return result
}
```

## 事件循环
宏任务和微任务：
- 宏任务：**script全部代码**、setTimeout、setInterval、setImmediate（只有IE10支持）、I/O、UI Rendering。
- 微任务：Process.nextTick（Node独有）、Promise、Object.observe(废弃)、MutationObserver
### 浏览器环境
有一个**主线程**和**调用栈**，所有的任务都会被放到调用栈中等待主线程执行。

同步任务会在调用栈中被主线程依次执行，异步任务会在**有了结果后将回调函数放入任务队列**，微任务放到微任务队列，宏任务放到宏任务队列。当调用栈空了之后会按顺序把微任务放入调用栈执行，当微任务队列空了之后会按顺序把宏任务放入调用栈执行，如此循环。
### node环境
https://zhuanlan.zhihu.com/p/54882306

## js异步
### Promise
### Generate
### async/await
## new
https://github.com/mqyqingfeng/Blog/issues/13
## 闭包

## 正则

## event
### event 类 on once 等方法
### 点击table的td显示td内容

## 类型转换

## http
### http 握手原理
### http 的方法有哪几种，每个方法的用途
### https 获取加密密钥的过程
### http 请求都包含哪些字段
### http 请求幂等性

## 跨域

## 前端控制请求并发 

## 回流重绘

## canvas

## cookie
## vue
### diff原理

## html
### meta标签
## css
### 上中下布局
### bfc 块级格式化上下文
### <link/>为什么要放在头部
