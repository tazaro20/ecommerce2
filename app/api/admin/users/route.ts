/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/lib/auth'
import mongodb from '@/lib/mongodb'
import UserModel from '@/lib/models/UserModel'

// GET all users
export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await mongodb()
  const users = await UserModel.find().select('-password')
  return Response.json(users)
})

// POST new user
export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await mongodb()
  const { name, email, password, isAdmin } = await req.json()
  const newUser = new UserModel({ name, email, password, isAdmin })
  await newUser.save()
  return Response.json({ message: 'User created successfully', user: newUser })
})