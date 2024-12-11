import mongodb from '@/lib/mongodb'
import { auth } from '@/lib/auth'
import OrderModel from '@/lib/models/OrderModel'
import UserModel from '@/lib/models/UserModel'
import ProductModel from '@/lib/models/ProductModel'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GET = auth(async (...request: any) => {
  const [req] = request
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await mongodb()

  const ordersCount = await OrderModel.countDocuments()
  const productsCount = await ProductModel.countDocuments()
  const usersCount = await UserModel.countDocuments()

  const ordersPriceGroup = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ])
  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0

  const salesData = await OrderModel.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
  ])

  const productsData = await ProductModel.aggregate([
    {
      $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])

  const usersData = await UserModel.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalUsers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])

  return Response.json({
    ordersCount,
    productsCount,
    usersCount,
    ordersPrice,
    salesData,
    productsData,
    usersData,
  })
})