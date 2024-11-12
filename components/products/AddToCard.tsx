"use client"
import useCartService from "@/lib/hooks/useCartStore";
import { OrderItem } from "@/lib/models/OrderModel";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AddToCart({item}: {item: OrderItem}){
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const router = useRouter();
    const {items, increase,decrease} = useCartService();
    const [existItem, setExistItem] = useState<OrderItem | undefined>(undefined);

    useEffect(() => {
      setExistItem(items.find((x) => x.slug === item.slug))
    }, [item, items])

    const addToCartHandler = () => {
        increase(item)
    }

    return existItem ? (
        <div>
            <button className="btn" type="button" onClick={() => decrease({...existItem, qty: existItem.qty - 1})}>
                -
            </button>
            <span className="px-2">{existItem.qty}</span>
            <button className="btn" type="button" onClick={() => increase(existItem)}>
                +
            </button>
        </div>
    ) : (
        <button 
        className="btn btn-primary w-full"
        type="button"
        onClick={addToCartHandler}
        >
          Ajouter au panier
        </button>
    ); 
}