import { auth } from "@/lib/auth"
import OrderModel from "@/lib/models/OrderModel"
import mongodb from "@/lib/mongodb"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GET = auth(async (...request: any) => {
  const [req, { params }] = request
  if (!req.auth) {
    return Response.json({ message: 'unauthorized' }, { status: 401 })
  }
  await mongodb()
  const order = await OrderModel.findById(params.id)
  return Response.json(order)
})
