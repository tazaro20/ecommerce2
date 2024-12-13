/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import Link from 'next/link'

export default function Users() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter()
  const { data: users, error, mutate } = useSWR('/api/admin/users')

  if (error) return <div>Failed to load</div>
  if (!users) return <div>Loading...</div>

  const deleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        mutate()
      } else {
        alert('Failed to delete user')
      }
    }
  }

  return (
    <div>
       <div className="flex justify-between items-center mt-4">
      <h1 className="text-2xl mb-4">Users</h1>
      <Link href="/admin/users/create" className="btn btn-primary ml-auto mt-4">
        Create User
      </Link>
      </div>
      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? 'Yes' : 'No'}</td>
              <td>
                <Link
                  href={`/admin/users/${user._id}`}
                  className="btn btn-xs mr-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="btn btn-xs btn-error"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
     
    </div>
  )
}
