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
        toast.success('is strong i have not done it 😞😞🙁☹ !')
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
    <div className="container mx-auto p-4">
      <CheckoutSteps current={4} />
      <div className="grid md:grid-cols-4 md:gap-5 my-6">
        {/* Shipping Address Card */}
        <div className="card bg-base-200 shadow-md p-4 md:col-span-3">
          <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
          <p>{shippingAddress.fullName}</p>
          <p>
            {shippingAddress.address}, {shippingAddress.city},{' '}
            {shippingAddress.postalCode}, {shippingAddress.country}{' '}
          </p>
          <div className="mt-2">
            <Link className="btn btn-primary" href="/shipping">
              Edit
            </Link>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="card bg-base-200 shadow-md p-4 mt-4">
          <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
          <p>{paymentMethod}</p>
          <div className="mt-2">
            <Link className="btn btn-primary" href="/payment">
              Edit
            </Link>
          </div>
        </div>

        {/* Order Items */}
        <div className="card bg-base-200 shadow-md p-4 mt-4">
          <h2 className="text-lg font-semibold mb-2">Order Items</h2>
          <table className="table w-full">
            <thead>
              <tr>
                <th className="text-left">Item</th>
                <th className="text-center">Quantity</th>
                <th className="text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.slug}>
                  <td className="flex items-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="object-cover rounded-md mr-2"
                    />
                    <Link href={`/product/${item.slug}`}>
                      {item.name} ({item.color} {item.size})
                    </Link>
                  </td>
                  <td className="text-center">{item.qty}</td>
                  <td className="text-right">${item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <Link className="btn btn-primary" href="/cart">
              Edit
            </Link>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="card bg-base-200 shadow-md p-4">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        <ul className="space-y-3">
          <li className="flex justify-between">
            <span>Items</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </li>
          <li className="flex justify-between">
            <span>Tax</span>
            <span>${taxPrice.toFixed(2)}</span>
          </li>
          <li className="flex justify-between">
            <span>Shipping</span>
            <span>${shippingPrice.toFixed(2)}</span>
          </li>
          <li className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </li>
          <li>
            <button
              className="btn btn-primary w-full mt-4"
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
