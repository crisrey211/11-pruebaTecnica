import React, { useState } from 'react'
import './App.css'
import { type User } from './components/types'
import { UsersList } from './components/UsersList'
import { useQuery } from '@tanstack/react-query'

const fetchtingData = async (page: number) => {
  const response = await fetch(
    `https://randomuser.me/api?results=10&seed=midudev&page=${page}`
  )
  if (!response.ok) {
    throw Error('Erroe en el fetching')
  }
  const result = await response.json()
  return result.results
}
function App() {
  const {
    isLoading,
    isError,
    data: users = [],
  } = useQuery<User[]>(['users'], async () => await fetchtingData(1))

  console.log(fetchtingData(1))
  /* const [users, setUsers] = React.useState<User[]>([]) */
  const [showColors, setShowColors] = useState(false)
  const [sortByCountry, setSortByCountry] = useState(false)
  //const originalUsers = React.useRef<User[]>([])
  const [filterCountry, setFilterCountry] = useState<string | null>(null)

  /*   const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false) */
  const [currentPage, setCurrentPage] = useState(1)

  const toogleColors = () => {
    setShowColors(!showColors)
  }

  const toogleSortByCountry = () => {
    setSortByCountry((prevState) => !prevState)
  }

  const handleDelete = (email: string) => {
    /* const filteredUsers = users.filter((user) => {
      return user.email !== email
    })
    setUsers(filteredUsers) */
  }

  const filteredUsers = React.useMemo(() => {
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
    // setUsers(originalUsers.current)
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

        {isLoading && <p>Cargando ...</p>}

        {!isLoading && isError && <p>Ha habido un error</p>}

        {!isLoading && !isError && users.length === 0 && <p>No hay usuarios</p>}

        {!isLoading && !isError && (
          <button onClick={() => setCurrentPage(currentPage + 1)}>
            Cargar más resultados
          </button>
        )}
      </main>
    </div>
  )
}

export default App
