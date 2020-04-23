import rescue from 'express-rescue'
import { Request, Response, NextFunction } from 'express'
import { ProductService } from '../../../services/ProductService'
// import { Product } from '../../../domain/product/Product'
// import { validateType } from '@expresso/validator'

export default function factory (service: ProductService) {
  return [
    // validateType<Product>({ required: true }),
    rescue(async (req: Request, res: Response) => {
      const productData = req.body
      const productId = req.params.productId
      const product = await service.update(productId, productData)

      res.status(200)
        .json(product.toObject())
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
    
      next(err)
    }
  ]
}
