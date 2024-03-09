import { server } from '@/app/_trpc/server'
import { ProductForm } from '@/components/template/products/ProductForm'
import React from 'react'


interface ProductEditPageProps {
  params: {
    productId: string
  }
}

export default async function ProductEditPage({params}:ProductEditPageProps) {
  const product = await server.product.get({productId:params.productId})

  return (
    <div className="flex">
      <div className="w-full">
        <ProductForm edit product={product}/>
      </div>
    </div>
  )
}

