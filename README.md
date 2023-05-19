# 概述
该项目为网上所找到的一个开源项目
按照其开发过程，将各流程的进行记录，以便学习

# 创建项目
npm init vite
```json
package.json版本参考：
"dependencies": {
"react": "^18.2.0",
"react-dom": "^18.2.0",
"react-redux": "^7.2.8",
"react-router-dom": "^6.3.0",
"redux": "^4.1.2"
}
```

# 样式初始化
npm i reset-css
> reset-css比Normalize.css更直接，干净利落去除默认样式，更适合在企业里的场景

正确的样式引入顺序
* 样式初始化一般放在最前面
* UI框架样式
* 组件的样式

# scss的安装和初步使用
npm i --save-dev sass

```scss
$color:#eee;
body{
// 禁止选中文字
user-select:none;
background-color: $color;
}
img{
// 禁止拖动图片
-webkit-user-drag:none;
}
```

# 路径别名的配置
目前ts对@指向src目录的提示是不支持的，vite默认也不支持
所以需要手动配置@符号的指向
在vite。config。ts中添加配置
```TS
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@":path.resolve(__dirname,'./src')
    }
  }
})

```
npm i -D @types/node

# 配置路径别名的提示
虽然路径别名已经有了，但是在文件中输入@是没有提示路径的  
需要在tsconfig。json中，添加两项配置：  
```ts
"baseUrl": "./",
"paths": {
    "@/*": [
    "src/*"
    ]
}
```

# scss模块化
如果有两个组件 Comp和Comp1，且里面都有样式类名为box，如果采用全局引入，则另一个组件Comp1中的box也会受到影响。 所以需要模块化
原有的src/components/Comp/comp.scss 改名为 comp.module.scss
```tsx
// import './comp.scss'  //全局引入，可能会有影响其他组件
import * as React from "react"
// 模块化引入
import styles from './comp.module.scss'

function Comp(){
    return (
        <div className={styles.box}>
            <p>This is the content of Comp</p>
        </div>
    )
}

export default Comp
```
> className采用js表达式，读取模块化scss里面的box样式

# 引入Antd Design
安装： npm i antd --save  

安装图标所需要的模块： npm i --save @ant-design/icons

main.tsx
```tsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from 'antd';
import {UpCircleOutlined} from '@ant-design/icons'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Button type="primary">Primary Button</Button>
      <UpCircleOutlined style={{fontSize: '40px',color: 'red'}}/>
    </>
  )
}

export default App

```

# React路由 ———— 第一种配置方法（旧项目写法）
```tsx
import App from "../App"
import Home from "../views/Home"
import About from "../views/About"
import React from 'react'
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"

// 两种路由模式的组件： BrowserRouter ( History模式 ) ， HashRouter( Hash模式 )
// const baseRouter = () => {
// return ()
// }
 

// 以上写法可以简写为：
const baseRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App/>}>
                {/* 重定向 */}
                <Route path="/" element={<Navigate to="/home"/>}></Route>
                <Route path="/home" element={<Home/>}></Route>
                <Route path="/about" element={<About/>}></Route>
                </Route>
        </Routes>
    </BrowserRouter>
)
export default baseRouter
```


# React路由————第二种配置方案（推荐）
src/router/index.tsx:
```tsx
import * as React from 'react'
import Home from '../views/Home'
import About from '../views/About'
import { Navigate } from 'react-router-dom'

const routes = [
    {
        path: "/",
        element: <Navigate to="/home"/>
    },
    {
        path: '/home',
        element: <Home />
    },
    {
        path: '/about',
        element: <About />
    }
]

export default routes
```

main.tsx:
```tsx
import * as React from 'react'
import ReactDOM from 'react-dom/client'

// 样式初始化一般放在最前面
import "reset-css"
// 全局样式
import "@/asset/styles/global.scss"

import App from './App.tsx'
import { BrowserRouter } from "react-router-dom"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

App.tsx:
```tsx
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import * as React from "react"

import { useRoutes,Link } from "react-router-dom"
import router from "./router/index"

function App() {
  const [count, setCount] = useState(0)
  const outlet = useRoutes(router)
  return (
    <>
      <Link to="/home">Home</Link> |
      <Link to="/about">About</Link> 

      { outlet }
    </>
  )
}

export default App
```

# 路由懒加载
将Home和About做成懒加载组件
```tsx
import { lazy } from 'react'
import Home from "../views/Home"
const About = lazy(() => import("../views/About"))
```
按照正常的写法，写完会报错：Uncaught Error: A component suspended while responding to synchronous input.  
This will cause the UI to be replaced with a loading indicator.  
这是React路由懒加载的时候在嵌套路由中强制要求必须有loading组件  
```tsx
{
path:"/about",
element:
// 这种写法是来解决下面这个报错的
<React.Suspense fallback={<div>Loading...</div>}>
<About />
</React.Suspense>
},
```
<br/>
但是懒加载组件可能会复用很多次，所以可以进行封装。完整代码如下：

```tsx
import React , { lazy } from 'react'
// import Home from '../views/Home'
// import About from '../views/About'
const About = lazy(()=>import("../views/About"))
const Home = lazy(()=>import("../views/Home"))

// 报错：A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. 
//      To fix, updates that suspend should be wrapped with startTransition.
// 指懒加载模式需要给他添加一个Loading组件

import { Navigate } from 'react-router-dom'

// 封装懒加载的Loading组件
const withLoadingComponent = (comp:JSX.Element) => {
    return (
        <React.Suspense fallback={<div>Loading</div>}>
           { comp }
        </React.Suspense>
    )
}

const routes = [
    {
        path: "/",
        element: <Navigate to="/home"/>
    },
    {
        path: '/home',
        element: withLoadingComponent(<Home />)
    },
    {
        path: '/about',
        element: withLoadingComponent(<About />)
    }
]

export default routes
```

# 首页结构布局（Ant Design）

```tsx
import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

const breadcrumbItems = [
    {
        title: 'Home',
    },
    {
        title: <a href=''>Application</a>
    }
]

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuClick = (e) => {
    console.log(e);
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
        {/* 左侧边栏 */}
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={menuClick}/>
      </Sider>

      {/* 右边内容 */}
      <Layout>
        {/* 右边头部 */}
        <Header style={{ padding: 0, background: colorBgContainer }} >
            {/* 面包屑 */}
            <Breadcrumb style={{ lineHeight: '64px', marginLeft: '16px'}} items={breadcrumbItems}/>
        </Header>

        {/* 右边内容 */}
        <Content style={{ margin: '16px 16px 0', padding: 24, minHeight: 360, background: colorBgContainer }}>
            {/* 窗口部分 */}

        </Content>

        {/* 右边底部 */}
        <Footer style={{ textAlign: 'center',padding: 0,lineHeight: "48px" }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
```
