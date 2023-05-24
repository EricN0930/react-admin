export default {
    state: {
        num:100
    },
    actions: {
        add(newState:{num:number},action:{type:string,value:number}){
            newState.num += action.value;
        }
    },
    // 名字统一管理
    add: "add"
}