// import React from "react"
// import { useSelector , useDispatch } from "react-redux"
// import XxxStatus from '@/store/XxxStatus/index.ts'

// // 通过useDispatch修改仓库数据
// const dispatch = useDispatch() 
    
// // 通过useSelector获取仓库数据
// const {param1,param2} = useSelector((state:RootState) => (
//     {
//         param1: state.XxxStatus.param1,
//         param2: state.Xxx2Status.param2,
//     }
// ))

// const changeNum = () => { // 同步
//     dispatch({type:"Xxx",value:10})
// }
// const changeNumAsync = () => {  // 异步
//     dispatch(XxxStatus.asyncActions.xxxFn)
// }