/* eslint-disable @next/next/no-img-element */
import ProductItem from '@/components/products/ProductItem'
import productService from '@/lib/services/productService'
import { convertDocToObj } from '@/lib/utils'
import { Metadata } from 'next'
import Link from 'next/link'
import '../styles.css'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Next Amazona V2',
  description:
    process.env.NEXT_PUBLIC_APP_DESC ||
    'Nextjs, Server components, Next auth, daisyui, zustand',
}

export default async function Home() {
  const featuredProducts = await productService.getFeatured()
  const latestProducts = await productService.getLatest()
  return (
    <>
      <div className="w-full carousel rounded-xl mt-4 overflow-hidden relative shadow-xl">
        {featuredProducts.map((product, index) => (
          <div
            key={product._id}
            id={`slide-${index}`}
            className="carousel-item relative w-full transition-transform duration-500 ease-in-out"
          >
            <Link href={`/product/${product.slug}`} className="block h-full">
              <img
                src={product.banner}
                className="w-full h-full object-cover rounded-xl"
                alt={product.name}
              />
            </Link>

            {/* Navigation Buttons */}
            <div className="absolute flex justify-between items-center transform -translate-y-1/2 left-4 right-4 top-1/2 text-white text-2xl">
              <a
                href={`#slide-${
                  index === 0 ? featuredProducts.length - 1 : index - 1
                }`}
                className="btn btn-circle bg-black/50 hover:bg-black/70 transition-all duration-300 ease-in-out"
                aria-label="Previous slide"
              >
                ❮
              </a>
              <a
                href={`#slide-${
                  index === featuredProducts.length - 1 ? 0 : index + 1
                }`}
                className="btn btn-circle bg-black/50 hover:bg-black/70 transition-all duration-300 ease-in-out"
                aria-label="Next slide"
              >
                ❯
              </a>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mt-10 mb-6">
        Latest Products
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {latestProducts.map((product) => (
          <ProductItem key={product.slug} product={convertDocToObj(product)} />
        ))}
      </div>
    </>
  )
}
