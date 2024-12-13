import AdminLayout from '@/components/admin/AdminLayout'
import UserEditForm from './Form'

export default function EditUserPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout activeItem="users">
      <UserEditForm userId={params.id} />
    </AdminLayout>
  )
}