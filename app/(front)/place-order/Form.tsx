'use client'
import { CheckoutSteps } from '@/components/CheckoutSteps'
import useCartService from '@/lib/hooks/useCartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useSWRMutation from 'swr/mutation'

const Form = () => {
  const router = useRouter()
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    clear,
  } = useCartService()

  const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
    `/api/orders/mine`,
    async () => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod,
          shippingAddress,
          items,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        clear()
        toast.success('Order placed successfully!')
        return router.push(`/order/${data.order._id}`)
      } else {
        toast.error(data.message)
      }
    }
  )

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment')
      return
    }
    if (items.length === 0) {
      router.push('/')
      return
    }
  }, [paymentMethod, router, items.length])

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <CheckoutSteps current={4} />
      <div className="grid md:grid-cols-4 gap-6 my-6">
        {/* Shipping Address Card */}
        <div className="card bg-white shadow-lg rounded-lg p-6 md:col-span-3">
          <h2 className="text-lg font-bold mb-4 text-gray-700">Shipping Address</h2>
          <p className="text-gray-600">{shippingAddress.fullName}</p>
          <p className="text-gray-600">
            {shippingAddress.address}, {shippingAddress.city},{' '}
            {shippingAddress.postalCode}, {shippingAddress.country}
          </p>
          <div className="mt-4">
            <Link className="btn btn-outline btn-primary" href="/shipping">
              Edit
            </Link>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="card bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-700">Payment Method</h2>
          <p className="text-gray-600">{paymentMethod}</p>
          <div className="mt-4">
            <Link className="btn btn-outline btn-primary" href="/payment">
              Edit
            </Link>
          </div>
        </div>

        {/* Order Items */}
        <div className="card bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-700">Order Items</h2>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-gray-600">Item</th>
                <th className="py-2 text-gray-600 text-center">Quantity</th>
                <th className="py-2 text-gray-600 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.slug} className="border-b">
                  <td className="py-3 flex items-center space-x-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="object-cover rounded-md"
                    />
                    <Link className="text-blue-600 hover:underline" href={`/product/${item.slug}`}>
                      {item.name} ({item.color} {item.size})
                    </Link>
                  </td>
                  <td className="py-3 text-center text-gray-600">{item.qty}</td>
                  <td className="py-3 text-right text-gray-600">${item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6">
            <Link className="btn btn-outline btn-primary w-full" href="/cart">
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="card bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Order Summary</h2>
        <ul className="space-y-4">
          <li className="flex justify-between text-gray-600">
            <span>Items</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </li>
          <li className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>${taxPrice.toFixed(2)}</span>
          </li>
          <li className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>${shippingPrice.toFixed(2)}</span>
          </li>
          <li className="flex justify-between font-semibold text-gray-800">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </li>
          <li>
            <button
              className="btn btn-primary w-full mt-6 py-2 text-lg"
              disabled={isPlacing}
              onClick={() => placeOrder()}
            >
              {isPlacing && (
                <span className="loading loading-spinner spinner-border text-primary mr-2"></span>
              )}
              Place Order
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Form