import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faPlus, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

import * as api from '../../api/index'

import AppContext from '../../AppContext'


const MainMenu = ({ additionMode, setAdditionMode, playlistsInAdditionMode, setPlaylistsInAdditionMode, myPlaylists, setMyPlaylists, innerWidth }) => {
  const history = useHistory()
  const { userName, showPlaylists, setShowPlaylists } = useContext(AppContext)

  const handlePlaylistAddition = (name) => {
    const playlists = new Set(playlistsInAdditionMode)

    playlists.has(name) ? playlists.delete(name) : playlists.add(name)
    setPlaylistsInAdditionMode([...playlists])
  }

  const handleEnableTracksAddition = async () => {
    playlistsInAdditionMode.forEach(async (playlist) => {
      await api.addTrackToPlaylist(playlist, additionMode._id)
    })
    handleDisableTracksAddition()
  }

  const handleDisableTracksAddition = async () => {
    setAdditionMode({ enabled: false, _id: null })
    setPlaylistsInAdditionMode([])

    if (innerWidth <= 950) {
      setShowPlaylists(false)
    }
  }

  const handlePlaylistClick = (name) => {
    if (additionMode.enabled) {
      handlePlaylistAddition(name)
    }
    else {
      if (innerWidth <= 950) {
        setShowPlaylists(false)
      }
      history.push(`/playlist/${name}`)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.getMyPlaylists(userName)
      setMyPlaylists(response.data)
    }

    fetchData()
  }, [])

  return(
    <>
      {
        showPlaylists ?
        <>
          <div class="menu">
            <div class="main-menu">
              <button onClick={ () => history.push('/') }>
                <FontAwesomeIcon icon={ faHome } />
                &nbsp;&nbsp;&nbsp;HOME
              </button>
              <button onClick={ () => history.push('/new') }>
                <FontAwesomeIcon icon={ faPlus } />
                &nbsp;&nbsp;&nbsp;CREATE PLAYLIST
              </button>
            </div>
            <div class="add-playlists">
              {
                additionMode.enabled ?
                <>
                  <button onClick={ handleEnableTracksAddition }>
                    <FontAwesomeIcon icon={ faCheck } />
                  </button>
                  <button onClick={ handleDisableTracksAddition }>
                    <FontAwesomeIcon icon={ faTimes } />
                  </button>
                </>
                : null
              }
            </div>
          </div>


          <div class="my-playlists">
            {
              myPlaylists?.map((playlist, index) =>
                <button onClick={ () => handlePlaylistClick(playlist) }>
                  { index === 0 ? <>Liked Tracks</> : playlist }
                  {
                    additionMode.enabled ?
                    playlistsInAdditionMode.includes(playlist) ? <div class="add-here chosen" /> : <div class="add-here" />
                    : null
                  }
                </button>
              )
            }
          </div>
        </>
        : null
      }
    </>
  )
}

export default MainMenu
