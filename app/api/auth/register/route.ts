import mongodb from '@/lib/mongodb'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import UserModel from '@/lib/models/UserModel'

export const POST = async (request: NextRequest) => {
  const { name, email, password } = await request.json()
  await mongodb()

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
    isAdmin: false,
  })

  try {
    await newUser.save()
    return Response.json(
      { status: 201, body: 'User created successfully' },
      {
        status: 201,
      }
    )
  } catch (error) {
    if (error instanceof Error) {
      return Response.json(
        { message: error.message },
        {
          status: 500,
        }
      )
    }
    return Response.json(
      { message: 'An unknown error occurred' },
      {
        status: 500,
      }
    )
  }
}
