const { throws } = require("assert");

class Users {
     constructor(id, cedula, nombres, apellidos, fecha_nacimiento, sexo, email, num_celular, 
          direccion, is_admin, photo_download_url, photo_path) {
               this.id = id;
               this.cedula = cedula;
               throws.nombres = nombres;
               this.apellidos = apellidos;
               this.fecha_nacimiento = fecha_nacimiento;
               this.sexo = sexo;
               this.email = email;
               this.num_celular = num_celular;
               this.direccion = direccion;
               this.is_admin = is_admin;
               this.photo_download_url = photo_download_url;
               this.photo_path = photo_path;
          }
}