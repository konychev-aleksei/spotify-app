import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'


const BestResult = ({ trackInfo, toggleTrack, playing, currentTrackId }) => {
  const { _id, artists, name, duration, thumb } = trackInfo
  const isCurrentTrack = currentTrackId === _id

  return(
    <div>
      <img src={ thumb } alt="" />
      <button onClick={ () => toggleTrack(trackInfo) } class="round">
        {
          playing && isCurrentTrack ?
          <FontAwesomeIcon icon={ faPause } />
          :
          <FontAwesomeIcon icon={ faPlay } />
        }
      </button>
      <h1>{ name }</h1>
      <p>{ artists }</p>
    </div>
  )
}

export default BestResult
