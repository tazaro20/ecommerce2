'use client'

import { CheckoutSteps } from '@/components/CheckoutSteps'
import useCartService from '@/lib/hooks/useCartStore'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const Form = () => {
  const router = useRouter()
  const { savePayementMethod, paymentMethod, shippingAddress } =
    useCartService()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await savePayementMethod(selectedPaymentMethod)
    router.push('/place-order')
  }

  useEffect(() => {
    if (!shippingAddress) {
      router.push('/shipping')
    }
    setSelectedPaymentMethod(paymentMethod || 'Paypal')
  }, [paymentMethod, shippingAddress, router])

  return (
    <div className="container mx-auto px-4">
      <CheckoutSteps current={2} />
      <h1 className="text-2xl font-bold text-center my-6">Select Payment Method</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-base-200 shadow-md p-6 rounded-lg"
      >
        <div className="space-y-4">
          {['Paypal', 'Stripe', 'Cash On Delivery'].map((payment) => (
            <div
              key={payment}
              className="flex items-center justify-between p-3 bg-base-300 rounded-lg"
            >
              <label className="flex items-center w-full cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  className="radio radio-primary mr-3"
                  value={payment}
                  checked={selectedPaymentMethod === payment}
                  onChange={() => setSelectedPaymentMethod(payment)}
                />
                <span className="label-text text-lg">{payment}</span>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button type="submit" className="btn btn-primary w-full">
            Next
          </button>
        </div>
        <div className="mt-4">
          <button
            type="button"
            className="btn btn-outline w-full"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  )
}

export default Form
