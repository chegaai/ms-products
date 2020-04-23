import { injectable } from 'tsyringe'
import { ProductService } from './ProductService'

@injectable()
export class Services {
  constructor (
    public readonly product: ProductService
  ) { }
}
