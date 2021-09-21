import React, { useState, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom'

import * as api from '../../api/index'
import { auth } from '../../firebase'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faSearch } from '@fortawesome/free-solid-svg-icons'

import Loader from 'react-loader-spinner'

import Track from '../minor/Track'
import SwipingList from '../minor/SwipingList'
import BestResult from '../minor/BestResult'

import AppContext from '../../AppContext'


const Home = ({ setCurrentTrack, audioRef, playing, setPlaying, currentTrackId, toggleTrack, setAdditionMode }) => {
  const { user, setCurrentPlaylist } = useContext(AppContext)

  const [fetching, setFetching] = useState()
  const [response, setResponse] = useState({})

  const query = useRef(null)

  const getHours = () => {
    const hours = (new Date()).getHours()
    if (hours >= 21) {
      return 'night'
    }
    else if (hours >= 16) {
      return 'evening'
    }
    else if (hours >= 12) {
      return 'afternoon'
    }
    else if (hours >= 6) {
      return 'morning'
    }
    else {
      return 'night'
    }
  }

  const runSearch = async (e) => {
    const query = e.target.value
    if (!query.length) {
      setResponse({})
      return
    }

    setFetching(true)
    const response = await api.runSearch(query)
    setResponse(response.data)
    setFetching(false)
    setCurrentPlaylist({ _id: response.data.name, tracks: response.data.tracks, index: 0 })
  }

  const signOut = async () => {
    api.deleteToken()
    await auth.signOut()
  }

  return(
    <div class="content">
      <FontAwesomeIcon className="search-icon" icon={ faSearch } />
      <input ref={ query } placeholder="Track, artist or playlist" type="search" onChange={ (e) => runSearch(e) } />
      {
        fetching ?
        <div className="fetching">
          <Loader
            type="TailSpin"
            color="#1DB954"
            height={ 60 }
            width={ 60 }
          />
        </div>
        :
        <>
          {
            Object.keys(response).length && (response.tracks.length || response.playlists.length) ?
            <div class="results">
              {
                response?.tracks?.length ?
                <div class="best-result">
                  <p>Best result</p>
                  <BestResult
                    trackInfo={ response.tracks[0] }
                    toggleTrack={ toggleTrack }
                    playing={ playing }
                    currentTrackId={ currentTrackId }
                  />
                </div>
                : null
              }
              {
                response?.tracks?.length ?
                <div class="tracks-list small">
                  <p>Tracks</p>
                  {
                    response?.tracks?.map((trackInfo, index) =>
                      <div className="track-in">
                        <Track
                          playing={ playing }
                          setPlaying={ setPlaying }
                          index={ index }
                          trackInfo={ trackInfo }
                          inMyPlaylist={ false }
                          toggleTrack={ toggleTrack }
                          currentTrackId={ currentTrackId }
                          setAdditionMode={ setAdditionMode }
                        />
                      </div>
                    )
                  }
                </div>
                : null
              }
              {
                response?.artists?.length ?
                <div class="linear-list">
                  <h1>Artists</h1>
                  <SwipingList content={ response?.artists } />
                </div>
                : null
              }
              {
                response?.playlists?.length ?
                <div class="linear-list">
                  <h1>Playlists</h1>
                  <SwipingList playlist content={ response?.playlists } />
                </div>
                : null
              }
            </div>
            :
            <div className="no-results">{ query.current?.value.length ? 'Nothing found' : <>Good { getHours() }, <b>{ user ?? '...' }</b>!</> }</div>
          }

          <button onClick={ signOut } class="sign-out">
            <FontAwesomeIcon icon={ faSignOutAlt } />
            &nbsp;&nbsp;Sign Out&nbsp;
            <b>{ user }</b>
          </button>
        </>
      }
    </div>
  )
}

export default Home
