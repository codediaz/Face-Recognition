const admin = require('firebase-admin');

var serviceAccount = require('./sekdevs-firebase-adminsdk-9fvuk-ccac9aa3f1.json')

const admin_fb = admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     storageBucket: 'sekdevs.appspot.com'
});

module.exports = admin_fb;
