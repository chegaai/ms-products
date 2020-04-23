/* eslint-disable @typescript-eslint/no-misused-promises */
import axios from 'axios'
import { routes } from './routes'
import { container } from 'tsyringe'
import expresso from '@expresso/app'
import errors from '@expresso/errors'
import { Services } from '../services'
import { IAppConfig } from '../app.config'
import { createConnection } from '@nindoo/mongodb-data-layer'

export const app = expresso(async (app, config: IAppConfig, environment: string) => {
  const mongodbConnection = await createConnection(config.database.mongodb)

  container.register('MongodbConnection', { useValue: mongodbConnection })
  container.register('BlobStorageConfig', { useValue: config.azure.storage })
  container.register('ProfileAxiosInstance', {
    useValue: axios.create({ baseURL: config.microServices.profile.url })
  })

  const services = container.resolve(Services)

  app.get('/:productId', routes.find(services.product))
  app.post('/', routes.create(services.product))
  app.patch('/:productId', routes.update(services.product))
  app.delete('/:productId', routes.remove(services.product))
  app.get('/', routes.getProductsbySellerId(services.product))

  app.use(errors(environment))

  return app
})

export default { factory: app }
