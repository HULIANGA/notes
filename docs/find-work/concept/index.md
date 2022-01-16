## 原型
JavaScript 是基于原型的语言。

- 每个函数都有 `prototype` 属性。
- 每个对象都有 `__proto__` 属性，指向这个对象的构造函数的 `prototype` 属性。
- `prototype` 也是一个对象，也有 `__proto__` 属性，指向 `Object.prototype`，`Object.prototype` 的 `__proto__` 是 `null`。
- `prototype` 还有一个 `constructor` 属性，指向构造函数本身。
- 关系如下图所示：
    ![image.png](./prototype.png)
- `Object.create()` 方法创建一个新对象，使用现有的对象来提供新创建的对象的 `__proto__`。通过这个方法来继承：`Child.prototype = Object.create(Parent.prototype)`

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

以下代码的打印顺序：
``` js
async function async1() {
    console.log('p1')
    await async2()
    console.log('p2')
}
async function async2() {
    console.log('p3')
}
console.log('p4')
setTimeout(() => {
    console.log('p5')
}, 0)
async1()
new Promise(resolve => {
    console.log('p6')
    resolve()
})
.then(() => {
    console.log('p7')
})
console.log('p8') 

//p4 p1 p3 p6 p8 p2 p7 p5
```
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
### http 状态码
https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status

信息响应(100–199)，成功响应(200–299)，重定向(300–399)，客户端错误(400–499)和服务器错误 (500–599)。

- 301 Moved Permanently。
被请求的资源已永久移动到新位置，并且将来任何对此资源的引用都应该使用本响应返回的若干个 URI 之一。如果可能，拥有链接编辑功能的客户端应当自动把请求的地址修改为从服务器反馈回来的地址。除非额外指定，否则这个响应也是可缓存的。


- 302 Found。
请求的资源现在临时从不同的 URI 响应请求。由于这样的重定向是临时的，客户端应当继续向原有地址发送以后的请求。只有在Cache-Control或Expires中进行了指定的情况下，这个响应才是可缓存的。

- 304 Not Modified。
如果客户端发送了一个带条件的 GET 请求且该请求已被允许，而文档的内容（自上次访问以来或者根据请求的条件）并没有改变，则服务器应当返回这个状态码。304 响应禁止包含消息体，因此始终以消息头后的第一个空行结尾。

- 400 Bad Request。
1、语义有误，当前请求无法被服务器理解。除非进行修改，否则客户端不应该重复提交这个请求。
2、请求参数有误。

- 401 Unauthorized。
当前请求需要用户验证。该响应必须包含一个适用于被请求资源的 WWW-Authenticate 信息头用以询问用户信息。客户端可以重复提交一个包含恰当的 Authorization 头信息的请求。如果当前请求已经包含了 Authorization 证书，那么401响应代表着服务器验证已经拒绝了那些证书。如果401响应包含了与前一个响应相同的身份验证询问，且浏览器已经至少尝试了一次验证，那么浏览器应当向用户展示响应中包含的实体信息，因为这个实体信息中可能包含了相关诊断信息。

- 403 Forbidden。
服务器已经理解请求，但是拒绝执行它。与 401 响应不同的是，身份验证并不能提供任何帮助，而且这个请求也不应该被重复提交。如果这不是一个 HEAD 请求，而且服务器希望能够讲清楚为何请求不能被执行，那么就应该在实体内描述拒绝的原因。当然服务器也可以返回一个 404 响应，假如它不希望让客户端获得任何信息。

- 404 Not Found。
请求失败，请求所希望得到的资源未被在服务器上发现。没有信息能够告诉用户这个状况到底是暂时的还是永久的。假如服务器知道情况的话，应当使用410状态码来告知旧资源因为某些内部的配置机制问题，已经永久的不可用，而且没有任何可以跳转的地址。404这个状态码被广泛应用于当服务器不想揭示到底为何请求被拒绝或者没有其他适合的响应可用的情况下。

- 405 Method Not Allowed。
请求行中指定的请求方法不能被用于请求相应的资源。该响应必须返回一个Allow 头信息用以表示出当前资源能够接受的请求方法的列表。 鉴于 PUT，DELETE 方法会对服务器上的资源进行写操作，因而绝大部分的网页服务器都不支持或者在默认配置下不允许上述请求方法，对于此类请求均会返回405错误。

