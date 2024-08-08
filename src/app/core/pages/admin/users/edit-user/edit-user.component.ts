import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarDepartamentos, CargarEmpresas, CargarPuestos, CargarRoles, CargarUsuario, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Departamento } from 'src/app/core/models/departamento.model';
import { Empresa } from 'src/app/core/models/Empresa';
import { Puesto } from 'src/app/core/models/puesto.model';
import { Role } from 'src/app/core/models/role.model';

import { Usuario } from 'src/app/core/models/usuario.model';
import { DepartamentosService } from 'src/app/core/services/departamentos.service';
import { FileService } from 'src/app/core/services/file.service';
import { PuestosService } from 'src/app/core/services/puesto.service';
import { EmpresasService } from 'src/app/core/services/puesto.service copy';
import { RolesService } from 'src/app/core/services/roles.service';

import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined

  roles: Role[]
  empresas: Empresa[]
  puestos: Puesto[]
  usuarios: Usuario[] = []
  departamentos: Departamento[]
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
  SUP = environment.SUP

  rol = this.functionsService.getLocal('role')
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,

    private rolesService: RolesService,
    private puestosService: PuestosService,
    private departamentosService: DepartamentosService,
    private usuariosService: UsuariosService,
    private empresasService: EmpresasService,
    private route: ActivatedRoute,
    private fileService: FileService,
  ) {
    this.id = this.route.snapshot.params['id']

    this.edit = this.route.snapshot.params['edit']
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
      console.log('this.usuario', this.usuario)
      setTimeout(() => {

        this.setForm(this.usuario)
      }, 500);

    },
      (error: any) => {
        this.functionsService.alertError(error, 'Usuarios')



      })
  }


  getCatalogos() {

    this.loading = true
    this.empresasService.cargarEmpresasAll().subscribe((resp: CargarEmpresas) => {
      this.empresas = resp.empresas
   

    },
      (error: any) => {
        this.functionsService.alertError(error, 'Empresas')

        this.loading = false


      })
    this.rolesService.cargarRolesAll().subscribe((resp: CargarRoles) => {
      this.roles = resp.roles

    },
      (error: any) => {
        this.functionsService.alertError(error, 'Roles')

        this.loading = false


      })
    this.departamentosService.cargarDepartamentosAll().subscribe((resp: CargarDepartamentos) => {
      this.departamentos = resp.departamentos

    },
      (error: any) => {
        this.functionsService.alertError(error, 'Departamentos')

        this.loading = false


      })
    this.puestosService.cargarPuestosAll().subscribe((resp: CargarPuestos) => {
      this.puestos = resp.puestos

    },
      (error: any) => {
        this.functionsService.alertError(error, 'Puestos')

        this.loading = false


      })
    this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
      resp.usuarios.forEach((usr: any) => {
        usr.role.forEach(rl => {
          if (rl.clave === this.SUP) {
            this.usuarios.push(usr)
          }
        });
      });





    },
      (error: any) => {
        this.functionsService.alertError(error, 'Usuarios')

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
      puesto: [''],
      departamento: [''],
      supervisor: [''],
      empresa: [''],
      google: [false],
      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(usuario: any) {
    this.loading = true

    let usr: any = usuario

    var role = (this.edit === 'false') ? usr.role.nombre : usr.role._id

    let roles = []
    usuario.role.forEach(rol => {
      roles.push(rol._id)

    });
    var empresa = (this.edit === 'false') ? usr.empresa.nombre : usr.empresa._id

    let empresas = []
    usuario.empresa.forEach(empresa => {
      console.log('empresa', empresa)
      empresas.push(empresa)
      
    });
    console.log('usuario.empres', empresas)


    setTimeout(() => {
      this.form = this.fb.group({
        nombre: [usuario.nombre, [Validators.required, Validators.minLength(3)]],
        apellidoPaterno: [usuario.apellidoPaterno, [Validators.required, Validators.minLength(3)]],
        apellidoMaterno: [usuario.apellidoMaterno],
        usuario: [usuario.usuario],
        email: [usuario.email, [Validators.required, Validators.email]],
        role: [roles, [Validators.required]],
        puesto: [usuario.puesto ? usuario.puesto._id : '', [Validators.required]],
        departamento: [usuario.departamento ? usuario.departamento._id : '', [Validators.required]],
        supervisor: [usuario.supervisor ? usuario.supervisor._id : '', [Validators.required]],
        empresa: [empresas, [Validators.required]],
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

    if (!file.target.files[0]) {
      this.imgTemp = null
      this.functionsService.alert('Usuarios', 'No se encontró imagen', 'error')
      this.loading = false

    } else {


      const reader = new FileReader()
      const url64 = reader.readAsDataURL(file.target.files[0])

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
          this.functionsService.alert('Usuarios', 'Error al subir la imagen', 'error')
        },
      )
  }

  back() {
    this.functionsService.navigateTo('core/users')
  }

}
