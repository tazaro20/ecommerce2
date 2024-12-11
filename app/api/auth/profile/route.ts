import { auth } from '@/lib/auth'
import mongodb from '@/lib/mongodb'
import UserModel from '@/lib/models/UserModel'
import bcrypt from 'bcryptjs'

export const PUT = auth(async (req) => {
  if (!req.auth) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 })
  }
  const { user } = req.auth
  const { name, email, password } = await req.json()
  await mongodb()
  try {
    const dbUser = await UserModel.findById(user)
    if (!dbUser) {
      return Response.json(
        { message: 'User not found' },

        {
          status: 404,
        }
      )
    }
    dbUser.name = name
    dbUser.email = email
    dbUser.password = password
      ? await bcrypt.hash(password, 5)
      : dbUser.password
    await dbUser.save()
    return Response.json({ message: 'User has been updated' })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    return Response.json(
      { message: error.message },
      {
        status: 500,
      }
    )
  }
})
