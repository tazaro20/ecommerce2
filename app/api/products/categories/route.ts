import mongodb from '@/lib/mongodb'
import ProductModel from '@/lib/models/ProductModel'

export const GET = async () => {
  await mongodb()
  const categories = await ProductModel.find().distinct('category')
  return Response.json(categories)
}