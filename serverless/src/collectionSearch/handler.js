import { pick } from 'lodash'
import { buildParams } from '../util/cmr/buildParams'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getJwtToken } from '../util/getJwtToken'
import { logLambdaEntryTime } from '../util/logging/logLambdaEntryTime'

/**
 * Returns the keys permitted by cmr based on the request format
 * @param {String} format Format of the request (extension i.e. json or umm_json)
 */
function getPermittedCmrKeys(format) {
  if (format === 'umm_json') {
    return [
      'concept_id'
    ]
  }

  return [
    'bounding_box',
    'collection_data_type',
    'concept_id',
    'data_center_h',
    'data_center',
    'echo_collection_id',
    'facets_size',
    'format',
    'granule_data_format_h',
    'has_granules_or_cwic',
    'has_granules',
    'include_facets',
    'include_granule_counts',
    'include_has_granules',
    'include_tags',
    'instrument_h',
    'keyword',
    'line',
    'options',
    'page_num',
    'page_size',
    'platform_h',
    'point',
    'polygon',
    'processing_level_id_h',
    'project_h',
    'project',
    'science_keywords_h',
    'sort_key',
    'tag_key',
    'temporal',
    'two_d_coordinate_system'
  ]
}

/**
 * Perform an authenticated CMR Collection search
 * @param {Object} event Details about the HTTP request that it received
 */
const collectionSearch = async (event, context) => {
  const { body, headers, pathParameters } = event
  const { format } = pathParameters

  const { invocationTime, requestId } = JSON.parse(body)

  logLambdaEntryTime(requestId, invocationTime, context)

  // The 'Accept' header contains the UMM version
  const providedHeaders = pick(headers, ['Accept'])

  // Whitelist parameters supplied by the request
  const permittedCmrKeys = getPermittedCmrKeys(format)

  const nonIndexedKeys = [
    'collection_data_type',
    'concept_id',
    'data_center_h',
    'granule_data_format_h',
    'instrument_h',
    'platform_h',
    'processing_level_id_h',
    'project_h',
    'sort_key',
    'tag_key'
  ]

  return doSearchRequest({
    jwtToken: getJwtToken(event),
    path: `/search/collections.${format}`,
    params: buildParams({
      body,
      nonIndexedKeys,
      permittedCmrKeys
    }),
    providedHeaders,
    requestId
  })
}

export default collectionSearch
