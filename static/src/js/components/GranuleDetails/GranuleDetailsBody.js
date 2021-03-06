import React from 'react'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import { Tabs, Tab } from 'react-bootstrap'

import GranuleDetailsInfo from './GranuleDetailsInfo'
import GranuleDetailsMetadata from './GranuleDetailsMetadata'

import './GranuleDetailsBody.scss'

/**
 * Renders GranuleDetailsBody.
 * @param {object} props - The props passed into the component.
 * @param {object} props.json - JSON built from the XML for the selected granule.
 * @param {object} props.xml - The raw XML for the selected granule.
 */
const GranuleDetailsBody = ({
  authToken,
  metadataUrls,
  xml
}) => (
  <SimpleBar className="granule-details-body">
    <Tabs defaultActiveKey="information">
      <Tab eventKey="information" title="Information">
        <GranuleDetailsInfo xml={xml} />
      </Tab>
      <Tab eventKey="metadata" title="Metadata">
        <GranuleDetailsMetadata
          authToken={authToken}
          metadataUrls={metadataUrls}
        />
      </Tab>
    </Tabs>
  </SimpleBar>
)

GranuleDetailsBody.defaultProps = {
  authToken: null,
  metadataUrls: null,
  xml: null
}

GranuleDetailsBody.propTypes = {
  authToken: PropTypes.string,
  metadataUrls: PropTypes.shape({}),
  xml: PropTypes.string
}

export default GranuleDetailsBody
