import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Comp from '@/components/Comp/index'
import Comp1 from '@/components/Comp1/index'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Comp></Comp>
      <Comp1></Comp1>
    </>
  )
}

export default App
