
import { type User } from '../types'

interface Props {
  users: User[]
  showColors: boolean
  handleDelete: (uuid: string) => void
}
export const UsersList = ({ users, showColors, handleDelete }: Props) => {
  return (
    <table width='100%'>
      <thead>
        <tr>
          <th>Foto</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>País</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {
          users.map((user, index) => {
            const backgroundColor = index % 2 === 0 ? '#3333' : '#5555'
            const color = showColors ? backgroundColor : 'transparent'
            return (
              <tr key={user.login.uuid} style={{ backgroundColor: color }}>
                <td>
                  <img src={user.picture.thumbnail} alt="User profile pic" />
                </td>
                <td>
                  {user.name.first}
                </td>
                <td>
                  {user.name.last}
                </td>
                <td>
                  {user.location.country}
                </td>
                <td>
                  <button
                    onClick={() => { handleDelete(user.login.uuid) }}
                  >
                    Borrar
                  </button>
                </td>
              </tr>)
          })
        }
      </tbody>
    </table>
  )
}
