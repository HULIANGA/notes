## 每三位加逗号
- toLocaleString。注意要转为 Number
    ``` javascript
    function parseNumber (val) {
        const num = Number(val)
        if (isNaN(num)) {
            throw new Error('请传入数字');
        }
        // return num.toLocaleString('zh-CN', {
        //    style: 'currency',
        //    currency: 'CNY'
        // })
        return num.toLocaleString('zh-CN', {
            maximumFractionDigits: 2
        })
    }
    ```
- Intl.NumberFormat。配置参数和toLocaleString基本一样，需要格式化大量数字时，使用 NumberFormat 提高性能
    ``` javascript
    function parseNumber (val) {
        var numberFormat = new Intl.NumberFormat('zh-CN', {
            maximumFractionDigits: 2
        })
        return numberFormat.format(val)
    }
    ```
- 正则。注意要转为 String
    ``` javascript
    function parseNumber (val) {
        const str = val.toString()
        var num = 0, float = null
        if (str.indexOf('.') > -1) {
            [num, float] = str.split('.')
        } else {
            num = str
        }
        num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        float && (float = `.${parseFloat(`0.${float}`).toFixed(2).split('.')[1]}`)
        return num + float
    }
    ```

## 固定日期与当前时间格式化处理

## 多空格字符串格式化为数组

实现 sum(1)(2)(3).valueOf()，实现这么一个 sum 函数，返回 6
实现 taskSum(1000,()=>{console.log(1)}).task(1200,()=>{console.log(2)}).task(1300,()=>{console.log(3)})， 这里等 待 1s，打印 1，之后等待 1.2s，打印 2，之后打印 1.3s，打印 3

## 给定一个数组，一个期望值，找到数组中两 个相加等于期望值

## versions 是一个项目的版本号列表，因多人维护，不规则
var versions=['1.45.0','1.5','6','3.3.3.3.3.3.3'] 要求从小到大排序
注意'1.45'比'1.5'大
sorted=['1.5','1.45.0','3.3.3.3.3.3','6']

## deepClone
## 柯里化
https://github.com/mqyqingfeng/Blog/issues/42

## 换行字符串格式 化

## 背包问题

## 最长子序列

## 实现以下promisify方法
``` js
function delayToEcho(msg, cb) {
    setTimeout(() => {
        const err = Date.now() % 2 === 0 ? null : new Error();
        cb(err, msg);
    }, 3000);
}


// 正常调用
delayToEcho("msg", (err, msg) => {});
  
  
function promisify(fn) {
    // 请把这个函数实现，能够让以下代码能够成功运行
    return function (msg) {
        return new Promise((reslove, reject) => {
            fn.call(this, msg, function (err, m) {
                if (err) {
                    reject(err)
                } else {
                    reslove(m)
                }
            })
        })
    }
}
  
  
promisify(delayToEcho)("msg")
.then((msg) => {
    console.log(msg);
})
.catch((err) => {
    console.log(err);
});
```

## 二叉树中序遍历
## throttle节流
n秒内只执行一次

- 方法一
    ``` javascript
    function throttle (func, time) {
        var prev = 0
        return function () {
            var now = new Date().getTime()
            if (now - prev > time) { // 如果具体上一次执行超过了n秒就执行
                prev = now
                func.apply(this, arguments)
            }
        }
    }
    ```
    这种方法会在第一次触发时立即执行，但是停止触发后不会再执行

- 方法二
    ``` javascript
    function throttle (func, time) {
        var timeout
        return function () {
            var context = this
            var args = arguments
            if (!timeout) {
                timeout = setTimeout(function () { // 如果当前没有定时器，就创建一个定时器在n秒之后执行
                    timeout = null
                    func.apply(context, args)
                }, time)
            }
        }
    }
    ```
    这种方法第一次触发会延迟n秒执行，但是停止触发后最后会执行一次

- 方法三，结合以上两种的优点，首尾都执行
    ``` javascript
    function throttle (func, time) {
        var timeout
        var prev = 0
        var inTimeout = false
        return function () {
            var context = this
            var args = arguments

            var now = new Date().getTime()
            if (!inTimeout && now - prev > time) {
                prev = now
                func.apply(this, arguments)
            } else {
                if (!timeout) {
                    inTimeout = true
                    timeout = setTimeout(function () {
                        timeout = null
                        func.apply(context, args)
                    }, time)
                }
            }
        }
    }
    ```

## 前端控制请求并发 

## debounce防抖
n秒内没有新的执行请求才执行
``` javascript
function debounce (func, time) {
    var timeout
    return function () {
        var context = this
        var arg = arguments
        timeout && clearTimeout(timeout) // 有新的执行请求就把定时器取消
        timeout = setTimeout(function () {
            func.apply(context, arg)
        }, time)
    }
}
```
以上代码有个问题，第一次触发不会立即执行，优化如下：
``` javascript
function debounce (func, time) {
    var timeout
    var immediate = true

    return function () {
        var context = this
        var arg = arguments
        if (immediate) {
            immediate = false
            func.apply(context, arg)
        } else {
            timeout && clearTimeout(timeout)
            immediate = false
            timeout = setTimeout(function () {
                func.apply(context, arg)
            }, time)
        }
    }
}
```