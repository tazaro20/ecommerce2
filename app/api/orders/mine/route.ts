import { auth } from "@/lib/auth"
import OrderModel from "@/lib/models/OrderModel"
import mongodb from "@/lib/mongodb"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GET = auth(async (req: any) => {
    if(!req.auth){
        return Response.json(
            { message: 'unauthorized' },
            {
                status: 401,
            }
        )
    }
    const { user } = req.auth
    await mongodb()
    const orders = await OrderModel.find({ user: user._id })
    return Response.json(orders)
})