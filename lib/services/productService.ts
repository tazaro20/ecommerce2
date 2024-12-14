import { cache } from 'react'
import mongodb from '../mongodb'
import ProductModel, { Product } from '../models/ProductModel'

export const revalidate = 3600

const PAGE_SIZE = 3
const getByQuery = cache(
  async ({
    q,
    category,
    sort,
    price,
    rating,
    page = '1',
  }: {
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
  }) => {
    await mongodb()

    const queryFilter =
      q && q !== 'all'
        ? {
            name: {
              $regex: q,
              $options: 'i',
            },
          }
        : {}
    const categoryFilter = category && category !== 'all' ? { category } : {}
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {}
    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {}
    const order: Record<string, 1 | -1> =
      sort === 'lowest'
        ? { price: 1 }
        : sort === 'highest'
        ? { price: -1 }
        : sort === 'toprated'
        ? { rating: -1 }
        : { _id: -1 }

    const categories = await ProductModel.find().distinct('category')
    const products = await ProductModel.find(
      {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      },
      '-reviews'
    )
      .sort(order)
      .skip(PAGE_SIZE * (Number(page) - 1))
      .limit(PAGE_SIZE)
      .lean()

    const countProducts = await ProductModel.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })

    return {
      products: products as unknown as Product[],
      countProducts,
      page,
      pages: Math.ceil(countProducts / PAGE_SIZE),
      categories,
    }
  }
)

const getLatest = cache(async () => {
  await mongodb()
  const products = await ProductModel.find({})
    .sort({ _id: -1 })
    .limit(8)
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

const getCategories = cache(async () => {
  await mongodb()
  const categories = await ProductModel.find().distinct('category')
  return categories
})

const ProductService = {
  getLatest,
  getFeatured,
  getBySlug,
  getByQuery,
  getCategories,
}

export default ProductService
