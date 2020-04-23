import { MongodbRepository, PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
import { ObjectId } from 'bson'
import { inject, injectable } from 'tsyringe'
import { Db } from 'mongodb'
import { SerializedProduct } from '../../domain/product/structures/SerializedProduct'
import { Product } from '../../domain/product/Product'

export const COLLECTION = 'products'

@injectable()
export class ProductRepository extends MongodbRepository<Product, SerializedProduct> {
  constructor (@inject('MongodbConnection') connection: Db) {
    super(connection.collection(COLLECTION))
  }

  serialize (entity: Product) {
    const { id, ...product } = entity.toObject()
    return { _id: id, ...product }
  }

  deserialize (data: SerializedProduct): Product {
    const { _id, ...productData } = data
    return Product.create(_id, productData)
  }

  async searchProductsBySellerId (id: string, page: number, size: number) {
    return this.runPaginatedQuery({ deletedAt: null, sellerId: id }, page, size)
  }

  async findByIdOrSlug (idOrSlug: string) {
    return  this.findOneBy({ $or: [ {id: idOrSlug }, { slug: idOrSlug }] })
  }

  async getAll (page: number, size: number): Promise<PaginatedQueryResult<Product>> {
    return this.runPaginatedQuery({ deletedAt: null }, page, size)
  }

  async search (query: any, page: number, size: number) {
    return this.runPaginatedQuery(query, page, size)
  }

  async findManyById (communityIds: ObjectId[], page: number, size: number): Promise<PaginatedQueryResult<Product>> {
    return this.runPaginatedQuery({ _id: { $in: communityIds }, deletedAt: null }, page, size)
  }

  async findById (id: string): Promise<Product>{
    return this.findById(id)
  }
}
