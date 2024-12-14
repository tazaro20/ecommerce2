import ProductItem from '@/components/products/ProductItem'
import { Rating } from '@/components/products/Rating'
import productService from '@/lib/services/productService'
import Link from 'next/link'
import React from 'react'

const sortOrders = ['newest', 'lowest', 'highest', 'rating']
const prices = [
  { name: '$1 to $50', value: '1-50' },
  { name: '$51 to $200', value: '51-200' },
  { name: '$201 to $1000', value: '201-1000' },
]
const ratings = [5, 4, 3, 2, 1]

/** Helper function to build dynamic filter URLs */
const buildFilterUrl = ({
  baseUrl = '/search',
  params,
}: {
  baseUrl?: string
  params: Record<string, string>
}) => {
  const filteredParams = Object.entries(params)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => value && value !== 'all') // Exclude "all" or empty values
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {} as Record<string, string>)

  return `${baseUrl}?${new URLSearchParams(filteredParams).toString()}`
}

function parseSearchParams(searchParams: Record<string, string | undefined>) {
    return {
      q: searchParams.q || 'all',
      category: searchParams.category || 'all',
      price: searchParams.price || 'all',
      rating: searchParams.rating || 'all',
    };
  }
  
  export async function generateMetadata({ searchParams }: { searchParams: Record<string, string | undefined> }) {
    const { q, category, price, rating } = parseSearchParams(searchParams);
  
    const filters = [
      q !== 'all' && `Search: ${q}`,
      category !== 'all' && `Category: ${category}`,
      price !== 'all' && `Price: ${price}`,
      rating !== 'all' && `Rating: ${rating}`,
    ]
      .filter(Boolean)
      .join(' | ');
  
    return {
      title: filters || 'Search Products',
    };
  }
  
  
  

export default async function SearchPage({
  searchParams: { q = 'all', category = 'all', price = 'all', rating = 'all', sort = 'newest', page = '1' },
}: {
  searchParams: {
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
  }
}) {
  const categories = await productService.getCategories()
  const { countProducts, products, pages } = await productService.getByQuery({
    category,
    q,
    price,
    rating,
    page,
    sort,
  })

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      {/* Sidebar */}
      <aside>
        {/* Filter: Categories */}
        <section className="mb-4">
          <h2 className="text-xl pt-3">Department</h2>
          <ul>
            <li>
              <Link
                className={`link link-hover ${category === 'all' ? 'link-primary' : ''}`}
                href={buildFilterUrl({ params: { q, category: 'all', price, rating, sort, page } })}
              >
                Any
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <Link
                  className={`link link-hover ${c === category ? 'link-primary' : ''}`}
                  href={buildFilterUrl({ params: { q, category: c, price, rating, sort, page } })}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Filter: Prices */}
        <section className="mb-4">
          <h2 className="text-xl pt-3">Price</h2>
          <ul>
            <li>
              <Link
                className={`link link-hover ${price === 'all' ? 'link-primary' : ''}`}
                href={buildFilterUrl({ params: { q, category, price: 'all', rating, sort, page } })}
              >
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  className={`link link-hover ${p.value === price ? 'link-primary' : ''}`}
                  href={buildFilterUrl({ params: { q, category, price: p.value, rating, sort, page } })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Filter: Ratings */}
        <section className="mb-4">
          <h2 className="text-xl pt-3">Customer Review</h2>
          <ul>
            <li>
              <Link
                className={`link link-hover ${rating === 'all' ? 'link-primary' : ''}`}
                href={buildFilterUrl({ params: { q, category, price, rating: 'all', sort, page } })}
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  className={`link link-hover ${String(r) === rating ? 'link-primary' : ''}`}
                  href={buildFilterUrl({ params: { q, category, price, rating: String(r), sort, page } })}
                >
                  <Rating caption={' & up'} value={r} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </aside>

      {/* Main Content */}
      <main className="md:col-span-4">
        {/* Filter Summary */}
        <div className="flex items-center justify-between py-4">
          <div>
            {products.length === 0 ? 'No' : countProducts} Results
            {q !== 'all' && ` : ${q}`}
            {category !== 'all' && ` : ${category}`}
            {price !== 'all' && ` : Price ${price}`}
            {rating !== 'all' && ` : Rating ${rating} & up`}
            {q !== 'all' || category !== 'all' || price !== 'all' || rating !== 'all' ? (
              <Link className="btn btn-sm btn-ghost ml-2" href="/search">
                Clear Filters
              </Link>
            ) : null}
          </div>
          {/* Sort Options */}
          <div>
            Sort by:
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-2 link link-hover ${sort === s ? 'link-primary' : ''}`}
                href={buildFilterUrl({ params: { q, category, price, rating, sort: s, page } })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.map((product) => (
            <ProductItem key={product.slug} product={product} />
          ))}
        </div>

        {/* Pagination */}
        <div className="join mt-4">
          {products.length > 0 &&
            Array.from({ length: pages }).map((_, p) => (
              <Link
                key={p}
                className={`join-item btn ${Number(page) === p + 1 ? 'btn-active' : ''}`}
                href={buildFilterUrl({ params: { q, category, price, rating, sort, page: String(p + 1) } })}
              >
                {p + 1}
              </Link>
            ))}
        </div>
      </main>
    </div>
  )
}
