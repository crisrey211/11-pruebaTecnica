import React, { useState } from 'react'
import './App.css'
import { type User } from './components/types'
import { UsersList } from './components/UsersList'

function App() {
  const [users, setUsers] = React.useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sortByCountry, setSortByCountry] = useState(false)
  const originalUsers = React.useRef<User[]>([])
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

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
      setLoading(true)
      setError(false)
      try {
        const response = await fetch(
          `https://randomuser.me/api?results=10&seed=midudev&page=${currentPage}`
          /* `https://randomuser.me/api?results=10` */
        )
        if (!response.ok) {
          throw Error('Erroe en el fetching')
        }
        const data = await response.json()
        setUsers((prevUsers) => {
          const newUsers = prevUsers.concat(data.results)
          originalUsers.current = newUsers
          return newUsers
        })
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchtingData()
  }, [currentPage])

  const filteredUsers = React.useMemo(() => {
    console.log('calculate filteresd Users')
    return filterCountry !== null && filterCountry.length > 0
      ? users.filter((user) => {
          return user.location.country
            .toLocaleLowerCase()
            .includes(filterCountry.toLocaleLowerCase())
        })
      : users
  }, [users, filterCountry])

  const sortedUsers = React.useMemo(() => {
    console.log('calculate sorted Users')
    return sortByCountry
      ? [...filteredUsers].sort((a, b) => {
          return a.location.country.localeCompare(b.location.country)
        })
      : filteredUsers
  }, [filteredUsers, sortByCountry])

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
        {users.length > 0 && (
          <UsersList
            users={sortedUsers}
            showColors={showColors}
            deleteUser={handleDelete}
          />
        )}

        {loading && <p>Cargando ...</p>}

        {!loading && error && <p>Ha habido un error</p>}

        {!loading && !error && users.length === 0 && <p>No hay usuarios</p>}

        {!loading && !error && (
          <button onClick={() => setCurrentPage(currentPage + 1)}>
            Cargar más resultados
          </button>
        )}
      </main>
    </div>
  )
}

export default App
