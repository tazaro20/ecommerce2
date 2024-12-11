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
    <div>
      <CheckoutSteps current={2} />
      <h1 className="max-w-sm mx-auto card bg-base-300 my-4"></h1>
      <form onSubmit={handleSubmit}>
        {['Paypal', 'stripe', 'CashOnDelibery'].map((payment) => (
          <div key={payment}>
            <label className="label cursor-pointer">
              <span className="label-text">{payment}</span>
              <input
                type="radio"
                name="paymentMethod"
                className="radio"
                value={payment}
                checked={selectedPaymentMethod === payment}
                onChange={() => setSelectedPaymentMethod(payment)}
              />
            </label>
          </div>
        ))}
          <div className="my-2">
                 <button type="submit" className="btn btn-primary w-full">
                   Next
                 </button>
               </div>
               <div className="my-2">
                 <button
                   type="button"
                   className="btn w-full my-2"
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
