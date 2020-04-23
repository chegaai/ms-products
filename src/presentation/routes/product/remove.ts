import rescue from 'express-rescue'
import { boom } from '@expresso/errors'
import { Request, Response, NextFunction } from 'express'
import { InvalidDeleteError } from '../../../domain/product/errors/InvalidDeleteError'
import { ProductService } from '../../../services/ProductService'

export default function factory (service: ProductService) {
  return [
    rescue(async (req: Request, res: Response) => {
      const productId = req.params.productId
      const sellerId = req.params.sellerId
      await service.delete(productId, sellerId)

      res.status(204).end()
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof InvalidDeleteError) return next(boom.forbidden(err.message, { code: 'user_is_not_group_founder' }))
      next(err)
    }
  ]
}