- 415 Unsupported Media Type。
对于当前请求的方法和所请求的资源，请求中提交的实体并不是服务器中所支持的格式，因此请求被拒绝。

- 500 Internal Server Error。
服务器遇到了不知道如何处理的情况。

- 501 Not Implemented。
此请求方法不被服务器支持且无法被处理。只有GET和HEAD是要求服务器支持的，它们必定不会返回此错误代码。

- 502 Bad Gateway。
此错误响应表明服务器作为网关需要得到一个处理这个请求的响应，但是得到一个错误的响应。

- 503 Service Unavailable。
服务器没有准备好处理请求。 常见原因是服务器因维护或重载而停机。 请注意，与此响应一起，应发送解释问题的用户友好页面。 这个响应应该用于临时条件和 Retry-After：如果可能的话，HTTP头应该包含恢复服务之前的估计时间。 网站管理员还必须注意与此响应一起发送的与缓存相关的标头，因为这些临时条件响应通常不应被缓存。

- 504 Gateway Timeout。
当服务器作为网关，不能及时得到响应时返回此错误代码。

- 505 HTTP Version Not Supported。
服务器不支持请求中所使用的HTTP协议版本。

### http 请求方法
https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods

- GET。
GET方法请求一个指定资源的表示形式，使用GET的请求应该只被用于获取数据。
- HEAD。
HEAD方法请求一个与GET请求的响应相同的响应，但没有响应体。
- POST。
POST方法用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用。
- PUT。
PUT方法用请求有效载荷替换目标资源的所有当前表示。
- DELETE。
DELETE方法删除指定的资源。
- CONNECT。
CONNECT方法建立一个到由目标资源标识的服务器的隧道。
- OPTIONS。
OPTIONS方法用于描述目标资源的通信选项。
- TRACE。
TRACE方法沿着到目标资源的路径执行一个消息环回测试。
- PATCH。
PATCH方法用于对资源应用部分修改。

### http header
https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers

### http 组成部分
HTTP 请求和响应具有相似的结构，由以下部分组成︰
1. 一行起始行用于描述要执行的请求，或者是对应的状态，成功或失败。这个起始行总是单行的。
2. 一个可选的HTTP头集合指明请求或描述消息正文。
3. 一个空行指示所有关于请求的元数据已经发送完毕。
4. 一个可选的包含请求相关数据的正文 (比如HTML表单内容), 或者响应相关的文档。 正文的大小有起始行的HTTP头来指定。

![image](./HTTPMsgStructure2.png)

### http 请求幂等性
一个HTTP方法是幂等的，指的是同样的请求被执行一次与连续执行多次的效果是一样的，服务器的状态也是一样的。

https://developer.mozilla.org/zh-CN/docs/Glossary/Idempotent
### http2
HTTP/1.x 报文有一些性能上的缺点：

1. Header 不像 body，它不会被压缩。
2. 两个报文之间的 header 通常非常相似，但它们仍然在连接中重复传输。
3. 无法复用。当在同一个服务器打开几个连接时：TCP 热连接比冷连接更加有效。

HTTP/2 引入了一个额外的步骤：它将 HTTP/1.x 消息分成帧并嵌入到流 (stream) 中。数据帧和报头帧分离，这将允许报头压缩。将多个流组合，这是一个被称为 多路复用 (multiplexing) 的过程，它允许更有效的底层 TCP 连接。

HTTP 帧现在对 Web 开发人员是透明的。在 HTTP/2 中，这是一个在  HTTP/1.1 和底层传输协议之间附加的步骤。Web 开发人员不需要在其使用的 API 中做任何更改来利用 HTTP 帧；当浏览器和服务器都可用时，HTTP/2 将被打开并使用。

![image](./Binary_framing2.png)

### https 获取加密密钥的过程
HTTPS （安全的HTTP）是 HTTP 协议的加密版本。它通常使用 SSL (en-US) 或者 TLS 来加密客户端和服务器之间所有的通信 。这安全的链接允许客户端与服务器安全地交换敏感的数据。

## 跨域

## 前端控制请求并发 

## 回流重绘

## canvas

## cookie
## vue
### diff原理

## webpack

## html
### meta标签
## css
### 上中下布局
### bfc 块级格式化上下文
### <link/>为什么要放在头部