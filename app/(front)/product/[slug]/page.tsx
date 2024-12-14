import AddToCart from '@/components/products/AddToCard'
import { convertDocToObj } from '@/lib/utils'
import productService from '@/lib/services/productService'
import Image from 'next/image'
import Link from 'next/link'
import { Rating } from '@/components/products/Rating'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const slug = params.slug
  const product = await productService.getBySlug(slug)
  if (!product) {
    return { title: 'Product not found' }
  }
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetails({
  params,
}: {
  params: { slug: string }
}) {
  const slug = params.slug
  const product = await productService.getBySlug(slug)
  if (!product) {
    return (
      <div className="text-center text-gray-500 mt-20">Product not found</div>
    )
  }
  return (
    <>
      <div className="my-4">
        <Link href="/" className="text-blue-500 hover:underline">
          back to products
        </Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-6">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            sizes="100vw"
            className="rounded-lg shadow-lg"
            style={{
              width: '100%',
              height: 'auto',
            }}
          ></Image>
        </div>
        <div>
          <ul className="space-y-6">
            <li>
              <h1 className="text-2xl font-bold text-gray-600">{product.name}
              </h1>
            </li>
            <li>
              <Rating
                value={product.rating}
                caption={`${product.numReviews} ratings`}
              />
            </li>
            <li className="text-gray-600 font-medium">
              Brand: {product.brand}
            </li>
            <li>
              <div className="border-t border-gray-300 my-4"></div>
            </li>
            <li className="text-gray-600">
              <span className="font-semibold">Description:</span>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </li>
          </ul>
        </div>
        <div>
          <div className="card bg-gray-100 shadow-lg rounded-lg p-6">
            <div className="mb-4 flex justify-between">
              <span className="font-semibold text-gray-600">Price:</span>
              <span className="text-gray-800">${product.price}</span>
            </div>
            <div className="mb-4 flex justify-between">
              <span className="font-semibold text-gray-600">Status:</span>
              <span
                className={
                  product.countInStock > 0 ? 'text-green-600' : 'text-red-600'
                }
              >
                {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
              </span>
            </div>
            {product.countInStock !== 0 && (
              <div className="mt-6">
                <AddToCart
                  item={{
                    ...convertDocToObj(product),
                    qty: 0,
                    color: '',
                    size: '',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
