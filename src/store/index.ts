import {legacy_createStore,combineReducers,applyMiddleware,compose } from "redux"
import reduxThunk from 'redux-thunk' //rt
import handleNum from "./NumStatus/reducer.ts"
import handleNum1 from "./NumStatus1/reducer.ts"

// 组合各个模块的reducer
const reducers = combineReducers({
    handleNum,
    handleNum1
})

// 创建仓库对象，注册reducers
// const store = legacy_createStore(reducers,
// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// 判断有没有__REDUX_DEVTOOLS_EXTENSION_COMPOSE__这个模块
let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}):compose //rt
// 把仓库数据，浏览器redux-dev-tools，还有reduxThunk插件关联在store中
const store =
legacy_createStore(reducers,composeEnhancers(applyMiddleware(reduxThunk))); //rt

export default store;