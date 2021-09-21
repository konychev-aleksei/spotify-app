import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import InitialThumb from '../../initial.jpg'

import * as api from '../../api/index'
import Track from '../minor/Track'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Loader from 'react-loader-spinner'

import HeartImage from '../../heart.jpg'

import AppContext from '../../AppContext'


const MainPlaylistButton = ({ handlePlaylistListening, playing, response, currentTrackId }) => {
  return(
    <button onClick={ handlePlaylistListening } class="round">
      {
        playing && response?.tracks?.length && response?.tracks?.map((item) => item._id).includes(currentTrackId) ?
        <FontAwesomeIcon icon={ faPause } />
        :
        <FontAwesomeIcon icon={ faPlay } />
      }
    </button>
  )
}


const PlaylistLikeButton = ({ playlist, isLikedTracks, liked, handleLike }) => {
  return(
    <button onClick={ handleLike } class="round transparent">
      {
        liked || !playlist ?
        <FontAwesomeIcon style={{ color: isLikedTracks || !playlist ? '#555' : null }} icon={ faHeart } />
        :
        <FontAwesomeIcon icon={ farHeart } />
      }
    </button>
  )
}

const Thumbs = ({ src }) => {
  return(
    <>
      <img draggable="false" class="back" src={ src } />
      <img draggable="false" class="front" src={ src } />
    </>
  )
}

const Playlist = ({ playlist, playing, setPlaying, toggleTrack, currentTrackId, handlePlayback, setAdditionMode, myPlaylists, setMyPlaylists }) => {
  const history = useHistory()
  const { userName, currentPlaylist, setCurrentPlaylist } = useContext(AppContext)
  const { name } = useParams()

  const [fetching, setFetching] = useState(true)
  const [liked, setLiked] = useState(false)
  const [response, setResponse] = useState([])

  const likedTracks = 'Liked Tracks',
        isLikedTracks = name.toLowerCase() === `liked tracks of ${userName}`,
        inMyPlaylist = playlist && response.owner === userName

  const handlePlaylistListening = () => {
    if (!response.tracks.length) {
      return
    }

    if (response.tracks.map(({ _id }) => _id).includes(currentTrackId)) {
      handlePlayback()
    }
    else if (response.tracks.length) {
      toggleTrack(response.tracks[0])
    }
  }

  const handleLike = async () => {
    if (isLikedTracks || !playlist) {
      return
    }

    setLiked(!liked)

    if (liked) {
      await api.removePlaylist(userName, name)
      setMyPlaylists(myPlaylists.filter((playlist) => playlist !== name))
    }
    else {
      await api.addPlaylist(userName, name)
      setMyPlaylists([...myPlaylists, name])
    }
  }

  const handleName = () => {
    return playlist ?
    isLikedTracks ?
      likedTracks
      :
      name
    :
    name
  }

  const handleOnDragEnd = async (result) => {
    if (!result.destination)
      return

    const tracks = [...response?.tracks]
    const [reorderedItem] = tracks.splice(result.source.index, 1)
    tracks.splice(result.destination.index, 0, reorderedItem)

    setResponse({ ...response, tracks })

    if (playlist) {
      setCurrentPlaylist({ _id: name, tracks, index: result.destination.index })
      await api.rearrangeTracks(name, result.source.index, result.destination.index)
    }
  }

  const getThumbSrc = () => {
    if (isLikedTracks) {
      return HeartImage
    }
    else if (playlist) {
      return response.thumb
    }
    else {
      return `/artists/${name}.jpg`
    }
  }

  const handleAddition = async (__id) => {
    const tracks = response.tracks.filter(({ _id }) => _id !== __id)

    setResponse({ ...response, tracks })
    setCurrentPlaylist({ _id: name, tracks, index: currentPlaylist.index })
    await api.deleteTrackFromPlaylist(name, __id)

    if (!tracks.length)
      handlePlayback()
  }

  useEffect(() => {
    const fetchData = async () => {
      const __response = await (playlist ? api.getPlaylist(name) : api.getArtist(name))
      setResponse(__response.data)

      if (!__response.data) {
        history.push('/')
      }

      setFetching(false)
      setLiked(myPlaylists?.includes(name))
      setCurrentPlaylist({ _id: name, tracks: __response.data.tracks, index: 0 })
    }

    setFetching(true)
    fetchData()
  }, [name])


  return(
    <div class="content">
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
          <Thumbs src={ getThumbSrc() } />
          <div className="playlist-info">
            <h2>{ playlist ? <>PLAYLIST</> : <>ARTIST</> }</h2>
            <h1>{ handleName() }</h1>
            <div className="playlist-controls">
              <MainPlaylistButton
                handlePlaylistListening={ handlePlaylistListening }
                playing={ playing }
                response={ response }
                currentTrackId={ currentTrackId }
              />
              <PlaylistLikeButton
                playlist={ playlist }
                isLikedTracks={ isLikedTracks }
                liked={ liked }
                handleLike={ handleLike }
              />
            </div>
          </div>

          <DragDropContext onDragEnd={ handleOnDragEnd }>
            <Droppable droppableId="tracks-list">
              {(provided) => (
                <div className="tracks-list in-playlist" {...provided.droppableProps} ref={provided.innerRef}>
                  {response?.tracks?.map((trackInfo, index) => {
                    return (
                      <Draggable key={ trackInfo._id } draggableId={ trackInfo._id } index={ index }>
                        {(provided) => (
                          <div
                            className="track-in"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Track
                              playing={ playing }
                              setPlaying={ setPlaying }
                              index={ index }
                              trackInfo={ trackInfo }
                              inMyPlaylist={ inMyPlaylist }
                              toggleTrack={ toggleTrack }
                              currentTrackId={ currentTrackId }
                              setAdditionMode={ setAdditionMode }
                              handleAddition={ handleAddition }
                            />
                          </div>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </>
      }
    </div>
  )
}

export default Playlist
