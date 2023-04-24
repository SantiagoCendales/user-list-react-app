import { useEffect, useRef, useState } from 'react'
import './App.css'
import { type User } from './types'
import { UsersList } from './components/UsersList'

// const sortedUsers = sortByCountry
//   ? users.sort((a, b) => { // El código se rompe porque sort muta el array original, por tanto users ya esta ordenado y ya no puedo mostrar el order original
//       return a.location.country.localeCompare(b.location.country)
//     })
//   : users

// const sortedUsers = sortByCountry
//   ? users.toSorted((a, b) => {
//     return a.location.country.localeCompare(b.location.country)
//   })
//   : users

function App () {
  const [users, setUsers] = useState<User[]>([])
  const [showColors, setShowColors] = useState(false)
  const [sortByCountry, setSortByCountry] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const originalUsers = useRef<User[]>([])

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const handleSortByCountry = () => {
    setSortByCountry(prevState => !prevState)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const sortedUsers = sortByCountry
    ? [...users].sort((a, b) => {
        return a.location.country.localeCompare(b.location.country)
      })
    : users

  const handleDelete = (uuid: string) => {
    const filteredUsers = users.filter((user) => {
      return uuid !== user.login.uuid
    })
    setUsers(filteredUsers)
  }

  useEffect(() => {
    const getUsers = async () => {
      try {
        const resp = await fetch('https://randomuser.me/api?results=100')
        const data = await resp.json()
        setUsers(data.results)
        originalUsers.current = data.results
      } catch (err) {
        console.log(err)
      }
    }

    getUsers().then().catch(e => { console.log(e) })
  }, [])

  return (
    <>
      <h1>Prueba técnica</h1>
      <header>
        <button onClick={toggleColors}>
          Colorear filas
        </button>
        <button onClick={handleSortByCountry}>
          {sortByCountry ? 'No ordenar por país' : 'Ordenar por país'}
        </button>
        <button onClick={handleReset}>
          Reset
        </button>
      </header>
      <main>
        <UsersList handleDelete={handleDelete} showColors={showColors} users={sortedUsers}></UsersList>
      </main>
    </>
  )
}

export default App
