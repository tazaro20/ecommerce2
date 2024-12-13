/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/lib/auth'
import mongodb from '@/lib/mongodb'
import UserModel from '@/lib/models/UserModel'

// GET single user
export const GET = auth(async (...args: any) => {
  const [req, { params }] = args
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
    if (!req.auth || !req.auth.user?.isAdmin) {
      return Response.json(
        { message: 'unauthorized' },
        {
          status: 401,
        }
      )
    }
    await mongodb()
    const user = await UserModel.findById(params.id).select('-password')
    if (!user) {
      return Response.json(
        { message: 'User not found' },
        {
          status: 404,
        }
      )
    }
    return Response.json(user)
  }
)

// PUT update user
export const PUT = auth(async (...args: any) => {
  const [req, { params }] = args
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
    await mongodb()
    const { name, email, isAdmin } = await req.json()
    const user = await UserModel.findById(params.id)
    if (!user) {
      return Response.json(
        { message: 'User not found' },
        {
          status: 404,
        }
      )
    }
    user.name = name
    user.email = email
    user.isAdmin = isAdmin
    await user.save()
    return Response.json({ message: 'User updated successfully', user })
  }
)

// DELETE user
export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
    await mongodb()
    const user = await UserModel.findByIdAndDelete(params.id)
    if (!user) {
      return Response.json(
        { message: 'User not found' },
        {
          status: 404,
        }
      )
    }
    return Response.json({ message: 'User deleted successfully' })
  }
)
