import { cache } from 'react'
import mongodb from '../mongodb'
import ProductModel, { Product } from '../models/ProductModel'

export const revalidate = 3600

const getLatest = cache(async () => {
  await mongodb()
  const products = await ProductModel.find({})
    .sort({ _id: -1 })
    .limit(4)
    .lean<Product[]>()
  return products as Product[]
})

const getFeatured = cache(async () => {
  await mongodb()
  const products = await ProductModel.find({ isFeatured: true })
  return products
})

const getBySlug = cache(async (slug: string) => {
  await mongodb()
  const product = await ProductModel.findOne({ slug }).lean<Product>()
  return product
})

const ProductService = {
  getLatest,
  getFeatured,
  getBySlug,
}

export default ProductService
