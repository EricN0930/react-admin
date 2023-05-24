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

let actionNames = {}
for(let key in store.actions){
    actionNames[key] = key
}
store.actionNames = actionNames
export default store
