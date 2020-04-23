import rescue from 'express-rescue'
import { IExpressoRequest } from '@expresso/app'
import { Request, Response, NextFunction } from 'express'
import { ProductService } from '../../../services/ProductService'
import { CreateProductData } from '../../../domain/product/structures/CreateProductData'
import { validateType } from '@expresso/validator'

export default function factory (service: ProductService) {
  return [
    validateType<CreateProductData>({ required: true }),
    rescue(async (req: IExpressoRequest<any>, res: Response) => {
      const sellerId = (req.onBehalfOf) ? req.onBehalfOf : req.body.sellerId
      const productData = { ...req.body, sellerId }

      const product = await service.create(productData)

      res.status(201)
        .json(product.toObject())
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
    
      next(err)
    }
  ]
}
