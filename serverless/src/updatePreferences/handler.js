import Ajv from 'ajv'

import schema from '../../../schemas/sitePreferencesSchema.json'

import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { getDbConnection } from '../util/database/getDbConnection'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'
import { getJwtToken } from '../util/getJwtToken'
import { createJwtToken } from '../util/createJwtToken'
import { prepareExposeHeaders } from '../util/cmr/prepareExposeHeaders'

const updatePreferences = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  // eslint-disable-next-line no-param-reassign
  context.callbackWaitsForEmptyEventLoop = false

  const { defaultResponseHeaders } = getApplicationConfig()
  const { body } = event
  const { params } = JSON.parse(body)
  const { preferences } = params

  // Validate preferences against schema
  const ajv = new Ajv()
  const valid = ajv.validate(schema, preferences)
  if (!valid) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(JSON.stringify(ajv.errors))
    }
  }

  // Retrive a connection to the database
  const dbConnection = await getDbConnection()

  try {
    // If user information was included, use it in the queries
    const jwtToken = getJwtToken(event)
    const { id, username } = getVerifiedJwtToken(jwtToken)

    await dbConnection('users')
      .update({
        site_preferences: preferences
      })
      .where({ id })

    const newJwtToken = createJwtToken({ id, urs_id: username, site_preferences: preferences })

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: {
        ...defaultResponseHeaders,
        'access-control-expose-headers': prepareExposeHeaders(defaultResponseHeaders),
        'jwt-token': newJwtToken
      },
      body: JSON.stringify({
        preferences
      })
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default updatePreferences
