'use client'
import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ValidationRule, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { User } from '@/lib/models/UserModel'
import { formatId } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function UserEditForm({ userId }: { userId: string }) {
  const router = useRouter()
  const { data: user, error } = useSWR(`/api/admin/users/${userId}`)
 
  console.log('User data:', user)
  console.log('Error:', error)

  const { trigger: updateUser, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/users/${userId}`,
    async (url, { arg }: { arg: User }) => {
      const res = await fetch(`${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      return data
    }
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<User>()

  useEffect(() => {
    if (user) {
      setValue('name', user.name)
      setValue('email', user.email)
      setValue('isAdmin', user.isAdmin)
    }
  }, [user, setValue])

  const formSubmit = async (formData: User) => {
    try {
      await updateUser(formData)
      toast.success('User updated successfully')
      router.push('/admin/users')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (error) {
    console.log('Rendering error state')
    return <div>Error: {error.message}</div>
  }
  if (!user) {
    console.log('Rendering loading state')
    return <div>Loading...</div>
  }

  console.log('Rendering form')
  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof User
    name: string
    required?: boolean
    pattern?: ValidationRule<RegExp>
  }) => (
    <div className="md:flex my-3">
      <label className="label md:w-1/5" htmlFor={id}>
        {name}
      </label>
      <div className="md:w-4/5">
        <input
          type="text"
          id={id}
          {...register(id, {
            required: required && `${name} is required`,
            pattern,
          })}
          className="input input-bordered w-full max-w-md"
        />
        {errors[id]?.message && (
          <div className="text-error">{errors[id]?.message}</div>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl py-4">Edit User {formatId(userId)}</h1>
      <form onSubmit={handleSubmit(formSubmit)}>
        <FormInput name="Name" id="name" required />
        <FormInput name="Email" id="email" required />

        <div className="md:flex my-3">
          <label className="label md:w-1/5" htmlFor="isAdmin">
            Admin
          </label>
          <div className="md:w-4/5">
            <input
              id="isAdmin"
              type="checkbox"
              className="toggle"
              {...register('isAdmin')}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="btn btn-primary"
        >
          {isUpdating && <span className="loading loading-spinner"></span>}
          Update
        </button>
        <Link className="btn ml-4" href="/admin/users">
          Cancel
        </Link>
      </form>
    </div>
  )
}