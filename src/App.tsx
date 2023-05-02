import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { SortBy, type User } from './types.d'
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
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
  const originalUsers = useRef<User[]>([])
  const [filterByCountry, setFilterByCountry] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true)
      setError(null)
      try {
        const resp = await fetch(`https://randomuser.me/api?page=${currentPage}&results=10&seed=santi`)
        const data = await resp.json()
        setUsers((prevUsers) => {
          const newUsers = prevUsers.concat(data.results)
          originalUsers.current = newUsers
          return newUsers
        })
      } catch (err) {
        setError(err)
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    getUsers().then().catch(e => { console.log(e) })
  }, [currentPage])

  const toggleColors = () => {
    setShowColors(!showColors)
  }

  const handleSortByCountry = () => {
    const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
    setSorting(newSortingValue)
  }

  const handleReset = () => {
    setUsers(originalUsers.current)
  }

  const handleSetSorting = (sortType: SortBy) => {
    setSorting(sortType)
  }

  const filteredUsers = useMemo(() => {
    return typeof filterByCountry === 'string' && filterByCountry.length > 0
      ? users.filter(user => {
        return user.location.country.toLocaleLowerCase().includes(filterByCountry.toLocaleLowerCase())
      })
      : users
  }, [users, filterByCountry])

  const handleDelete = (uuid: string) => {
    const filteredUsers = users.filter((user) => {
      return uuid !== user.login.uuid
    })
    setUsers(filteredUsers)
  }

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) {
      return [...filteredUsers]
    }
    if (sorting === SortBy.COUNTRY) {
      return [...filteredUsers].sort((a, b) => {
        return a.location.country.localeCompare(b.location.country)
      })
    }
    if (sorting === SortBy.NAME) {
      return [...filteredUsers].sort((a, b) => {
        return a.name.first.localeCompare(b.name.first)
      })
    }
    if (sorting === SortBy.LAST) {
      return [...filteredUsers].sort((a, b) => {
        return a.name.last.localeCompare(b.name.last)
      })
    }
  }, [filteredUsers, sorting])

  return (
    <>
      <h1>Prueba técnica</h1>
      <header>
        <button onClick={toggleColors}>
          Colorear filas
        </button>
        <button onClick={handleSortByCountry}>
          {sorting === SortBy.COUNTRY ? 'No ordenar por país' : 'Ordenar por país'}
        </button>
        <button onClick={handleReset}>
          Reset
        </button>
        <input
          placeholder='Filtra por país'
          type="text"
          onChange={(e) => {
            setFilterByCountry(e.target.value)
          }}
        />
      </header>
      <main>
      {
          users.length > 0 &&
          <UsersList
            handleChangeSort={handleSetSorting}
            handleDelete={handleDelete}
            showColors={showColors}
            users={sortedUsers}
          />
        }
        {loading && <p>Cargando...</p>}
        {!loading && error && <p>Ha habido un error</p>}
        {!loading && !error && users.length === 0 && <p>No hay resultados</p>}
        {
          !loading && !error &&
          <button onClick={() => { setCurrentPage(currentPage + 1) }}>
            Cargar mas
          </button>
        }
      </main>
    </>
  )
}

export default App
