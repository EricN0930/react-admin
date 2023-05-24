import handleNum1 from "./index.ts"

const defaultState = {
    ...handleNum1.state
}

let reducer = (state = defaultState, action:{type:string, value:number}) => {
    let newState = JSON.parse(JSON.stringify(state))

    switch(action.type){
        case handleNum1.add:
            handleNum1.actions.add(newState,action)
            break;
        default: 
            break;
    }

    return newState
}

export default reducer