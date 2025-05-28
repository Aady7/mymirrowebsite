'use client'

const StyleQuiz = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Style Quiz</h1>
      <div>This is my style Quiz page</div>
    </div>
  )
}

export default StyleQuiz


//productItems List page
{/*'use client'
import React from 'react'
import { useEffect, useState } from 'react'
import { fetchPaginatedData } from '@/lib/hooks/useFetchProducts'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: number
  created_at: string
  url: string
  title: string
  name: string
  overallRating: number
  price: number
  mrp: number
  discount: string
  sizesAvailable: string
  productImages: string
  specifications: string
}

const Recommendations = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [items, setItems] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { data, count } = await fetchPaginatedData<Product>(page, pageSize);
        setItems(data);
        setTotalPages(Math.ceil(count / pageSize));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [page, pageSize]);
  
  // Parse string arrays from JSON strings
  const getProductImages = (imageString: string): string[] => {
    try {
      return JSON.parse(imageString);
    } catch {
      return [];
    }
  };
  
  const getSizesAvailable = (sizesString: string): string[] => {
    try {
      return JSON.parse(sizesString);
    } catch {
      return [];
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Recommended Products</h1>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="ml-4 text-gray-100">Loading products...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((product) => {
              const images = getProductImages(product.productImages);
              const sizes = getSizesAvailable(product.sizesAvailable);
              
              return (
                <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <Link href={`/product/${product.id}`}>
                    <div className="relative h-120 w-full overflow-hidden bg-gray-100">
                      {images.length > 0 ? (
                        <img 
                          src={images[0]} 
                          alt={product.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200">
                          <p className="text-gray-500">No image available</p>
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                      <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                        <span className="text-sm font-medium text-green-800">{product.overallRating}</span>
                        <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                    </div>
                    
                    <p className="text-gray-100 mb-3 line-clamp-2">{product.title}</p>
                    
                    <div className="flex items-center mb-3">
                      <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                      {product.mrp > product.price && (
                        <>
                          <span className="text-sm text-gray-500 line-through ml-2">₹{product.mrp}</span>
                          <span className="ml-2 text-sm font-medium text-green-600">
                            {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                          </span>
                        </>
                      )}
                    </div>
                    
                    {sizes.length > 0 && (
                      <div className="mb-3">
                        <span className="text-sm text-gray-500">Sizes:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {sizes.map((size, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs border rounded-md bg-gray-50 text-black">
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Link 
                      href={`/product/${product.id}`}
                      className="mt-2 block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          
          {items.length === 0 && !loading && (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-8">
            <div className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-4">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(page - 1)} 
                className={`px-4 py-2 rounded-md ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-medium transition-colors duration-300`}
              >
                Previous
              </button>
              <button 
                disabled={page === totalPages} 
                onClick={() => setPage(page + 1)} 
                className={`px-4 py-2 rounded-md ${page === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-medium transition-colors duration-300`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Recommendations */}