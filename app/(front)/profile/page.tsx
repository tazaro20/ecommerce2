import { Metadata } from "next";
import Form from "./Form";

export const metadata: Metadata = {
    title: 'profile'
}

export default async function profile() {
    return <Form />
}