'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type Inputs = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const Form = () => {
  const { data: session } = useSession()

  const params = useSearchParams()
  const router = useRouter()
  const callbackUrl = params.get('callbackUrl') || '/'
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      email: '',
    },
  })

  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl)
    }
  }, [session, callbackUrl, params, router])

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { name, email, password } = form

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })
      if (res.ok) {
        return router.push(
          `/signin?callbackUrl=${callbackUrl}&success=Account created successfully`
        )
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const error =
        err.message && err.message.indexOf('E11000') === 0
          ? 'Email already exists'
          : err.message
      toast.error(err.message || 'error')
    }
  }

  return (
    <div className="max-w-lg mx-auto my-10 card bg-base-100 shadow-md border border-gray-200">
      <div className="card-body p-6">
        <h1 className="card-title text-xl font-semibold text-gray-800 text-center">Register</h1>
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
                  value: /^[\w-]+(\.[\w-]+)*@[\w-]+\.[a-zA-Z]{2,7}$/,
                  message: 'Enter a valid email address',
                },
              })}
              className="input input-bordered w-full focus:outline-none focus:ring focus:ring-primary-300"
            />
            {errors.email?.message && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="label font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              })}
              className="input input-bordered w-full focus:outline-none focus:ring focus:ring-primary-300"
            />
            {errors.password?.message && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="label font-medium text-gray-700" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: (value) => value === getValues('password'),
              })}
              className="input input-bordered w-full focus:outline-none focus:ring focus:ring-primary-300"
            />
            {errors.confirmPassword?.type === 'validate' && (
              <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full py-2 text-lg font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <span className="loading loading-spinner mr-2"></span>
            )}
            Register
          </button>
        </form>
        <div className="divider"></div>
        <div>
          Already have an account?{' '}
          <Link
            className="link text-primary hover:bg-blue-500"
            href={`/signin?callbackUrl=${callbackUrl}`}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Form
