import { DomainError } from '../../domain.error'

export class ProductAlreadyExistsError extends DomainError {
  constructor (document: string) {
    super(`Product ${document} already exists`)
  }
}
