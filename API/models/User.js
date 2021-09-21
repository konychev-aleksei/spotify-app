import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  _id: String,
  playlists: [String]
})

const User = mongoose.model('User', userSchema)

export default User
