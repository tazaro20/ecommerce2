'use client'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm, SubmitHandler } from 'react-hook-form'

type Inputs = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const Form = () => {
  const { data: session, update } = useSession()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (session && session.user) {
      setValue('name', session.user.name!)
      setValue('email', session.user.email!)
    }
  }, [router, session, setValue])

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { name, email, password } = form

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })
      if (res.status === 200) {
        toast.success('Profile updated successfully')
        const newSession = {
          ...session,
          user: {
            ...session?.user,
            name,
            email,
          },
        }
        await update(newSession)
        router.push('/')
      } else {
        const data = await res.json()
        toast.error(data.message || 'error')
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const error =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : err.message
      toast.error(error)
    }
  }
  return (
    <div className="max-w-lg mx-auto my-10 card bg-base-100 shadow-md border border-gray-200">
      <div className="card-body p-6">
        <h1 className="card-title text-xl font-semibold text-gray-800">
          Update Profile
        </h1>
        <form onSubmit={handleSubmit(formSubmit)} className="space-y-4">
          <div>
            <label className="label font-medium text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name', {
                required: 'Name is required',
              })}
              className="input input-bordered w-full focus:outline-none focus:ring focus:ring-primary-300"
            />
            {errors.name?.message && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="label font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                  message: 'Enter a valid email address',
                },
              })}
              className="input input-bordered w-full focus:outline-none focus:ring focus:ring-primary-300"
            />
            {errors.email?.message && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              className="label font-medium text-gray-700"
              htmlFor="password"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password')}
              className="input input-bordered w-full focus:outline-none focus:ring focus:ring-primary-300"
            />
            {errors.password?.message && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label
              className="label font-medium text-gray-700"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                validate: (value) => {
                  const { password } = getValues()
                  return password === value || 'Passwords must match'
                },
              })}
              className="input input-bordered w-full focus:outline-none focus:ring focus:ring-primary-300"
            />
            {errors.confirmPassword?.message && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full py-2 text-lg font-semibold"
          >
            {isSubmitting && (
              <span className="loading loading-spinner mr-2"></span>
            )}
            Update Profile
          </button>
        </form>
      </div>
    </div>
  )
}

export default Form
