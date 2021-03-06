import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as tinyCookie from 'tiny-cookie'

import { AuthCallbackContainer } from '../AuthCallbackContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    location: {
      search: '?jwt=mockjwttoken&redirect=http%3A%2F%2Flocalhost%3A8080%2Fsearch'
    }
  }

  const enzymeWrapper = shallow(<AuthCallbackContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
})

describe('AuthCallbackContainer component', () => {
  const { replace } = window.location

  afterEach(() => {
    jest.clearAllMocks()
    window.location.replace = replace
  })

  test('sets the auth cookie and redirects', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    const props = {
      location: {
        search: '?jwt=mockjwttoken&redirect=http%3A%2F%2Flocalhost%3A8080%2Fsearch'
      }
    }

    shallow(<AuthCallbackContainer {...props} />)

    expect(setSpy).toBeCalledTimes(1)
    expect(setSpy).toBeCalledWith('authToken', 'mockjwttoken')

    expect(window.location.replace.mock.calls.length).toBe(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['http://localhost:8080/search'])
  })

  test('clears the auth cookie and redirects to root path if values are not set', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    const props = {
      location: {
        search: ''
      }
    }

    shallow(<AuthCallbackContainer {...props} />)

    expect(setSpy).toBeCalledTimes(1)
    expect(setSpy).toBeCalledWith('authToken', '')

    expect(window.location.replace.mock.calls.length).toBe(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['/'])
  })
})
