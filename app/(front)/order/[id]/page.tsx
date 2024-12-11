import OrderDetails from "./OrderDetails"

export async function generateMetadata({ params }: { params: { _id: string } }) {
  return {
    title: `Order ${params._id}`,
  }
}

export default async function OrderHistory({
  params,
}: {
  params: { _id: string }
}) {
  const orderId = await params._id

  return (
    <OrderDetails
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      orderId={orderId}
    />
  )
}