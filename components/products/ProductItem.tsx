import { Product } from '@/lib/models/ProductModel'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Rating } from './Rating'

const ProductItem = ({ product }: { product: Product }) => {
  return (
    <div className="card bg-base-300 shadow-lg mb-4 lg:w-64 hover:shadow-xl transition-shadow duration-300">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="object-cover"
          />
        </Link>
        <div className="card-body">
          <Link href={`/product/${product.slug}`}>
            <h2 className="card-title font-normal">{product.name}</h2>
          </Link>
          <Rating value={product.rating} caption={`(${product.numReviews})`} />
          <p className="mb-2">{product.name}</p>
          <div className="card-actions flex items-center justify-between">
            <span className="text-2xl">${product.price}</span>
          </div>
        </div>
    </div>
  )
}

export default ProductItem
