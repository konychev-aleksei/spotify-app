import mongoose from 'mongoose'

const playlistSchema = mongoose.Schema({
  _id: String,
  tracks: [String],
  thumb: String,
  owner: String
})

const Playlist = mongoose.model('Playlist', playlistSchema)

export default Playlist
