"use client"
import Link from 'next/link'
import React from 'react'
import useCartService from '@/lib/hooks/useCartStore'

const Header = () => {
  const { items } = useCartService()
  const cartItemsCount = items.reduce((sum, item) => sum + item.qty, 0)

  return (
    <div>
      <header>
        <nav>
            <div className='navbar justify-between bg-base-300'>
            <Link href="/" className='btn btn-ghost text-lg'>Ecommerce-2</Link>
              <ul className='flex'>
                <li>
                    <Link className='btn btn-ghost rounded-btn' href="/cart">
                      Cart
                      {cartItemsCount > 0 && (
                        <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                          {cartItemsCount}
                        </span>
                      )}
                    </Link>
                </li>
                <li>
                    <Link className='btn btn-ghost rounded-btn' href="/signin">Sign in</Link>
                </li>
              </ul>
            </div>
        </nav>
      </header>
    </div>
  )
}

export default Header