# 主应用接入
## 安装qiankun
```bash
npm i qiankun -S
```
## 启动qiankun
<h3>注册子应用</h3>

使用 qiankun npm包提供的 registerMicroApps 方法注册子应用
```javascript
import { registerMicroApps } from 'qiankun'
const loader = loading => console.log(`加载子应用中：${loading}`)

registerMicroApps(
  [
    {
      name: 'user',
      entry: '//localhost:8081',
      container: '#subapp-viewport',
      loader,
      activeRule: '/user'
    },
    {
      name: 'authority',
      entry: '//localhost:8082',
      container: '#subapp-viewport',
      loader,
      activeRule: '/authority'
    }
  ],
  {
    beforeLoad: [
      app => {
        console.log('[LifeCycle] before load %c%s', 'color: green;', app.name)
      }
    ],
    beforeMount: [
      app => {
        console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name)
      }
    ],
    afterUnmount: [
      app => {
        console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name)
      }
    ]
  }
)
```

- name、activeRule和子应用的 package.name 保持一致
- entry为子应用访问地址
- container是子应用挂载容器
- loader返回子应用的加载状态，可以在主应用上添加loading

注册的子应用会在匹配到路由后自动加载，也可以使用 loadMicroApp 手动加载应用。
可查看官方详细 [api说明](https://qiankun.umijs.org/zh/api)

<h3>通信</h3>

通过 initGlobalState 方法可以初始化、监听和改变全局状态，和子应用里的使用方式一样。
```javascript
import { initGlobalState } from 'qiankun'
// 定义全局状态，可传入初始值
const { onGlobalStateChange, setGlobalState } = initGlobalState({
  user: 'qiankun'
})

// 监听全局状态变化
onGlobalStateChange((value, prev) => console.log('[onGlobalStateChange - master]:', value, prev))

// 设置全局状态
setGlobalState({
  ignore: 'master',
  user: {
    name: 'master'
  }
})
```
<h3>启动</h3>

使用 start 方法启动
```javascript
import { start } from 'qiankun'
start()
// 或
start({
  sandbox: {
    experimentalStyleIsolation: true
  }
})
// 或
start({
  sandbox: {
    strictStyleIsolation: true
  }
})
```
#### strictStyleIsolation
严格样式隔离模式。开启后qiankun会给每个子应用容器包裹上 [shadow dom](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM)，使主应用和子应用的样式不会互相影响。但是这**并不是一个可以无脑开启的方案**，存在以下问题：

- 大部分类似 Dialog 组件的实现都是在 body 下创建一个容器节点，但是 Shadow DOM 里 Dialog 的样式无法作用到全局，因此展示出来 Dialog 就是无样式的
- 浏览器兼容问题
- react下存在一些 [问题](https://github.com/facebook/react/issues/10422)
#### experimentalStyleIsolation
实验性样式隔离模式。开启后qiankun会给子应用的样式增加一个特定的选择器（类似vue里样式的scoped），html、body等元素样式会转换成div。但是**目前此方案也有局限性**：

- @keyframes, @font-face, @import, @page 等规则不支持
- <link />形式引入的样式不支持，所以如果子应用开启了样式提取（css.extract = true）将不支持
## 完整入口示例
```javascript
import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import { Button, Icon } from 'ant-design-vue'
import { registerMicroApps, start, initGlobalState } from 'qiankun'

Vue.config.productionTip = false

// 按需引入，所有组件：https://github.com/vueComponent/ant-design-vue/blob/master/components/index.js
// 需注意引入a-menu-item这种，引入Menu然后使用Menu.item.name即可
Vue.component(Button.name, Button)
Vue.component(Icon.name, Icon)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

const loader = loading => console.log(`加载子应用中：${loading}`)

registerMicroApps(
  [
    {
      name: 'user',
      entry: '//localhost:8081',
      container: '#subapp-viewport',
      loader,
      activeRule: '/user'
    },
    {
      name: 'authority',
      entry: '//localhost:8082',
      container: '#subapp-viewport',
      loader,
      activeRule: '/authority'
    }
  ],
  {
    beforeLoad: [
      app => {
        console.log('[LifeCycle] before load %c%s', 'color: green;', app.name)
      }
    ],
    beforeMount: [
      app => {
        console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name)
      }
    ],
    afterUnmount: [
      app => {
        console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name)
      }
    ]
  }
)

// 定义全局状态，可传入初始值
const { onGlobalStateChange, setGlobalState } = initGlobalState({
  user: 'qiankun'
})

// 监听全局状态变化
onGlobalStateChange((value, prev) => console.log('[onGlobalStateChange - master]:', value, prev))

// 设置全局状态
setGlobalState({
  ignore: 'master',
  user: {
    name: 'master'
  }
})

start()
```
