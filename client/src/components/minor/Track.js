import React, { useState, useContext } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

import AppContext from '../../AppContext'


const ShowIcon = ({ playing, isCurrentTrack }) => {
  return(
    <>
    {
      playing && isCurrentTrack ?
      <FontAwesomeIcon icon={ faPause } />
      :
      <FontAwesomeIcon icon={ faPlay } />
    }
    </>
  )
}


const Track = ({ trackInfo, inMyPlaylist, index, toggleTrack, playing, setPlaying, currentTrackId, setAdditionMode, handleAddition }) => {
  const [visibleButton, setVisibleButton] = useState()
  const { setShowPlaylists } = useContext(AppContext)
  const { _id, artists, name, duration, thumb } = trackInfo

  const handleTrack = (_id) => {
    if (inMyPlaylist) {
      handleAddition(_id)
    }
    else {
      setShowPlaylists(true)
      setAdditionMode({ enabled: true, _id })
    }
  }

  return(
    <div
      className="track"
      onMouseOver={ () => setVisibleButton(true) }
      onMouseLeave={ () => setVisibleButton(false) }
    >
      <button onClick={ () => toggleTrack(trackInfo, index) }>
      {
        visibleButton || currentTrackId === _id ?
        <ShowIcon
          isCurrentTrack={ currentTrackId === _id }
          playing={ playing }
        />
        :
        index + 1
      }
      </button>
      <img src={ thumb } />
      <div>
        <h1>{ name }</h1>
        <p>{ artists }</p>
      </div>
      <button onClick={ () => handleTrack(_id) }>
        {
          inMyPlaylist ?
          <FontAwesomeIcon icon={ faTrash } />
          :
          <FontAwesomeIcon icon={ faPlus } />
        }
      </button>
      <h2>{ duration }</h2>
    </div>
  )
}

export default Track
