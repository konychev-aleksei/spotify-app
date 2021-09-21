import admin from '../config/firebase-config.js'

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodeValue = await admin.auth().verifyIdToken(token)

    if (decodeValue) {
      return next()
    }

    res.status(403)
  }
  catch (e) {
    res.status(400)
  }
}

export default auth
