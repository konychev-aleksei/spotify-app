import express from 'express'
import mongoose from 'mongoose'

import User from '../models/User.js'
import Playlist from '../models/Playlist.js'
import Track from '../models/Track.js'


//special POST request
export const uploadTracks = async (req, res) => {
  const { tracks } = req.body

  try {
    await Promise.all(
      tracks.map(async ({_id, artists, name, duration, thumb}) => {
        const track = new Track({
          _id,
          artists,
          name,
          duration,
          thumb
        })
        await track.save()
      })
    )
    res.status(200).json('Tracks are uploaded')
  }
  catch (e) {
    console.error(e)
  }
}


//Other requests
export const createAccount = async (req, res) => {
  const { userName } = req.body
  const user = await User.findById(userName)

  try {
    if (!user) {
      const newUser = new User({ _id: userName, playlists: [`Liked tracks of ${userName}`] })
      await newUser.save()

      const likedTracksPlaylist = new Playlist({
        _id: `Liked tracks of ${userName}`,
        tracks: [],
        thumb: '',
        owner: userName
      })
      await likedTracksPlaylist.save()
    }
    res.status(200).json('The account is created')
  }
  catch (e) {
    res.status(409).json({ message: e })
  }
}


export const createPlaylist = async (req, res) => {
  const { name, userName, base64 } = req.body
  try {
    const newPlaylist = new Playlist({
      _id: name,
      tracks: [],
      thumb: base64,
      owner: userName
    })

    const playlist = await Playlist.findById(name)

    if (!playlist) {
      await newPlaylist.save()

      const user = await User.findById(userName)
      user.playlists.push(name)

      await User.findByIdAndUpdate(userName, user)
    }

    res.status(200).json('OK')
  }
  catch (e) {
    res.status(409).json({ message: e })
  }
}


export const deletePlaylist = async (req, res) => {
  const { name, userName } = req.body

  try {
    await Playlist.findByIdAndRemove(name)

    const user = await User.findById(userName)
    user.playlists.splice(user.playlists.indexOf(name), 1)

    await User.findByIdAndUpdate(userName, user)

    res.status(200).json('The playlist is deleted')
  }
  catch (e) {
    res.status(409).json({ message: e })
  }
}


export const addPlaylist = async (req, res) => {
  const { userName, name } = req.body

  try {
    const user = await User.findById(userName)
    user.playlists.push(name)

    await User.findByIdAndUpdate(userName, user)

    res.status(200).json('OK')
  }
  catch (e) {
    res.status(409).json({ message: e })
  }
}


export const removePlaylist = async (req, res) => {
  const { userName, name } = req.body

  try {
    const user = await User.findById(userName)
    user.playlists.splice(user.playlists.indexOf(name), 1)

    await User.findByIdAndUpdate(userName, user)

    res.status(200).json('OK')
  }
  catch (e) {
    res.status(409).json({ message: e })
  }
}


export const runSearch = async (req, res) => {
  const { query } = req.body

  try {
    const searchRequest = await Track.find({
      $or: [
        { artists : { $regex : query, $options : "i" } },
        { name : { $regex : query, $options : "i" } }
      ]
    })

    let artists = new Set()
    searchRequest.forEach(i => {
      i.artists.split(', ').forEach( j => artists.add(j) )
    })

    const playlists = await Playlist.find({
      $or: [
          { _id : { $regex : query, $options : "i" } },
          { owner : { $regex : query, $options : "i" } }
      ]
    })


    res.status(200).json({
      tracks: searchRequest.slice(0, 5),
      artists: [...artists].slice(0, 7),
      playlists: playlists.slice(0, 7).filter(({ _id }) => _id.substring(0, 12).toLowerCase() !== 'liked tracks')
    })
  } catch (e) {
    res.status(404).json({ message: e.message })
  }
}


export const getArtist = async (req, res) => {
  const { name } = req.body

  try {
    const tracks = await Track.find({ artists : { $regex : name, $options : "i" } })

    res.status(200).json({ tracks })
  }
  catch (e) {
    res.status(409).json({ message: e })
  }
}


export const getPlaylist = async (req, res) => {
  const { name } = req.body

  const tracks = []
  try {
    const playlist = await Playlist.findById(name)
    await Promise.all(
      playlist.tracks.map(async (_id) => {
        const track = await Track.findById(_id)
        tracks.push(track)
      })
    )

    res.status(200).json({ thumb: playlist.thumb, owner: playlist.owner, tracks })
  }
  catch (e) {
    res.status(409).json({ message: e })
  }
}

export const addTrackToPlaylist = async (req, res) => {
  const { _id, name } = req.body

  try {
    const track = await Track.findById(_id)
    const playlist = await Playlist.findById(name)

    if (!playlist.tracks.includes(_id)) {
      playlist.tracks.push(_id)
      await Playlist.findByIdAndUpdate(name, playlist)
    }

    res.status(200).json('OK')
  }
  catch (e) {
    res.status(409).json({ message: e })
  }
}

export const deleteTrackFromPlaylist = async (req, res) => {
  const { _id, name } = req.body

  try {
    const track = await Track.findById(_id)
    const playlist = await Playlist.findById(name)

    playlist.tracks.splice(playlist.tracks.indexOf(_id), 1)
    await Playlist.findByIdAndUpdate(name, playlist)

    res.status(200).json('OK')
  }
  catch (e) {
    res.status(409).json({ message: e })
  }
}

export const rearrangePlaylist = async (req, res) => {
  const { name, sp } = req.body

  try {
    const playlist = await Playlist.findById(name)

    const temp = playlist.tracks[sp[0]]
    playlist.tracks[sp[0]] = playlist.tracks[sp[1]]
    playlist.tracks[sp[1]] = temp

    console.table(sp)

    await Playlist.findByIdAndUpdate(name, playlist)
    res.status(200).json('OK')
  }
  catch (e) {
    res.status(409).json({ message: e })
  }
}

export const getMyPlaylists = async (req, res) => {
  const { userName } = req.body

  try {
    const playlists = await User.findById(userName)
    res.status(200).json(playlists.playlists)
  }
  catch (e) {
    res.status(409).json({ message: e })
  }
}

/*
export const createPlaylist = async (req, res) => {
  try {
    res.status(200).json('OK')
  }
  catch (e) {
    res.status(409).json({ message: e })
  }
}
*/
