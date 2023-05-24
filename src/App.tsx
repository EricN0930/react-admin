import { useEffect } from 'react'
import React from "react"
import {message} from "antd";
import { useRoutes,useLocation,useNavigate } from "react-router-dom"
import router from "./router/index"

// 去往登录页的组件
function ToLogin(){
  const navigateTo = useNavigate()
  // 加载完这个组件之后实现跳转
  useEffect(()=>{
  // 加载完组件之后执行这里的代码
  navigateTo("/login");
  message.warning("您还没有登录，请登录后再访问！");
  },[])
  return <div></div>
}

// 去往首页的组件
function ToPage(){
  const navigateTo = useNavigate()
  // 加载完这个组件之后实现跳转
  useEffect(()=>{
  // 加载完组件之后执行这里的代码
  navigateTo("/page1");
  message.warning("您已经登录过了！");
  },[])
  return <div></div>
}

// 手写封装路由前置守卫
function BeforeRouterEnter(){
  const outlet = useRoutes(router)
  const location = useLocation()
  /*
    后台管理系统两种经典的跳转情况：
    1、如果访问的是登录页面， 并且有token， 跳转到首页
    2、如果访问的不是登录页面，并且没有token， 跳转到登录页
    3、其余的都可以正常放行
  */
  let token = localStorage.getItem("admin_token");
  if( location.pathname === "/login" && token){
    // 不能直接用 useNavigate 来实现跳转 , 需要 BeforeRouterEnter 是一个正常的JSX组件
    return <ToPage />
  }

  if( location.pathname !== "/login" && !token){
    return <ToLogin />
  }

  return outlet
}

function App() {
  // const outlet = useRoutes(router)
  return (
    <>
      {/* <Link to="/home">Home</Link> |
      <Link to="/about">About</Link>  */}

      < BeforeRouterEnter />
      {/* { outlet } */}
    </>
  )
}

export default App
