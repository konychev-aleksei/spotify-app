import express from 'express'

import auth from './middleware/auth.js'

import {  createAccount,
          uploadTracks,
          createPlaylist,
          deletePlaylist,
          addPlaylist,
          removePlaylist,
          runSearch,
          getArtist,
          getPlaylist,
          rearrangePlaylist,
          addTrackToPlaylist,
          getMyPlaylists,
          deleteTrackFromPlaylist
        } from './controllers/index.js'

const router = express.Router()

//special POST request
router.post('/uploadtracks', uploadTracks)


//POST requests
router.post('/createaccount', auth, createAccount)
router.post('/rearrangeplaylist', auth, rearrangePlaylist)

router.post('/createplaylist', auth, createPlaylist)
router.post('/deleteplaylist', auth, deletePlaylist)

router.post('/addplaylist', auth, addPlaylist)
router.post('/removeplaylist', auth, removePlaylist)

router.post('/addtracktoplaylist', auth, addTrackToPlaylist)
router.post('/deletetrackfromplaylist', auth, deleteTrackFromPlaylist)

router.post('/getmyplaylists', auth, getMyPlaylists)


//GET requests
router.post('/runsearch', runSearch)
router.post('/getartist', getArtist)
router.post('/getplaylist', getPlaylist)


export default router
