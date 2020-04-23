import rescue from 'express-rescue'
import { Request, Response, NextFunction } from 'express'
import { ProductService } from '../../../services/ProductService'
import { IExpressoRequest } from '@expresso/app'
import { validateType } from '@expresso/validator'

type PaginationQuery = {
  page: number
  size: number
} 

export default function factory (service: ProductService) {
  return [
    validateType<PaginationQuery>({ required: true }, { property: 'query' }),
    rescue(async (req: IExpressoRequest<any,any,PaginationQuery>, res: Response) => {
      const sellerId = (req.onBehalfOf) ? req.onBehalfOf : req.params.sellerId
      const searchResult = await service.searchProductsBySellerId(sellerId, req.query.page, req.query.size)
      const { count, range, results, total } = searchResult
      const status = total > count ? 206 : 200

      if (status === 206) res.append('x-content-range', `${range.from}-${range.to}/${total}`)

      res.status(status)
        .json(results.map((result: any) => result.toObject()))
    }),
    (err: any, _req: Request, _res: Response, next: NextFunction) => {
      next(err)
    }
  ]
}
