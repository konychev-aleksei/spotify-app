import React, { useState, useEffect, useContext, useRef } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, Link, useHistory } from 'react-router-dom'

import './styles/design.css'
import './styles/layout.css'

import Topbar from './components/major/Topbar'
import Playbar from './components/major/Playbar'
import MainMenu from './components/major/MainMenu'
import Home from './components/major/Home'
import Playlist from './components/major/Playlist'
import New from './components/major/New'
import SignIn from './components/major/SignIn'

import InitialThumb from './initial.jpg'
import InitialTrack from './intro.mp3'

import AppContext from './AppContext'

import { auth } from './firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

import * as api from './api/index'

const initialTrack = {
  _id: InitialTrack,
  artists: 'NCS',
  name: 'Intro',
  duration: '01:12',
  thumb: InitialThumb,
}


const useWindowInnerWidth = () => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setInnerWidth(window.innerWidth)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return innerWidth
}


const NoMatch = () => {
  const history = useHistory()
  useEffect(() => history.push('/'), [])
  return null
}


const App = () => {
  const innerWidth = useWindowInnerWidth()
  const [user] = useAuthState(auth)

  const [showPlaylists, setShowPlaylists] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const [currentPlaylist, setCurrentPlaylist] = useState({ _id: null, tracks: [], index: -1 })
  const [myPlaylists, setMyPlaylists] = useState([])
  const [additionMode, setAdditionMode] = useState({ enabled: false, _id: null })
  const [playlistsInAdditionMode, setPlaylistsInAdditionMode] = useState([])
  const [playing, setPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(initialTrack)
  const audioRef = useRef()

  const toggleTrack = (trackInfo) => {
    if (audioRef.current.src === trackInfo._id) {
      handlePlayback()
    }
    else {
      audioRef.current.src = trackInfo._id
      audioRef.current.onloadedmetadata = () => audioRef.current.play()
      setPlaying(true)
    }

    setCurrentTrack(trackInfo)
  }

  const handlePlayback = () => {
    audioRef.current.paused ? audioRef.current.play() : audioRef.current.pause()
    setPlaying(!audioRef.current.paused)
  }

  const handleTrackAddition = () => {
    setAdditionMode({ enabled: false, _id: null })
  }

  useEffect(() => setShowPlaylists(innerWidth > 950), [innerWidth])

  useEffect(() => {
    const createAccount = async () => await api.createAccount(user?.email?.replace('@gmail.com', ''))

    if (user) {
      user.getIdToken()
        .then((idToken) => window.sessionStorage.setItem("auth", idToken))
        .catch((e) => console.error(e))

      createAccount()
    }
  }, [user])


  const value = {
    currentPlaylist,
    setCurrentPlaylist,
    user: user?.displayName.split(' ')[0],
    userName: user?.email?.replace('@gmail.com', ''),
    showPlaylists,
    setShowPlaylists
  }


  return(
    <AppContext.Provider value={ value }>
      {
        user || api.getToken() ?
        <>
          <audio ref={ audioRef } src={ currentTrack._id } />
          <BrowserRouter>
            <Switch>
              <Route exact path="/">
                <Home
                  audioRef={ audioRef }
                  setCurrentTrack={ setCurrentTrack }
                  playing={ playing }
                  setPlaying={ setPlaying }
                  currentTrackId={ currentTrack._id }
                  toggleTrack={ toggleTrack }
                  setAdditionMode={ setAdditionMode }
                />
              </Route>
              <Route exact path="/artist/:name">
                <Playlist
                  handlePlayback={ handlePlayback }
                  toggleTrack={ toggleTrack }
                  playing={ playing }
                  setPlaying={ setPlaying }
                  currentTrackId={ currentTrack._id }
                  setAdditionMode={ setAdditionMode }
                />
              </Route>
              <Route exact path="/playlist/:name">
                <Playlist
                  playlist
                  handlePlayback={ handlePlayback }
                  toggleTrack={ toggleTrack }
                  playing={ playing }
                  setPlaying={ setPlaying }
                  currentTrackId={ currentTrack._id }
                  setAdditionMode={ setAdditionMode }
                  myPlaylists={ myPlaylists }
                  setMyPlaylists={ setMyPlaylists }
                />
              </Route>
              <Route exact path="/new">
                <New
                  myPlaylists={ myPlaylists }
                  setMyPlaylists={ setMyPlaylists }
                />
              </Route>
              <Route path="*">
                <NoMatch />
              </Route>
            </Switch>
            <MainMenu
              playlistsInAdditionMode={ playlistsInAdditionMode }
              setPlaylistsInAdditionMode={ setPlaylistsInAdditionMode }
              additionMode={ additionMode }
              setAdditionMode={ setAdditionMode }
              myPlaylists={ myPlaylists }
              setMyPlaylists={ setMyPlaylists }
              innerWidth={ innerWidth }
            />
            <Topbar />
            <Playbar
              handlePlayback={ handlePlayback }
              currentTrack={ currentTrack }
              audioRef={ audioRef }
              playing={ playing }
              setPlaying={ setPlaying }
              toggleTrack={ toggleTrack }
            />
          </BrowserRouter>
        </>
        :
        <SignIn />
      }
    </AppContext.Provider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
