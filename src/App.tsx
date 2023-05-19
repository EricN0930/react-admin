import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import * as React from "react"

import { useRoutes,Link } from "react-router-dom"
import router from "./router/index"

function App() {
  const [count, setCount] = useState(0)
  const outlet = useRoutes(router)
  return (
    <>
      {/* <Link to="/home">Home</Link> |
      <Link to="/about">About</Link>  */}

      { outlet }
    </>
  )
}

export default App
