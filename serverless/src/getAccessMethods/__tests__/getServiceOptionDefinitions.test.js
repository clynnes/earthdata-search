import nock from 'nock'

import { getServiceOptionDefinitions } from '../getServiceOptionDefinitions'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getAccessTokenFromJwtToken from '../../util/urs/getAccessTokenFromJwtToken'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getServiceOptionDefinitions', () => {
  test('fetches option definitions from CMR', async () => {
    nock(/cmr/)
      .get(/service_option_definitions/)
      .reply(200, [{
        service_option_definition: {
          form: 'mock echo form'
        }
      }])

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://cmr.example.com' }))
    jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => ({ access_token: 'access_token' }))

    const collectionProvider = {
      provider: {
        id: 'abcd-1234-efgh-5678',
        organization_name: 'EDSC-TEST',
        provider_id: 'EDSC-TEST'
      }
    }

    const serviceOptionDefinitions = [
      {
        id: 'option_def_guid',
        name: 'Service Option Definition'
      }
    ]

    const forms = await getServiceOptionDefinitions(collectionProvider, serviceOptionDefinitions, 'mockJwt')

    expect(forms).toEqual([
      {
        esi0: {
          form: 'mock echo form',
          form_digest: '948c584e60f9791b4d7b0e84ff538cd58ac8c0e4',
          service_option_definition: {
            id: 'option_def_guid',
            name: 'Service Option Definition'
          },
          service_option_definitions: undefined
        }
      }
    ])
  })

  test('fetches multiple option definitions from CMR', async () => {
    nock(/cmr/)
      .get(/service_option_definitions/)
      .reply(200, [{
        service_option_definition: {
          form: 'mock echo form 1'
        }
      }])
    nock(/cmr/)
      .get(/service_option_definitions/)
      .reply(200, [{
        service_option_definition: {
          form: 'mock echo form 2'
        }
      }])

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'http://cmr.example.com' }))
    jest.spyOn(getAccessTokenFromJwtToken, 'getAccessTokenFromJwtToken').mockImplementation(() => ({ access_token: 'access_token' }))

    const collectionProvider = {
      provider: {
        id: 'abcd-1234-efgh-5678',
        organization_name: 'EDSC-TEST',
        provider_id: 'EDSC-TEST'
      }
    }

    const serviceOptionDefinitions = [
      {
        id: 'service_option_def_guid_1',
        name: 'Service Option Definition'
      },
      {
        id: 'service_option_def_guid_2',
        name: 'Service Option Definition'
      }
    ]

    const forms = await getServiceOptionDefinitions(collectionProvider, serviceOptionDefinitions, 'mockJwt')

    expect(forms).toEqual([
      {
        esi0: {
          form: 'mock echo form 1',
          form_digest: '9edb6f8f606fa9014402cf229751c03c35327135',
          service_option_definition: {
            id: 'service_option_def_guid_1',
            name: 'Service Option Definition'
          },
          service_option_definitions: undefined
        }
      },
      {
        esi1: {
          form: 'mock echo form 2',
          form_digest: '26d076d6eeeb35e09c8b5581d32de368ae6f4892',
          service_option_definition: {
            id: 'service_option_def_guid_2',
            name: 'Service Option Definition'
          },
          service_option_definitions: undefined
        }
      }
    ])
  })
})
