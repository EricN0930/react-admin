import React from "react"
import { useSelector , useDispatch } from "react-redux"
// import store from "@/store/index.ts"
import numStatus from '@/store/NumStatus/index.ts'
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
    const changeNum1 = () => {
        dispatch({type:"add",value:100})
    }
    return (
        <>
        <div className='page1'>
            <p>This is the content of Page1</p>
            <p>{num}</p>
            <button onClick={changeNum}>Num按钮，每次加10</button>
            <button onClick={changeNumAsync}>异步按钮</button>
            <p>{num1}</p>
            <button onClick={changeNum1}>Num1按钮，每次加100</button>
        </div>
        </>
    )
}

export default Page1