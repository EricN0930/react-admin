import React,{useEffect} from 'react';
import { Input,Space,Button  } from 'antd';
import styles from './login.module.scss'
import initLoginBg from './init.ts'
import "./login.less"

const login = () => {
    // 加载完这个组件之后,加载背景
    useEffect(() => {
        initLoginBg();
        window.onresize = function(){ initLoginBg() }
    })

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
                            <Input placeholder="用户名" />
                            <Input.Password placeholder="密码" />
                            <div className="captchaBox">
                                <Input placeholder="验证码" />
                                <div className="captchaImg">
                                    <img src="" alt="code.png" height='38'/>
                                </div>
                            </div>
                            <Button type="primary" block className="loginBtn">登录</Button>
                        </Space>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default login