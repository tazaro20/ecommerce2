import { Metadata } from "next";
import Form from "./Form";

export const metadata: Metadata = {
    title: 'Shipping Address',
}

export default function ShippingAddress() {
    return <Form/>
}