import React , { lazy } from 'react'
// import Home from '../views/Home'
import Login from '../views/Login/index'
const Home = lazy(()=>import("../views/Home"))
const Page1 = lazy(()=>import("../views/Page1"))
const Page2 = lazy(()=>import("../views/Page2"))
const Page301 = lazy(()=>import("../views/Page301"))
const Page302 = lazy(()=>import("../views/Page302"))
const Page303 = lazy(()=>import("../views/Page303"))

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
    {
        path: "/login",
        element: <Login />
    },
    // 当用户输入的url地址并不能匹配时，重定向到首页
    {
        path: "*",
        element: <Navigate to="/page1"/>
    }
]

export default routes