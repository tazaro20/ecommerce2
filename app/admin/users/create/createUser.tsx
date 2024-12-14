'use client'

import bcrypt from 'bcryptjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import AdminLayout from '@/components/admin/AdminLayout'

const CreateUserPage = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const password = watch('password')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(data.password, 10)

      // Replace the plaintext password with the hashed password
      const payload = {
        ...data,
        password: hashedPassword,
      }

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push('/admin/users')
      } else {
        throw new Error('Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Failed to create user')
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <AdminLayout activeItem="users">
      <h1 className="text-2xl mb-4">Create New User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Name is required' })}
            className="input input-bordered w-full"
          />
          {errors.name && (
            <p className="text-red-500">{errors.name.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Invalid email address',
              },
            })}
            className="input input-bordered w-full"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register('password', {
              required: 'Password is required',
              minLength: 6,
            })}
            className="input input-bordered w-full"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'The passwords do not match',
            })}
            className="input input-bordered w-full"
          />
          {errors.confirmPassword && (
            <p className="text-red-500">
              {errors.confirmPassword.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('isAdmin')}
              className="checkbox mr-2"
            />
            <span>Is Admin</span>
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </AdminLayout>
  )
}

export default CreateUserPage
