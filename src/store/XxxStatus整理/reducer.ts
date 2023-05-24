import XxxStatus from "./index.ts"

const defaultState = {
    ...XxxStatus.state
}

let reducer = (state = defaultState, action:{type:string, value:number}) => {
    let newState = JSON.parse(JSON.stringify(state))

    for(let key in XxxStatus.actionNames){
        if(action.type === XxxStatus.actionNames[key]){
            XxxStatus.actions[XxxStatus.actionNames[key]](newState,action)
        }
    }
    return newState
}

export default reducer