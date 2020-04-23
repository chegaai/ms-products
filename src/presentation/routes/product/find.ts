import rescue from 'express-rescue'
import { Request, Response, NextFunction } from 'express'
import { ProductService } from '../../../services/ProductService'

export default function factory (service: ProductService) {
  return [
    rescue(async (req: Request, res: Response) => {
      const productId = req.params.productId
      const product = await service.find(productId)

      res.status(200)
        .json(product.toObject())
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      next(err)
    }
  ]
}
