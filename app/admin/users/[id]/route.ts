/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/lib/auth'
import mongodb from '@/lib/mongodb'
import UserModel from '@/lib/models/UserModel'

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
  await mongodb()
  const user = await UserModel.findById(params.id)
  if (!user) {
    return Response.json(
      { message: 'user not found' },
      {
        status: 404,
      }
    )
  }
  return Response.json(user)
})

export const PUT = auth(async (...p: any) => {
  const [req, { params }] = p
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  const { name, email, isAdmin } = await req.json()

  try {
    await mongodb()

    const user = await UserModel.findById(params.id)
    if (user) {
      user.name = name
      user.email = email
      user.isAdmin = Boolean(isAdmin)

      const updatedUser = await user.save()
      return Response.json({
        message: 'User updated successfully',
        user: updatedUser,
      })
    } else {
      return Response.json(
        { message: 'User not found' },
        {
          status: 404,
        }
      )
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
})