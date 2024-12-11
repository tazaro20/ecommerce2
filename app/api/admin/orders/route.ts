import mongodb from '@/lib/mongodb'
import { auth } from '@/lib/auth'
import OrderModel from '@/lib/models/OrderModel'

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
  const orders = await OrderModel.find()
    .sort({ createdAt: -1 })
    .populate('user', 'name')

  return Response.json(orders)
})