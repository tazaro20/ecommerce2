import AdminLayout from '@/components/admin/AdminLayout'
import Users from './Users'

const AdminUsersPage = () => {
  return (
    <AdminLayout activeItem="users">
      <Users />
    </AdminLayout>
  )
}

export default AdminUsersPage