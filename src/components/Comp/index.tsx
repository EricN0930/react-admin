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