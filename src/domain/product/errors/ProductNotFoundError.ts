import { DomainError } from '../../domain.error'

export class ProductNotFoundError extends DomainError {
  constructor (id: string) {
    super(`Product \`${id}\` does not exist`)
  }
}
