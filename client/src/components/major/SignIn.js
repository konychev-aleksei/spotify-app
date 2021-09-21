import React from 'react'

import Wave from 'react-wavify'
import Particles from 'react-particles-js'
import firebase from 'firebase'
import { auth } from '../../firebase'


const SignIn = () => {
  const signIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return (
    <>
      <div className="free">
        <Particles className="particles" />
      </div>
      <Wave fill='#1DB954'
            className="wave"
            paused={false}
            options={{
              amplitude: 30,
              speed: 0.3,
              points: 3
            }}
      />
      <img
        draggable="false"
        src={ 'desktop.png' }
        className="desktop"
      />
      <img
        draggable="false"
        src={ 'mobile.png' }
        className="mobile"
      />

      <div className="title">
        <h1>Spotify App Clone</h1>
        <p>
          <b>Create</b> your own or add other users playlists, <b>order</b> tracks in the way <b>you</b> want and enjoy latest releases of <b>NCS!</b> 
        </p>
        <button onClick={ signIn }>Sign in with Google</button>
      </div>
    </>
  )
}

export default SignIn
