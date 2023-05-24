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