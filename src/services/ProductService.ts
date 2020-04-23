// import axios from 'axios'
import { ObjectId } from 'bson'
import { injectable } from 'tsyringe'
import { Product } from '../domain/product/Product'
import { ProfileClient } from '../data/clients/ProfileClient'
import { PaginatedQueryResult } from '@nindoo/mongodb-data-layer'
import { BlobStorageClient } from '../data/clients/BlobStorageClient'
import { ProductRepository } from '../data/repositories/ProductRepository'
import { CreateProductData } from '../domain/product/structures/CreateProductData'
import { UserNotFoundError } from '../domain/product/errors/UserNotFoundError'
import { ProductNotFoundError } from '../domain/product/errors/ProductNotFoundError'
import { InvalidDeleteError } from '../domain/product/errors/InvalidDeleteError'

@injectable()
export class ProductService {
  constructor (
    private readonly userClient: ProfileClient,
    private readonly repository: ProductRepository,
    private readonly blobStorageClient: BlobStorageClient
  ) { }

  async uploadBase64 (base64: string) {
    const url = await this.blobStorageClient.uploadBase64(base64, 'image/*')

    if (!url) {
      throw Error() // TODO: throw better error handler
    }
    return url
  }

  async create (creationData: CreateProductData): Promise<Product> {
    const seller = await this.userClient.findProfileById(creationData.sellerId)

    if (!seller){
      throw new UserNotFoundError(creationData.sellerId.toHexString())
    }
    if (!creationData.pictures || creationData.pictures.length < 1) {
      // TODO: throw NoPicturesError
    }
    creationData.pictures = await Promise.all(creationData.pictures.map(async (picture) => await this.uploadBase64(picture)))

    const product = Product.create(new ObjectId(), creationData)

    return this.repository.save(product)
  }

  async update (id: string, dataToUpdate: Partial<CreateProductData>): Promise<Product> {
    const currentProduct = await this.repository.findById(id)
    if (!currentProduct) {
      throw new ProductNotFoundError(id)
    }

    if (dataToUpdate.pictures) {
      dataToUpdate.pictures = await Promise.all(dataToUpdate.pictures.map(async (picture) => await this.uploadBase64(picture)))
    }

    const newProduct = {
      ...currentProduct,
      ...dataToUpdate
    }

    currentProduct.update(newProduct)

    return this.repository.save(currentProduct)
  }

  async delete (id: string, userId: string): Promise<void> {
    const product = await this.repository.findById(id)
    if (!product) return

    if (!product.sellerId.equals(userId)) throw new InvalidDeleteError()

    product.delete()
    await this.repository.save(product)
  }

  async find (idOrSlug: string): Promise<Product> {
    const product = await this.repository.findByIdOrSlug(idOrSlug)
    if (!product) throw new ProductNotFoundError(idOrSlug)
    return product
  }

  async searchProductsBySellerId (sellerId: string, page = 0, size = 10): Promise<PaginatedQueryResult<Product>> {
    return this.repository.searchProductsBySellerId(sellerId, page, size)
  }
}
