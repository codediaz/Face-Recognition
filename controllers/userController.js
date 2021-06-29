'use strict';

const firebase = require('../db');
const admin = require('../admin_fb');
const User = require('../models/users');
const firestore = firebase.firestore();
const storage = admin.storage().bucket();
const firebase_auth = firebase.auth();
const admin_auth = admin.auth();
const uuid = require('uuid-v4');
const fs = require('fs')


const createUser = async (req, res, next) => {
     try {
          const data = req.body;
          // Add user to firebase Authentication
          const userData = await admin_auth.createUser({email: data.email, password: data.cedula});

          // Store user image to Firebase Storage
          let user_uuid = uuid();
          const metadata = {
               metadata: {
                    // This line is very important. It's to create a download token.
                    firebaseStorageDownloadTokens: user_uuid
                    },
               contentType: 'image/png',
               cacheControl: 'public, max-age=31536000',
          };

          // Path where the photo will be uploaded
          const built_path = 'users/' + userData.uid + '/' + userData.uid + '.png'
          
          // Upload photo
          await storage.upload(
               data.user_photo, 
               {destination: built_path,
                    gzip: true, 
                    metadata: metadata
               });

          // Create download url for the user photo
          //const file = userStorage[0];
          const built_dwnld_url = "https://firebasestorage.googleapis.com/v0/b/" + storage.name + "/o/" + encodeURIComponent(built_path) + "?alt=media&token=" + user_uuid;

          //Store all the user information in the users collections in Firestore  
          await firestore.collection('users').doc(userData.uid).set({
               nombres: data.nombres,
               apellidos: data.apellidos,
               fecha_nacimiento: data.fecha_nacimiento,
               sexo: data.sexo,
               num_celular: data.num_celular,
               address: data.direccion,
               isAdmin: data.is_admin,
               photo_download_url: built_dwnld_url,
               photo_path: built_path
               });
                    
          res.send('Created new user with uid:' + userData.uid);
     } catch (error) {
          res.status(400).send(error.message)
     }
}

module.exports = {
     createUser
}