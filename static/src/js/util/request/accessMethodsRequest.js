import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class AccessMethodsRequest extends Request {
  constructor(authToken) {
    super(getEnvironmentConfig().apiHost)
    this.authenticated = true
    this.authToken = authToken
    this.searchPath = 'access_methods'
  }

  permittedCmrKeys() {
    return [
      'associations',
      'collection_id',
      'collection_provider',
      'tags'
    ]
  }
}
