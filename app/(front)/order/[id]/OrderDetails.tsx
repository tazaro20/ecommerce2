/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { OrderItem } from '@/lib/models/OrderModel'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

export default function OrderDetails({
  orderId,
  paypalClientId,
}: {
  orderId: string
  paypalClientId: string
}) {
  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`${url}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Order delivered successfully')
      } else {
        toast.error(data.message)
      }
    }
  )

  const { data: session } = useSession()

  function createPayPalOrder() {
    return fetch(`/api/orders/${orderId}/create-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((order) => order.id)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onApprovePayPalOrder(data: any) {
    return fetch(`/api/orders/${orderId}/capture-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((_orderData) => {
        toast.success('Order paid successfully')
      })
  }

  const { data, error } = useSWR(`/api/orders/${orderId}`)

  if (error) return error.message
  if (!data) return 'Loading...'

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = data

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Order {orderId}</h1>
      <div className="grid md:grid-cols-4 gap-6">
        {/* Left Section */}
        <div className="md:col-span-3 space-y-6">
          {/* Shipping Address */}
          <div className="card bg-gray-100 p-4 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
            <p>{shippingAddress.fullName}</p>
            <p>
              {shippingAddress.address}, {shippingAddress.city},{' '}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
            {isDelivered ? (
              <div className="mt-3 text-green-600 font-medium">
                Delivered at {deliveredAt}
              </div>
            ) : (
              <div className="mt-3 text-red-600 font-medium">
                Not Delivered
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="card bg-gray-100 p-4 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
            <p>{paymentMethod}</p>
            {isPaid ? (
              <div className="mt-3 text-green-600 font-medium">Paid at {paidAt}</div>
            ) : (
              <div className="mt-3 text-red-600 font-medium">Not Paid</div>
            )}
          </div>

          {/* Items */}
          <div className="card bg-gray-100 p-4 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border-b">Item</th>
                  <th className="p-2 border-b">Quantity</th>
                  <th className="p-2 border-b">Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: OrderItem) => (
                  <tr key={item.slug} className="hover:bg-gray-50">
                    <td className="p-2 flex items-center space-x-4">
                      <Link href={`/product/${item.slug}`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded"
                        />
                      </Link>
                      <span>{item.name}</span>
                    </td>
                    <td className="p-2 text-center">{item.qty}</td>
                    <td className="p-2 text-center">${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Section */}
        <div>
          <div className="card bg-gray-100 p-4 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <ul className="space-y-4">
              <li className="flex justify-between">
                <span>Items</span>
                <span>${itemsPrice}</span>
              </li>
              <li className="flex justify-between">
                <span>Tax</span>
                <span>${taxPrice}</span>
              </li>
              <li className="flex justify-between">
                <span>Shipping</span>
                <span>${shippingPrice}</span>
              </li>
              <li className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice}</span>
              </li>
              {!isPaid && paymentMethod === 'PayPal' && (
                <li>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PayPalButtons
                      createOrder={createPayPalOrder}
                      onApprove={onApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </li>
              )}
              {session?.user?.isAdmin && (
                <li>
                  <button
                    className="btn bg-blue-500 hover:bg-blue-600 text-white w-full"
                    onClick={() => deliverOrder()}
                    disabled={isDelivering}
                  >
                    {isDelivering && (
                      <span className="loading loading-spinner mr-2"></span>
                    )}
                    Mark as Delivered
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
