import React, { useState } from 'react'
import './App.css'
import { UsersList } from './components/UsersList'

function App() {
  const [users, setUsers] = React.useState([])
  const [showColors, setShowColors] = useState(false)

  const toogleColors = () => {
    setShowColors(!showColors)
  }

  React.useEffect(() => {
    const fetchtingData = async () => {
      try {
        const response = await fetch('https://randomuser.me/api?results=100')
        if (!response.ok) {
          throw Error('Erroe en el fetching')
        }
        const data = await response.json()
        setUsers(data.results)
      } catch (error) {
        console.error('Ha habido un fallo')
      }
    }
    fetchtingData()
  }, [])

  return (
    <div className="App">
      <h1>Prueba técnica</h1>
      <header>
        <button onClick={toogleColors}>Colorear filas</button>
      </header>
      <main>
        <UsersList users={users} showColors={showColors} />
      </main>
    </div>
  )
}

export default App
