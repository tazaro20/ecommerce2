import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div>
      <header>
        <nav>
            <div className='navbar justify-between bg-base-300'>
            <Link href="/" className='btn btn-ghost text-lg'>Ecommerce-2</Link>
              <ul className='flex'>
                <li >
                    <Link className='btn btn-ghost rounded-btn' href="/cart">Cart</Link>
                </li>
                <li >
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
