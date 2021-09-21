import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import Cropper from 'react-easy-crop'
import Clipper from 'image-clipper'
import FileBase from 'react-file-base64'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faArrowUp } from '@fortawesome/free-solid-svg-icons'

import * as api from '../../api/index'
import AppContext from '../../AppContext'


const New = ({ myPlaylists, setMyPlaylists }) => {
  const { userName } = useContext(AppContext)
  const constraints = ['.', '$', '#' , '[', ']', '/' , '?', '!', '@']
  const history = useHistory()

  const [image, setImage] = useState('')
  const [name, setName] = useState('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [area, setArea] = useState({})

  const handlePlaylistCreation = async (e) => {
    e.preventDefault()
    await api.createPlaylist(name, await cropImage(), userName)
    setMyPlaylists([...myPlaylists, name])
    history.push('/')
  }

  const cropImage = () => {
    const { x, y, width, height } = area
    return new Promise((resolve, reject) => {
      Clipper(image, function() {
        this.crop(x, y, width, height)
          .resize(200, 200)
          .toDataURL((dataUrl) => resolve(dataUrl))
      })
    })
  }

  return(
    <div className="content">
      <form onSubmit={ handlePlaylistCreation } className="new">
        <label>
          <FileBase
            type="file"
            multiple={ false }
            onDone={ ({ base64 }) => setImage(base64) }
          />
          <div>Upload picture</div>
        </label>

        <div className="cropper">
          {
            image ?
            <Cropper
              image={ image }
              crop={ crop }
              zoom={ zoom }
              aspect={ 1 }
              className="cropper"
              onCropComplete={ (_, value) => setArea({...value}) }
              onCropChange={ setCrop }
              onZoomChange={ setZoom }
            />
            :
            <FontAwesomeIcon icon={ faImage } />
          }
        </div>

        <input
          value={ name }
          type="text"
          placeholder="Playlist title"
          onChange={ (e) => {
            if (e.target.value.length <= 20 && !constraints.includes(e.target.value))
              setName(e.target.value)
          }}
        />
        <p>{ name.length } / 20</p>

        <button style={{ backgroundColor: name && image && !myPlaylists.includes(name) ? '#1DB954' : '#1D1D1D' }}>
          Publish
        </button>
      </form>
    </div>
  )
}

export default New
