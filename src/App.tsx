import React, { useRef, useState } from 'react'
import './App.css'
import { UsersList } from './components/UsersList'
import { type User } from './components/types'

function App() {
  const [users, setUsers] = React.useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sortByCountry, setSortByCountry] = useState(false)
  const originalUsers = React.useRef<User[]>([])
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const toogleColors = () => {
    setShowColors(!showColors)
  }

  const toogleSortByCountry = () => {
    setSortByCountry((prevState) => !prevState)
  }

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => {
      return user.email !== email
    })
    setUsers(filteredUsers)
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
        originalUsers.current = data.results
      } catch (error) {
        console.error('Ha habido un fallo')
      }
    }
    fetchtingData()
  }, [])

  const filteredUsers =
    filterCountry !== null && filterCountry.length > 0
      ? users.filter((user) => {
          return user.location.country
            .toLocaleLowerCase()
            .includes(filterCountry.toLocaleLowerCase())
        })
      : users

  const sortedUsers = sortByCountry
    ? [...filteredUsers].sort((a, b) => {
        return a.location.country.localeCompare(b.location.country)
      })
    : filteredUsers
  const handleReset = () => {
    setUsers(originalUsers.current)
  }
  return (
    <div className="App">
      <h1>Prueba técnica</h1>
      <header>
        <button onClick={toogleColors}>Colorear filas</button>
        <button onClick={toogleSortByCountry}>
          {sortByCountry ? 'No ordenar por país' : 'Ordenar por país'}
        </button>
        <button onClick={handleReset}>Resetear estado</button>
      </header>
      <input
        placeholder="Filtrar por país"
        onChange={(ev) => setFilterCountry(ev.target.value)}
      />
      <main>
        <UsersList
          users={sortedUsers}
          showColors={showColors}
          deleteUser={handleDelete}
        />
      </main>
    </div>
  )
}

export default App
