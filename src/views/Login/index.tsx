import React,{ChangeEvent,useEffect,useState} from 'react';
import {useNavigate} from "react-router-dom"
import { Input,Space,Button,message  } from 'antd';
import styles from './login.module.scss'
import initLoginBg from './init.ts'
import "./login.less"
import { CaptchaAPI, LoginAPI} from "@/api/request"

const login = () => {
    let navigateTo = useNavigate();
    // 加载完这个组件之后,加载背景
    useEffect(() => {
        initLoginBg();
        window.onresize = function(){ initLoginBg() }
        console.log('123123');
        
        // 获取验证码
        getCaptcha()
    },[])

    // 获取用户输入的信息
    const [usernameVal,setUsernameVal] = useState(""); // 定义用户输入用户名 变量
    const [passwordVal,setPasswordVal] = useState(""); // 定义用户输入密码 变量
    const [captchaVal,setCaptchaVal] = useState(""); // 定义用户输入验证码 变量

    // 验证码图片信息
    const [captchaImg,setCaptchaImg] = useState(""); 


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

export default login