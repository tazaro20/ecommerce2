import { Metadata } from "next";
import Form from "./Form";

export const metadata: Metadata = {
    title: 'place-order '
}

export default function PlaceOrder() {
    return (
            <Form />
    )
}