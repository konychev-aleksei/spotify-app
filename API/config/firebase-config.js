import admin from 'firebase-admin'

const serviceAccount = {
  "type": "service_account",
  "project_id": "new-project-95ff8",
  "private_key_id": "480cc93d1396e3907df053d4a4e5041008626cca",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzhxdSBIEdFHqO\nLU6G0McXF/MFw7+i4Dt/phILKxRiQUM3SEOpICfOdwnuciXf7q40WufAY4WHiZ8/\nx7yt0uHCMvXk/5Io0SgJnl/AFiHZikXveRf9hYGzCj4a7d8wODt34UiP6v5uDio2\n5rCiBXEhW0g76hz+YfVNVEwF5ne2Jya7DhRymDiBa0NQJYYxLu6XNnLobd9DTYqL\n5wAIfToDgUM9QztolkVexuKF0yByN6enhxHRvOWwHoTlL6ScIi52SEoy4pSKOcji\nA+LwukttyBShHAosoXS5uXcMDtthEI3MdYtYlGo+nnwQB6P9TJSLIHSeseBpOv1H\nEWWxWP45AgMBAAECggEAD0o5AZyd2PnQpsmDy75eCHDbGzF04bS2iIx+sqoOfEBJ\n7txGG/I/xak0hLT+1gu8VTvtS0DGo3ikgiB7KLRCU0F3GRPtsTGAFxKgncncw+vv\ngSHnecl8NoEPsUgzVyZg5TjADvbRCNNGw+KBpmjvfctqE2VA5yb1ZwrAB0wdw7r8\nnV9OTUL0dwiiAyKCuWoJvPJ2SNvaCGAdk4uQHdGZd6C7ZgHtdAT8lc2zL5M7kyBv\nSF7crP5Wy6B5W/SiHU0wQ6la9OAul4YFEO6FrZpo1cKumPuE116BA3/3+N0SwRFX\ntK8E5IAvZorBuB5h1Omw5XdHiDq9E9l/SuwEC7wAoQKBgQD9agvuAVdUYnxDe4LK\nxQ2qm0pA2eHXalIh9CRzc9YBcNXHAcvdSkMNJQC1zlEKsBy+lbIf9eO8yZ+HaY27\nFCOk4V+zpFmgGQppJPJlJBhL7pIycfvNm9CY6EIgQo9H93aHNCCcRHf9+jSVKwqn\nv1nfXmAEvySIYPcWl+8BQz7Z2QKBgQC1XArimXzwzY8rIzrKsuSbrxcHQYlhlrws\nueZfo3x9lVCtc4+npGKFrwgTvgfJETone70JHm0SZ79ysZBmb3udB4w9XLPIVuY/\n/DJ4CCZZc/A9F41D50imwKPtNVX4mF+iEdiOfIY8zFmEJ0Cgbhrk3fKtHSFgJXRp\n7g1ql9krYQKBgErfISUxyj6JVpONk2gbbl1AwmCEv2Ao7plPi9F8oPcOAmto0XXR\nMhxZGWudyH3y6Js6mUUuHhoyK+sTOafTXHCjkeX+oehWXagRHXjagD82/oTe/nmS\nFsCGprrnT3QA3kk2Eoh5BkbIvO5xqBVFyOTg+leMrduJYpePTjM+TfyJAoGAQXAf\noVmegki5cug4S3E3GZGYro6QIn1AEqdVH4ce4TViMeOzntqqje/06yKzLnKf2CVG\ntSacVnrG0nyNTNjG8ocJrA5p9EyesdGu6C6Qn9A8i96WozytszVpMKsBBTz9rL3h\ntK/rw748QnnjUL/JxnDrIlmTdFyvX5V8k8yMmKECgYEA2LgFNRJbJ/Z0bgmbrUaG\ntLUepvavRrXzaJ7lZ1uCwh84fKYUW+Ec0aUjyybbax14lpv5sblyKJb4KXJ0Jura\n7A4d7zxFsgSJEYAdGSiX9PLoOrVN58OrV1FbIPMRtEvp0++w/tB28toT09Q3e/IF\nEjGhJIfPRupZMn4GbxOb+z0=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-kybbh@new-project-95ff8.iam.gserviceaccount.com",
  "client_id": "110261930102061152176",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kybbh%40new-project-95ff8.iam.gserviceaccount.com"
}


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://new-project-95ff8-default-rtdb.europe-west1.firebasedatabase.app"
})

export default admin
