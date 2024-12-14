'use client'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'

export const SearchBox = () => {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'All'

  const { data: categories, error } = useSWR('/api/products/categories')

  if (error) return error.message
  if (!categories) return 'Loading...'

  return (
    <form
      action="/search"
      method="GET"
      className="flex flex-col gap-4 sm:flex-row sm:items-center"
    >
      <div className="flex gap-2">
        <select
          name="category"
          defaultValue={category}
          className="select select-bordered rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All</option>
          {categories.map((c: string) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          className="input input-bordered rounded-md shadow-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search"
          defaultValue={q}
          name="q"
        />
      </div>
      <button className="btn btn-primary shadow-md rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
        Search
      </button>
    </form>
  )
}
