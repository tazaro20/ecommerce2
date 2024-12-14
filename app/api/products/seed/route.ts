import data from "@/lib/data";
import ProductModel from "@/lib/models/ProductModel";
import mongodb from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = async(request: NextRequest) => {
    const { products} = data
    await mongodb()


    await ProductModel.deleteMany()
    await ProductModel.insertMany(products)

    return NextResponse.json({
        message: 'success insertion',
        products
    })
}