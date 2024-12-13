/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Order } from '@/lib/models/OrderModel'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function MyOrders() {
  const router = useRouter()
  const { data: orders, error } = useSWR(`/api/orders/mine`)

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>
  if (error) return <p className="text-red-500">An error has occurred.</p>
  if (!orders) return <p className="text-gray-500">Loading...</p>

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">My Orders</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">DATE</th>
              <th className="border border-gray-300 px-4 py-2 text-left">TOTAL</th>
              <th className="border border-gray-300 px-4 py-2 text-left">PAID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">DELIVERED</th>
              <th className="border border-gray-300 px-4 py-2 text-left">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order, index: number) => (
              <tr
                key={order._id}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-gray-100`}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {order._id.substring(20, 24)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.createdAt.substring(0, 10)}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${order.totalPrice.toFixed(2)}
                </td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    order.isPaid ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {order.isPaid && order.paidAt
                    ? `${order.paidAt.substring(0, 10)}`
                    : 'Not Paid'}
                </td>
                <td
                  className={`border border-gray-300 px-4 py-2 ${
                    order.isDelivered ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {order.isDelivered && order.deliveredAt
                    ? `${order.deliveredAt.substring(0, 10)}`
                    : 'Not Delivered'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    href={`/order/${order._id}`}
                    passHref
                    className="text-blue-500 hover:underline"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
