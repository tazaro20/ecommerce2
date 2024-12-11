import { auth } from '@/lib/auth'
import mongodb from '@/lib/mongodb'
import UserModel from '@/lib/models/UserModel'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GET = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await mongodb()
  const users = await UserModel.find()
  return Response.json(users)
})