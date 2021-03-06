import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import { getFocusedCollectionObject } from '../../util/focusedCollection'

import GranuleResultsHeader from '../../components/GranuleResults/GranuleResultsHeader'

const mapDispatchToProps = dispatch => ({
  onToggleAboutCwicModal:
    state => dispatch(actions.toggleAboutCwicModal(state)),
  onToggleSecondaryOverlayPanel:
    state => dispatch(actions.toggleSecondaryOverlayPanel(state)),
  onUndoExcludeGranule:
    collectionId => dispatch(actions.undoExcludeGranule(collectionId)),
  onApplyGranuleFilters:
    (focusedCollection, values) => dispatch(
      actions.applyGranuleFilters(focusedCollection, values)
    )
})

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  granules: state.searchResults.granules,
  collectionSearch: state.query.collection,
  secondaryOverlayPanel: state.ui.secondaryOverlayPanel
})

export const GranuleResultsHeaderContainer = (props) => {
  const {
    collections,
    focusedCollection,
    location,
    onApplyGranuleFilters,
    onToggleSecondaryOverlayPanel,
    onUndoExcludeGranule,
    collectionSearch,
    secondaryOverlayPanel,
    onToggleAboutCwicModal
  } = props

  const focusedCollectionObject = getFocusedCollectionObject(focusedCollection, collections)

  return (
    <>
      <GranuleResultsHeader
        location={location}
        focusedCollectionObject={focusedCollectionObject}
        focusedCollectionId={focusedCollection}
        onApplyGranuleFilters={onApplyGranuleFilters}
        onToggleSecondaryOverlayPanel={onToggleSecondaryOverlayPanel}
        onUndoExcludeGranule={onUndoExcludeGranule}
        collectionSearch={collectionSearch}
        secondaryOverlayPanel={secondaryOverlayPanel}
        onToggleAboutCwicModal={onToggleAboutCwicModal}
      />
    </>
  )
}

GranuleResultsHeaderContainer.propTypes = {
  location: PropTypes.shape({}).isRequired,
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  granules: PropTypes.shape({}).isRequired,
  onApplyGranuleFilters: PropTypes.func.isRequired,
  onToggleSecondaryOverlayPanel: PropTypes.func.isRequired,
  onUndoExcludeGranule: PropTypes.func.isRequired,
  collectionSearch: PropTypes.shape({}).isRequired,
  secondaryOverlayPanel: PropTypes.shape({}).isRequired,
  onToggleAboutCwicModal: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsHeaderContainer)
)
