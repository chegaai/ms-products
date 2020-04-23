import { ObjectId } from 'bson'
import { Nullable } from '../../../utils/Nullable'

export interface SerializedProduct {
  _id: ObjectId
  sellerId: ObjectId
  name: string
  slug: string
  price: number
  category: string
  description: string
  pictures: string[]
  createdAt: Date
  updatedAt: Date
  deletedAt: Nullable<Date>
}
