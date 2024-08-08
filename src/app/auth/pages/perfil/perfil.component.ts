import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarRoles, CargarUsuario } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Role } from 'src/app/core/models/role.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { FileService } from 'src/app/core/services/file.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  roles: Role[]
  usuario: Usuario
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url
  ADM = environment.ADM
  rol = this.functionsService.getLocal('role')
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private rolesService: RolesService,
    private usuariosService: UsuariosService,
    private route: ActivatedRoute,
    private fileService: FileService,
  ) {
    this.id = this.functionsService.getLocal('uid')
    this.loading = true
    this.getCatalogos()
    this.getId(this.id)
    this.createForm()
    setTimeout(() => {
      this.loading = false
    }, 1500);
  }
  getId(id: string) {
    this.usuariosService.cargarUsuarioById(id).subscribe((resp: CargarUsuario) => {
      this.usuario = resp.usuario
      setTimeout(() => {
        this.setForm(this.usuario)
      }, 500);
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Perfil')
      })
  }


  getCatalogos() {

    this.loading = true
    this.rolesService.cargarRolesAll().subscribe((resp: CargarRoles) => {
      this.roles = resp.roles

    },
      (error: any) => {

        this.functionsService.alertError(error, 'Perfil')
        this.loading = false


      })



  }
  get errorControl() {
    return this.form.controls;
  }
  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(3)]],
      apellidoMaterno: [''],
      usuario: [''],
      email: ['', [Validators.required, Validators.email]],

      img: [''],
      role: ['', [Validators.required, Validators.minLength(3)]],
      salon: [''],
      google: [false],
      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(usuario: Usuario) {
    this.loading = true
    
    let usr: any = usuario

    var role = (this.edit === 'false') ? usr.role.nombre : usr.role._id



    setTimeout(() => {

      this.form = this.fb.group({
        nombre: [usuario.nombre, [Validators.required, Validators.minLength(3)]],
        apellidoPaterno: [usuario.apellidoPaterno, [Validators.required, Validators.minLength(3)]],
        apellidoMaterno: [usuario.apellidoMaterno],
        usuario: [usuario.usuario],
        email: [usuario.email, [Validators.required, Validators.email]],
        role: [role, [Validators.required]],

        activated: [usuario.activated],
        dateCreated: [usuario.dateCreated],
        lastEdited: [this.today],
      })
      this.loading = false
    }, 1500);


  }

  onSubmit() {
    this.loading = true
    this.submited = true
    if (this.form.valid) {

      this.usuario = {
        ...this.usuario,
        ...this.form.value,


      }

      this.usuario.email = this.usuario.email.toLowerCase()
      this.usuariosService.actualizarUsuario(this.usuario).subscribe((resp: any) => {


        this.functionsService.alertUpdate('Usuarios')

        this.functionsService.navigateTo('core/users')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Usuarios')
          this.loading = false




        })
    } else {


      this.loading = false

      return  
    }






  }
  cambiarImagen(file: any) {
    this.loading = true
    this.imagenSubir = file.target.files[0]
    if (!this.imagenSubir) {
      this.imgTemp = null
      this.functionsService.alert('Usuarios', 'No se encontró imagen', 'error')
      this.loading = false

    } else {

      const reader = new FileReader()

      const url64 = reader.readAsDataURL(this.imagenSubir)
      reader.onloadend = () => {
        this.imgTemp = reader.result

      }
      this.subirImagen()

    }
  }
  subirImagen() {
    this.fileService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
      .then(
        (img) => {
          this.usuario.img = img
          this.loading = false
          this.functionsService.alertUpdate('Usuarios')
          //message
        },
        (err) => {

          this.loading = false
          this.functionsService.alertError(err,'Perfil')
        },
      )
  }

  back() {
    this.functionsService.navigateTo('/core')
  }

}
