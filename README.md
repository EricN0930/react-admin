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


# 嵌套路由
router/index.tsx
```tsx
const routes = [
    {
        path: "/",
        element: <Navigate to="/page1"/>,
    },
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: '/page1',
                element: withLoadingComponent(<Page1 />)
            },
            {
                path: '/page2',
                element: withLoadingComponent(<Page2 />)
            },
        ]
    },
    {
        path: '/about',
        element: withLoadingComponent(<About />)
    }
]
```
Home.tsx:
```tsx
  {/* 右边内容 */}
  <Content style={{ margin: '16px 16px 0', padding: 24, minHeight: 360, background: colorBgContainer }}>
      {/* 窗口部分 */}
      <Outlet></Outlet>
  </Content>
```

# 主菜单组件的抽取以及侧边栏的收缩与展开
对于Menu组件的操作也许会很多，为了方便组件化和页面整洁，可以将Menu单独提取出来封装成组件，以免全部写在Home页面里
Components/MainMenu/index.tsx:
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
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';

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
  getItem('Option 1', '/page1', <PieChartOutlined />),
  getItem('Option 2', '/page2', <DesktopOutlined />),
  getItem('User', '/sub1', <UserOutlined />, [
    getItem('Tom', '/3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

const Comp: React.FC = () => {
    const navigateTo = useNavigate()

  const [openKeys, setOpenKeys] = useState(['']);
  const handleOpenChange = (keys:string[]) => { // keys是一个数组，记录了当前哪一项是展开的（用key记录）
    // 展开和回收某项菜单时，执行
    // setOpenKeys为设置展开项，只传入keys数组的最后一项，即表示默认只展开最近点击的一项
    setOpenKeys([keys[keys.length-1]])
  }

  const menuClick = (e:{key:string}) => {
    console.log(e.key);
    navigateTo(e.key)
  }

  return (
    <Menu 
        theme="dark" 
        defaultSelectedKeys={['/page1']} 
        mode="inline" 
        items={items} 
        onClick={menuClick} 
        onOpenChange={handleOpenChange}
        // 当前菜单展开项的key数组
        openKeys={openKeys}
    />
  )
}

export default Comp
```
Home.tsx中删除所有关于Menu的代码，引入组件即可  
import MainMenu from '@/components/MainMenu';

# 菜单数据的整理
原写法：
```tsx
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
  getItem('Option 1', '/page1', <PieChartOutlined />),
  getItem('Option 2', '/page2', <DesktopOutlined />),
  getItem('User', '/sub1', <UserOutlined />, [
    getItem('Tom', '/3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];
```

等价于：
```tsx
const items: MenuItem[] = [
  {
    label: '栏目1',
    key: '/page1',
    icon: <PieChartOutlined />
  },
  {
    label: '栏目2',
    key: '/page2',
    icon: <DesktopOutlined />
  },
  {
    label: '栏目3',
    key: 'page3',
    icon: <UserOutlined />,
    children: [
      {
        label: '栏目3-1',
        key: '/page3/1',
      },
      {
        label: '栏目3-2',
        key: '/page3/2',
      },
      {
        label: '栏目3-3',
        key: '/page3/3',
      },
    ]
  },
  {
    label: '栏目4',
    key: 'page4',
    icon: <TeamOutlined />,
    children: [
      {
        label: '栏目4-1',
        key: '/page4/1',
      },
      {
        label: '栏目4-2',
        key: '/page4/2',
      },
    ]
  },
  {
    label: '栏目5',
    key: '/page5',
    icon: <FileOutlined />
  },
]
```

上面的封装写法更简洁，但下面的等价写法看上去更直观一些。
因为后续会根据登录的账号不同，也许会有权限模块，各账号所能展现得模块不一样。 下面的写法更便于后续item匹配  

# 其余路由配置
```tsx
const routes = [
    {
        path: "/",
        element: <Navigate to="/page1"/>,
    },
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: '/page1',
                element: withLoadingComponent(<Page1 />)
            },
            {
                path: '/page2',
                element: withLoadingComponent(<Page2 />)
            },
            {
                path: '/page3/1',
                element: withLoadingComponent(<Page301 />)
            },
            {
                path: '/page3/2',
                element: withLoadingComponent(<Page302 />)
            },
            {
                path: '/page3/3',
                element: withLoadingComponent(<Page303 />)
            },
        ]
    },
    // 当用户输入的url地址并不能匹配时，重定向到首页
    {
        path: "*",
        element: <Navigate to="/page1"/>
    }
]
```
当路径不匹配或用户手动输入非法路径时，可以用 * 进行匹配，跳转到首页

# 刷新时默认当前选中样式
目前菜单栏还有些bug，比如 选择栏目2，会有选中样式，但是一刷新，样式又变回默认的选中项了。  
但是通过观察，url路径依旧是page2的，所以可以通过url路径来解决这一bug
```tsx
<Menu 
  theme="dark" 
  // defaultSelectedKeys 表示当前样式所在的选中的key
  defaultSelectedKeys={[currentRoute.pathname]} 
  mode="inline" 
  // 菜单项的数据
  items={items} 
  onClick={menuClick}  
  onOpenChange={handleOpenChange}
  // 当前菜单展开项的key数组
  openKeys={openKeys}
/>
```
并且如果选择子选项，刷新后 应该该父选项仍保持展开
```tsx
const Comp: React.FC = () => {
  const navigateTo = useNavigate()
  const currentRoute = useLocation();

  let firstOpenKey: string = ""

  function findKey(obj){
    return obj.key === currentRoute.pathname

  }
  for(let i = 0;i<items.length;i++){
    if( items[i]['children'] && items[i]['children'].length > 0 && items[i]['children'].find(findKey) ){ // 找到
      firstOpenKey = items[i].key;
      break;
    }
  }

  const [openKeys, setOpenKeys] = useState([firstOpenKey]);

  ...

}
```

# 验证码布局和登录页样式
Login/index.tsx:
```tsx
<div className='captchaBox'>
  <Input placeholder="验证码" className='ipt'/>
  <div className="captchaImg">
    <img src="xxx" height="38" alt="" />
  </div>
</div>
```

Login/Login.less:
```less
.loginbox{
    // 控制表单元素
    .ant-input, .ant-input-password{
        background-color: rgba(255,255,255,0);
        border-color: #1890ff;
        color: #fff;
        height: 38px;
        // 控制placeholder文字样式
        &::placeholder {
            // color: #1890ff !important;
            color: rgba(24,144,255,.8) !important;
        }
    }
    // 控制眼睛图标
    .anticon.anticon-eye-invisible.ant-input-password-icon {
        color: #1890ff;
    }
    // 单独控制密码高度
    .ant-input-password {
        .ant-input {
            height: 28px;
        }
    }
    // 控制验证码盒子
    .captchaBox {
        display: flex;
        .captchaImg {
            margin-left: 20px;
            cursor: pointer;
        }
    }
    // 控制登录按钮
    .loginBtn {
        height: 38px;
    }
}
```

# 获取用户所输入的登录信息
Login/index.tsx:
```tsx
import React,{ChangeEvent,useEffect,useState} from 'react';

  // 获取用户输入的信息
  const [usernameVal,setUsernameVal] = useState(""); // 定义用户输入用户名 变量
  const [passwordVal,setPasswordVal] = useState(""); // 定义用户输入密码 变量
  const [captchaVal,setCaptchaVal] = useState(""); // 定义用户输入验证码 变量
  const usernameChange = (e:ChangeEvent<HTMLInputElement>) => {
      setUsernameVal(e.target.value)
  }
  const passwordChange = (e:ChangeEvent<HTMLInputElement>) => {
      setPasswordVal(e.target.value)
  }
  const captchaChange = (e:ChangeEvent<HTMLInputElement>) => {
      setCaptchaVal(e.target.value)
  }

  // 点击登录按钮回调
  const goToLogin = () => {
      console.log(usernameVal,passwordVal,captchaVal);
  }

  {/* form */}
  <div className='form'>
      <Space direction="vertical" size="large" style={{ display: 'flex' }}>
          <Input placeholder="用户名" onChange={usernameChange}/>
          <Input.Password placeholder="密码" onChange={passwordChange}/>
          <div className="captchaBox">
              <Input placeholder="验证码" onChange={captchaChange}/>
              <div className="captchaImg">
                  <img src="" alt="code.png" height='38'/>
              </div>
          </div>
          <Button type="primary" block className="loginBtn" onClick={goToLogin}>登录</Button>
      </Space>
  </div>
```

# ReactRedux的基本配置
首先，确保浏览器有redux dev tools开发者工具，zip包放在了src/tools/reduxdevtools.zip  
拖动到浏览器的扩展程序即可  

安装 Redux 和 ReactRedux ：
```
npm i redux react-redux --save
```

/src下新建store，新建index.ts文件
```ts
import {legacy_createStore } from "redux"
import reducer from './reducer.ts'

// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// 让浏览器redux-dev-tools能正常使用
const store = legacy_createStore(reducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
```

/src/store下新建reducer.ts文件：
```ts
const defaultState = {
    num: 20
}

let reducer = (state = defaultState) => {
    let newState = JSON.parse(JSON.stringify(state))

    return newState
}

export default reducer
```

main.tsx中全局引入:
```tsx
// 状态管理
import {Provider} from "react-redux"
import store from '@/store/index.ts'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
```

组件中若要使用redux，如Page1.tsx:
```tsx
import React from "react"
import { useSelector , useDispatch } from "react-redux"

const Page1 = () => {
    // 通过useSelector获取仓库数据
    const {num} = useSelector((state) => (
        {
            num: state.num
        }
    ))
    
    // 通过useDispatch修改仓库数据
    const dispatch = useDispatch() 
    const changeNum = () => {
        // dispatch({type:"字符串（认为是一个记号）",value: 3})   type是固定的，value字段是自定义的
        dispatch({type:"add1"})
        // dispatch({type:"add2",value:10})
    }

    return (
        <>
        <div className='page1'>
            <p>This is the content of Page1</p>
            <p>{num}</p>
            <button onClick={changeNum}>按钮</button>
        </div>
        </>
    )
}

export default Page1
```
对应上面的操作，reducer中写修改数据的代码
reducer.ts:
```ts

const defaultState = {
    num: 20
}

let reducer = (state = defaultState, action:{type:string, value:number}) => {
    // 调用dispatch执行这里代码

    let newState = JSON.parse(JSON.stringify(state))

    switch(action.type){
        case "add1":
            newState.num++
            break;
        case "add2":
            newState.num += action.value
            break;
        default: 
            break;
    }

    return newState
}

export default reducer
```

# 解决两个下划线警告问题
首先，在我们组建页，想要获取store数据时，store上的数据经常会出现下划线，提示找不到  
这时候可以用ts给的ReturnType，获取函数类型返回值类型  
且考虑到可能每个模块都要用到这个类型，可以放到全局声明文件中去  
在src下新建types文件夹，新建 store.d.ts：
```ts
// 【重点】d.ts 文件仅在没有任何导入时才被视为环境模块声明.如果您提供了一个导入行，它现在被视为
// 一个普通的模块文件，而不是全局文件！！！

// 【重点】类型声明不要直接使用引入 import...from...   而是 使用 import("@/...")这种语法

// TS中提供了ReturnType，用来获取函数类型的返回值类型
type RootState = ReturnType<typeof import('@/store/index.ts').getState>;

interface Window{
    __REDUX_DEVTOOLS_EXTENSION__: function;
}
```

其次，为了让浏览器可以正常使用redux devtools，在store/index.ts中引入了一些配置,也有下划线报错  
继续在store.d.ts文件中添加， 代码如上面代码块所示，添加Window接口

# 对于reducer中的数据和方法进行抽取
上面我们所有的数据和方法全部写在了reducer里面，不论什么模块都放在里面写，很容易混乱。所有需要按照模块对它们进行抽取  
src/store新建NumStatus文件夹，新建index.ts
```ts
export default {
  state: {
      num:20
  },
  actions: {
      add1(newState:{num:number}){
          newState.num++;
      },
      add2(newState:{num:number},action:{type:string,value:number}){
          console.log('action',action);
          
          newState.num += action.value;
      }
  },
  // 名字统一管理
  add1: "add1",
  add2: "add2",
}
```

src/store/reducer.ts:
```ts
import handleNum from "./NumStatus/index.ts"

const defaultState = {
    // num: handleNum.state.num  
    ...handleNum.state  // 解构写法
}

let reducer = (state = defaultState, action:{type:string, value:number}) => {
    // 调用dispatch执行这里代码

    let newState = JSON.parse(JSON.stringify(state))

    switch(action.type){
        case handleNum.add1:  // 名字统一管理后就不用写出 "add1" 了，这样可以避免变量名重复，且结构更清晰
            handleNum.actions.add1(newState,action)
            break;
        case handleNum.add2:
            handleNum.actions.add2(newState,action)
            break;
        default: 
            break;
    }

    return newState
}

export default reducer
```


# ReactRedux的模块化 【重点】
对于上面的模块化依旧不够彻底，因为如果模块多了，reducer.ts也会变得很长，所有模块都要在reducer.ts中过一遍  
如何优化reducer，也模块化到各个功能模块中？  —————— 利用 combineReducers

src/store/index.ts
```ts
import {legacy_createStore,combineReducers } from "redux"

import handleNum from "./NumStatus/reducer.ts"
import handleNum1 from "./NumStatus1/reducer.ts"

// 组合各个模块的reducer
const reducers = combineReducers({
    handleNum,
    handleNum1
})

// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// 让浏览器redux-dev-tools能正常使用
const store = legacy_createStore(reducers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store; 
```

src/store/NumStatus中新建reducer.ts
```ts
import handleNum from "./index.ts"

const defaultState = {
    ...handleNum.state
}

let reducer = (state = defaultState, action:{type:string, value:number}) => {
    let newState = JSON.parse(JSON.stringify(state))

    switch(action.type){
        case handleNum.add1:  // 名字统一管理后就不用写出 "add1" 了，这样可以避免变量名重复，且结构更清晰
            handleNum.actions.add1(newState,action)
            break;
        case handleNum.add2:
            handleNum.actions.add2(newState,action)
            break;
        default: 
            break;
    }

    return newState
}

export default reducer
```

src/store/NumStatus/index.ts
```ts
export default {
    state: {
        num:20
    },
    actions: {
        add1(newState:{num:number}){
            newState.num++;
        },
        add2(newState:{num:number},action:{type:string,value:number}){
            console.log('action',action);
            
            newState.num += action.value;
        }
    },
    // 名字统一管理
    add1: "add1",
    add2: "add2",
}
```

NumStatus1的内容一致，不同之处为NumStatus1的按钮每点击一次增加100，初始化为100

Page1.tsx:
```tsx
import React from "react"
import { useSelector , useDispatch } from "react-redux"
// import store from "@/store/index.ts"

const Page1 = () => {
    // 通过useDispatch修改仓库数据
    const dispatch = useDispatch() 
    
    // 通过useSelector获取仓库数据
    const {num} = useSelector((state:RootState) => (
        {
            num: state.handleNum.num
        }
    ))
    
    const {num1} = useSelector((state:RootState) => (
        {
            num1: state.handleNum1.num
        }
    ))
    const changeNum = () => {
        // dispatch({type:"字符串（认为是一个记号）",value: 3})   type是固定的，value字段是自定义的
        // dispatch({type:"add1"})
        dispatch({type:"add2",value:10})
    }

    const changeNum1 = () => {
        dispatch({type:"add",value:100})
    }
    return (
        <>
        <div className='page1'>
            <p>This is the content of Page1</p>
            <p>{num}</p>
            <button onClick={changeNum}>Num按钮，每次加10</button>
            <p>{num1}</p>
            <button onClick={changeNum1}>Num1按钮，每次加100</button>
        </div>
        </>
    )
}

export default Page1
```

# ReactRedux代码优化
在上面的写法中，我们每对一个模块进行添加、修改等操作，都需要在模块的index文件里编写action，然后在模块的reducer里面写操作  
所以 优化目标： 以后每添加一个方法，只需要在模块的index文件里修改，reducer文件就不再更改  
将index里面名字统一管理采用对象的形式，reducer文件里不再采用switch case语法，而是用for循环遍历  
index.ts:
```ts
    // 名字统一管理
    // add1: "add1",
    // add2: "add2",
    actionNames: {
        add1: "add1",
        add2: "add2",
    }
```
reducer.ts:
```ts
import handleNum from "./index.ts"

const defaultState = {
    ...handleNum.state
}

let reducer = (state = defaultState, action:{type:string, value:number}) => {
    let newState = JSON.parse(JSON.stringify(state))

    // 优化思路： switch的做法即 拿着action.type 和 case后面每一个进行对比。 与遍历相似
    // 优化即可将case后面的项做成对象 actionNames
    // switch(action.type){
    //     case handleNum.add1: 
    //         // handleNum.actions.add1(newState,action)
    //         handleNum.actions[handleNum.add1](newState,action)
    //         break;
    //     case handleNum.add2:
    //         handleNum.actions[handleNum.add2](newState,action)
    //         break;
    //     default: 
    //         break;
    // }


    // 【优化】这样写就可以 每次写一个方法，就不需要在该reducer文件里做修改
    for(let key in handleNum.actionNames){
        if(action.type === handleNum.actionNames[key]){
            handleNum.actions[handleNum.actionNames[key]](newState,action)
        }
    }
    return newState
}

export default reducer
```

## 优化2：方法名对象自动生成
对于上述的优化，还不是彻底，如果每添加一个方法，不需要在方法名对象上添加，而是自动生成就更方便了 
src/store/NumStatus/index.ts 
```ts
    // 名字统一管理
    // add1: "add1",
    // add2: "add2",
    actionNames: {}
}

let actionNames = {}
for(let key in store.actions){
    actionNames[key] = key
}
store.actionNames = actionNames
export default store

```

# react-redux的异步解决方案 redux-thunk
如果在NumStatus/index.ts中做异步操作，目前是无效的。所以需要异步方案来解决 （可以使用redux-saga 或 redux-thunk）  
这里使用redux-thunk，因为体积更小，更灵活，学习成本较低。 但需要手动抽取和封装  
安装：
```
npm i redux-thunk
```
store/NumStatus/index.ts文件加入AsyncActions对象用于存放异步
```ts
const store = {
    state: {
        num:20
    },
    actions: {
        add1(newState:{num:number}){
            newState.num++;
        },
        add2(newState:{num:number},action:{type:string,value:number}){
            newState.num += action.value;
        }
    },
    // 优化redux-thunk的异步写法（模仿Vuex的写法）
    asyncActions:{  // 只放异步方法
        asyncAdd1(dispatch:Function){  // dis 其实就是 同步的dispatch，为了避免混淆
            setTimeout(()=>{
                dispatch({type:"add1"})
            },1000)
        }
    },
    // 名字统一管理
    // add1: "add1",
    // add2: "add2",
    actionNames: {}
}
```

Page1.tsx:
```tsx
import numStatus from '@/store/NumStatus/index.ts'

const changeNumAsync = () => {
  // 同步的写法
  // dispatch({type:"add1",value:10})
  // 异步的写法 redux-thunk的用法  格式 ： dispatch(异步执行函数)
  // dispatch((dis:Function)=>{  // dis 其实就是 同步的dispatch，为了避免混淆
  //     setTimeout(()=>{
  //         dis({type:"add1",value:10})
  //     })
  // })
  dispatch(numStatus.asyncActions.asyncAdd1)
}
```

# React-redux 总结使用
对于新模块Xxx的redux使用  
src/store下新建XxxStatus文件夹，新建index.ts reducer.ts
src/store/XxxStatus/index.ts :
```ts
const store = {
    state: {
        // 放数据
    },
    actions: {
        // 放同步方法
    },
    asyncActions:{ 
        // 放异步方法
    },
    actionNames: {}
}

let actionNames = {}
for(let key in store.actions){
    actionNames[key] = key
}
store.actionNames = actionNames
export default store

```

src/store/XxxStatus/reducer.ts :
```ts
import XxxStatus from "./index.ts"

const defaultState = {
    ...XxxStatus.state
}

let reducer = (state = defaultState, action:{type:string, value:number}) => {
    let newState = JSON.parse(JSON.stringify(state))

    for(let key in XxxStatus.actionNames){
        if(action.type === XxxStatus.actionNames[key]){
            XxxStatus.actions[XxxStatus.actionNames[key]](newState,action)
        }
    }
    return newState
}

export default reducer
```

对于组件中获取该模块的数据
Page.tsx:
```tsx
import React from "react"
import { useSelector , useDispatch } from "react-redux"
import XxxStatus from '@/store/XxxStatus/index.ts'

// 通过useDispatch修改仓库数据
const dispatch = useDispatch() 
    
// 通过useSelector获取仓库数据
const {param1,param2} = useSelector((state:RootState) => (
    {
        param1: state.XxxStatus.param1,
        param2: state.Xxx2Status.param2,
    }
))

const changeNum = () => { // 同步
    dispatch({type:"Xxx",value:10})
}
const changeNumAsync = () => {  // 异步
    dispatch(XxxStatus.asyncActions.xxxFn)
}
```

# 数据交互的解决方案
## axios封装和api的抽取
安装axios
```
npm i axios
```

src下新建api文件夹，新建index.ts
```ts
import axios from "axios"

// 创建axios实例
const instance = axios.create({
    // 基本请求路径的抽取
    baseURL:"http://xue.cnkdl.cn:23683",
    // 这个时间是你每次请求的过期时间，这次请求认为20秒之后这个请求就是失败的
    timeout:20000
})
// 请求拦截器
instance.interceptors.request.use(config=>{

    return config
},err=>{
    return Promise.reject(err)
});
// 响应拦截器
instance.interceptors.response.use(res=>{
    return res.data

},err=>{
    return Promise.reject(err)
})

export default instance
```

src/api下新建request.ts
```ts
// 统一管理项目中所有的请求路径 api
import request from "./index"

// 验证码请求
export const CaptchaAPI = () => request.get("/prod-api/captchaImage");
```

Login.tsx:
```tsx
import { CaptchaAPI } from "@/api/request"

// 验证码请求
  const getCaptcha = async () => {
      let captchaAPIRes:CaptchaAPIRes = await CaptchaAPI();
      console.log("captchaAPIRes",captchaAPIRes);
      
  }
```

由于采用TS，所以需要给api的响应数据添加类型，在src/types文件夹下新建 api.d.ts 用于定义请求参数的类型 和 响应的类型  
```ts
interface CaptchaAPIRes {
  msg: string;
  img: string;
  code: number;
  captchaEnabled: boolean;
  uuid: string;
}
```
可以根据接口文档定义响应类型，也可以根据api返回的数据使用插件生成。安装 JSON to TS 插件
这里是先定义接口，并调用接口返回数据，复制控制台打印的响应数据（右键 Copy object），然后粘贴到api.d.ts中，选中后使用插件(shift + alt + ctrl + v)即可将选中的JSON数据全部转换成ts类型  

api/request.ts:
```ts
// 验证码请求
export const CaptchaAPI = ():Promise<CaptchaAPIRes> => request.get("/prod-api/captchaImage");
```
可以在request.ts文件中定义响应类型 :Promise<CaptchaAPIRes>, 这样定义后，在Login/index.tsx中就不需要再定义了

# 完成验证码业务
发送获取验证码请求，根据返回的img字段，拼接成字符串给img的src，并设置加载组件时调用
src/views/Login/index.tsx：
```tsx
const login = () => {
  // 加载完这个组件之后,加载背景
  useEffect(() => {
      initLoginBg();
      window.onresize = function(){ initLoginBg() }
      console.log('123123');
      
      // 获取验证码
      getCaptcha()
  },[])

  // 验证码请求
  const getCaptcha = async () => {
    let captchaAPIRes:CaptchaAPIRes = await CaptchaAPI();
    // console.log("captchaAPIRes",captchaAPIRes);
    if(captchaAPIRes.code === 200){
        // 把图片数据显示在img上
        setCaptchaImg("data:image/gif;base64," + captchaAPIRes.img)
        // 本地保存uuid，给登录接口使用
        localStorage.setItem("uuid",captchaAPIRes.uuid)
    }
  }

  return (
    <div className={styles.loginPage}>
        {/* 存放背景 */}
        <canvas id='canvas' style={{display:"block"}}></canvas>
        {/* 登录盒子 */}
        <div className={styles.loginBox}>
            <div className='loginbox'>
                {/* 标题 */}
                <div className={styles.title}>
                    <h1>前端Eric&nbsp;·&nbsp;通用后台系统</h1>
                    <p>Strive Everyday</p>
                </div>
                {/* form */}
                <div className='form'>
                    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
                        <Input placeholder="用户名" onChange={usernameChange}/>
                        <Input.Password placeholder="密码" onChange={passwordChange}/>
                        <div className="captchaBox" onClick={getCaptcha}>
                            <Input placeholder="验证码" onChange={captchaChange}/>
                            <div className="captchaImg">
                                <img src={captchaImg} alt="code.png" height='38'/>
                            </div>
                        </div>
                        <Button type="primary" block className="loginBtn" onClick={goToLogin}>登录</Button>
                    </Space>
                </div>
            </div>
        </div>
    </div>
  )
}
```

# 登录业务完成
定义登录接口的请求和响应类型
src/types/api.d.ts:
```ts
// 登录的请求类型
interface LoginAPIReq {
  username: string;
  password: string;
  code: string;
  uuid: string;
}

// 登录的响应类型
interface LoginAPIRes {
  msg: string;
  code: number;
  token: string;
}
```

定义登录请求api 
src/api/request.ts
```ts
// 登录请求
export const LoginAPI = (params:LoginAPIReq):Promise<LoginAPIRes> => request.post("/prod-api/login",params);
```

Login/index.tsx
```tsx
import {useNavigate} from "react-router-dom"

let navigateTo = useNavigate();

// 点击登录按钮回调
const goToLogin = async () => {
  // 验证是否有空值
  if(!usernameVal.trim() || !passwordVal.trim() || !captchaVal.trim()){
    message.warning("请输入完整信息！")
    return
  }
  // 发起登录请求
  let LoginAPIRes = await LoginAPI({
    username: usernameVal,
    password: passwordVal,
    code: captchaVal,
    uuid: localStorage.getItem("uuid")
  })
  // console.log(LoginAPIRes);  // 登录测试账号 qdtest1 密码：123456
  if(LoginAPIRes.code === 200){
    // 提示登录成功
    message.success("登录成功")
    // 保存token
    localStorage.setItem("admin_token",LoginAPIRes.token)
    // 跳转到首页(/page1)
    navigateTo("/page1")
    // 删除本地uuid
    localStorage.removeItem("uuid")
  }
}

```