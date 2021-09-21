import mongoose from 'mongoose'

const trackSchema = mongoose.Schema({
  _id: String,
  artists: String,
  name: String,
  duration: String,
  thumb: String
})

const Track = mongoose.model('Track', trackSchema)

export default Track
