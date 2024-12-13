'use client'

import useCartService from '@/lib/hooks/useCartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CartDetails() {
  const router = useRouter()
  const { items, itemsPrice, decrease, increase } = useCartService()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <></>
  }
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="text-center text-gray-500">
          Your cart is empty.{' '}
          <Link href={'/'} className="text-blue-500 underline">
            Go shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Cart Items */}
          <div className="md:col-span-3">
            <table className="table-auto w-full border-collapse border border-gray-300 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 border-b">Product</th>
                  <th className="p-4 border-b">Quantity</th>
                  <th className="p-4 border-b">Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.name} className="hover:bg-gray-50">
                    <td className="p-4 flex items-center space-x-4">
                      <Link href={`/product/${item.slug}`} className="flex items-center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded"
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          className="btn btn-xs btn-outline btn-error"
                          onClick={() => decrease(item)}
                        >
                          -
                        </button>
                        <span className="px-2 font-semibold">{item.qty}</span>
                        <button
                          className="btn btn-xs btn-outline btn-success"
                          onClick={() => increase(item)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700 font-semibold">
                      ${item.price * item.qty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card bg-gray-50 border border-gray-200 shadow-md">
              <div className="card-body p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <ul>
                  <li className="flex justify-between pb-3 text-lg">
                    <span>Subtotal</span>
                    <span>${itemsPrice}</span>
                  </li>
                  <li className="pt-4">
                    <button
                      onClick={() => router.push('/shipping')}
                      className="btn btn-primary w-full"
                    >
                      Proceed to Checkout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
