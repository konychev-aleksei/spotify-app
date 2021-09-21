import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faSignOutAlt, faPlus, faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'

import { auth } from '../../firebase'
import * as api from '../../api/index'

import AppContext from '../../AppContext'


const Topbar = () => {
  const { showPlaylists, setShowPlaylists } = useContext(AppContext)
  const history = useHistory()

  const handleLeft = async () => {
    if (showPlaylists) {
      setShowPlaylists(false)
    }
    else {
      history.push('/')
      api.deleteToken()
      await auth.signOut()
    }
  }

  const handleMiddle = () => {
    setShowPlaylists(false)
    history.push('/')
  }

  const handleRight = () => {
    if (showPlaylists) {
      setShowPlaylists(false)
      history.push('/new')
    }
    else {
      setShowPlaylists(true)
    }
  }


  return(
    <div class="top-bar">
      <button onClick={ handleLeft }>
        {
          showPlaylists ?
          <FontAwesomeIcon icon={ faArrowLeft } />
          :
          <FontAwesomeIcon icon={ faSignOutAlt } />
        }
      </button>
      <h1>{ showPlaylists ? 'Playlists' : 'Collection' }</h1>
      {
        showPlaylists ?
        <button onClick={ handleMiddle }>
          <FontAwesomeIcon icon={ faSearch } />
        </button>
        : null
      }
      <button onClick={ handleRight }>
        {
          showPlaylists ?
          <FontAwesomeIcon icon={ faPlus } />
          :
          <FontAwesomeIcon icon={ faMusic } />
        }
      </button>
    </div>
  )
}

export default Topbar
