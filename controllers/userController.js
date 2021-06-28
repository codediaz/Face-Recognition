'use strict';

const firebase = require('../db');
const admin = require('../admin_fb');
const User = require('../models/users');
const firestore = firebase.firestore();
const storage = admin.storage().bucket();
const firebase_auth = firebase.auth();
const admin_auth = admin.auth();
const uuid = require('uuid-v4');


const createUser = async (req, res, next) => {
     try {
          const data = req.body;
          const userData = await admin_auth.createUser({email: data.email, password: data.cedula});

          let user_uuid = uuid();
          const metadata = {
               metadata: {
                 // This line is very important. It's to create a download token.
                 firebaseStorageDownloadTokens: user_uuid
               },
               contentType: 'image/png',
               cacheControl: 'public, max-age=31536000',
             };

          const userStorage = await storage.upload('C:/Users/JOVEN EJEMPLAR/Desktop/Kevin Aguirre/UPS/Septimo Semestre/1. IHM/IHMproject/FaceRecognitionProject/ImagesBasic/sergio-diaz.png', 
                              {destination: 'users/' + userData.uid + '/' + userData.uid + '.png',
                              gzip: true, 
                              metadata: metadata});

          const file = userStorage[0];

          const built_dwnld_url = "https://firebasestorage.googleapis.com/v0/b/" + storage.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + user_uuid;

          const built_path = 'gs://' + storage.name + '/' + file.name;
          
               
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
          res.send(built_dwnld_url);
          res.send(built_path);
     } catch (error) {
          res.status(400).send(error.message)
     }
}

module.exports = {
     createUser
}