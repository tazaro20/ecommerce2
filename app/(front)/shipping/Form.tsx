'use client'
import { CheckoutSteps } from '@/components/CheckoutSteps'
import useCartService from '@/lib/hooks/useCartStore'
import { ShippingAddress } from '@/lib/models/OrderModel'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, useForm, ValidationRule } from 'react-hook-form'

const Form = () => {
  const router = useRouter()
  const { saveShippingAddress, shippingAddress } = useCartService()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddress>({
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
  })

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName)
    setValue('address', shippingAddress.address)
    setValue('city', shippingAddress.city)
    setValue('postalCode', shippingAddress.postalCode)
    setValue('country', shippingAddress.country)
  }, [setValue, shippingAddress])

  const formSubmit: SubmitHandler<ShippingAddress> = async (form) => {
    await saveShippingAddress(form)
    router.push('/payment')
  }

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof ShippingAddress
    name: string
    required?: boolean
    pattern?: ValidationRule<RegExp>
  }) => (
    <div className="my-4">
      <label className="label font-medium text-gray-700" htmlFor={id}>
        {name}
      </label>
      <input
        type="text"
        id={id}
        {...register(id, {
          required: required && `${name} is required`,
          pattern,
        })}
        className="input input-bordered w-full focus:outline-none focus:ring focus:ring-primary-300"
      />
      {errors[id]?.message && (
        <p className="text-sm text-red-500 mt-1">{errors[id].message}</p>
      )}
    </div>
  )

  return (
    <div>
      <CheckoutSteps current={1} />
      <div className="max-w-lg mx-auto my-10 card bg-base-100 shadow-md border border-gray-200">
        <div className="card-body p-6">
          <h1 className="card-title text-xl font-semibold text-gray-800 text-center">Shipping Address</h1>
          <form onSubmit={handleSubmit(formSubmit)} className="space-y-6">
            <FormInput id="fullName" name="Full Name" required />
            <FormInput id="address" name="Address" required />
            <FormInput id="city" name="City" required />
            <FormInput
              id="postalCode"
              name="Postal Code"
              required
              pattern={/^[A-Za-z0-9\s]{3,10}$/}
            />
            <FormInput id="country" name="Country" required />
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary py-2 px-6 text-lg font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <span className="loading loading-spinner mr-2"></span>
                )}
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Form
