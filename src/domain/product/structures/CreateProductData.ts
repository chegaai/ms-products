import { ObjectId } from 'bson'

export interface CreateProductData {
  sellerId: ObjectId
  name: string
  price: number
  category: string
  description: string
  pictures: string[]
}

