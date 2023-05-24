import * as React from 'react'
import ReactDOM from 'react-dom/client'

// 样式初始化一般放在最前面
import "reset-css"
// 全局样式
import "@/asset/styles/global.scss"

import App from './App.tsx'
import { BrowserRouter } from "react-router-dom"

// 状态管理
import {Provider} from "react-redux"
import store from '@/store/index.ts'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
