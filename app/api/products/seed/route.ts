import data from "@/lib/data";
import ProductModel from "@/lib/models/ProductModel";
import UserModel from "@/lib/models/UserModel";
import mongodb from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = async(request: NextRequest) => {
    const {users, products} = data
    await mongodb()

    await UserModel.deleteMany()
    await UserModel.insertMany(users)

    await ProductModel.deleteMany()
    await ProductModel.insertMany(products)

    return NextResponse.json({
        message: 'success insertion',
        users,
        products
    })
}