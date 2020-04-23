import { ObjectId } from 'bson'
import { BaseEntity, BaseEntityData } from '../BaseEntity'
import { CreateProductData } from './structures/CreateProductData'
import { slugify } from '../../utils/slugify'

export type SocialNetworkObject = { name: string, link: string }

export class Product extends BaseEntity {
  id: ObjectId = new ObjectId()
  sellerId: ObjectId = new ObjectId()
  slug: string = ''
  name: string = ''
  price: number = 0.0
  category: string = ''
  description: string = ''
  pictures: string[] = []


  static create (id: ObjectId, data: CreateProductData & BaseEntityData): Product {
    const product = new Product()
    product.id = id
    product.slug = slugify(data.name)
    product.sellerId = new ObjectId(data.sellerId)
    product.name = data.name
    product.price = data.price
    product.category = data.category
    product.description = data.description
    product.pictures = data.pictures
    if (data.createdAt) product.createdAt = data.createdAt
    if (data.updatedAt) product.updatedAt = data.updatedAt
    if (data.deletedAt) product.deletedAt = data.deletedAt

    return product
  }

  update (data: Partial<CreateProductData>) {
    this.name = data.name || this.name
    this.price = data.price || this.price 
    this.category = data.category || this.category
    this.description = data.description || this.description
    this.pictures = data.pictures || this.pictures
    this.updatedAt = new Date()
    return this
  }

  toObject () {
    return {
      id: this.id,
      sellerId: this.sellerId,
      description: this.description,
      name: this.name,
      slug: this.slug,
      price: this.price,
      category: this.category,
      pictures: this.pictures,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    }
  }
}
