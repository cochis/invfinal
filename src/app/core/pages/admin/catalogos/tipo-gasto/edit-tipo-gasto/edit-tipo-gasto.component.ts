import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarEmpresas, CargarTipoGasto, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Empresa } from 'src/app/core/models/Empresa';
import { TipoGasto } from 'src/app/core/models/tipoGasto.model';
import { EmpresasService } from 'src/app/core/services/puesto.service copy';
import { TipoGastoService } from 'src/app/core/services/tipoGasto.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';



import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-tipo-gasto',
  templateUrl: './edit-tipo-gasto.component.html',
  styleUrls: ['./edit-tipo-gasto.component.css']
})
export class EditTipoGastoComponent {
  loading = false

  ADM = environment.ADM
  CTB = environment.CTB
  CTM = environment.CTM
  PGP = environment.PGP
  public imagenSubir!: File
  public imgTemp: any = undefined
  empresas: Empresa[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  tipoGasto: TipoGasto
  usuarios: TipoGasto[]
  id!: string
  edit: string = 'false'
  estadoInicial!: string
  url = environment.base_url
  addPicture = false
  img = 'default.jpg'
  uid: string = this.functionsService.getLocal('uid')
  rol: string = this.functionsService.getLocal('role')
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private empresasService: EmpresasService,
    private tipoGastosService: TipoGastoService,
    private usuariosService: UsuariosService,
    private route: ActivatedRoute,
  ) {
    this.empresasService.cargarEmpresasAll().subscribe((resp: CargarEmpresas) => {
      this.empresas = resp.empresas
      // console.log('this.empresas::: ', this.empresas);
    })
    this.createForm()
    this.getCatalogos()

    this.id = this.route.snapshot.params['id']
    this.edit = this.route.snapshot.params['edit']
    this.loading = true
    this.getId(this.id)
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 1500);
  }
  getId(id: string) {
    this.loading = true
    this.tipoGastosService.cargarTipoGastoById(id).subscribe((resp: any) => {

      this.tipoGasto = resp.tipoGasto
      setTimeout(() => {
        this.setForm(this.tipoGasto)
      }, 500);

    },
      (error: any) => {
        this.loading = false
        this.functionsService.alertError(error, 'Carga')


      })
  }


  createForm() {
    this.form = this.fb.group({
      empresa: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      aprobacionPor: ['', [Validators.required]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(tipoGasto: any) {
    this.form = this.fb.group({
      empresa: [tipoGasto.empresa, [Validators.required, Validators.minLength(3)]],
      nombre: [tipoGasto.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [tipoGasto.clave, [Validators.required, Validators.minLength(3)]],
      aprobacionPor: [tipoGasto.aprobacionPor._id, [Validators.required]],
      activated: [tipoGasto.activated],
      dateCreated: [tipoGasto.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
  

    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Roles')
      this.loading = false
      return
    }


    if (this.form.valid) {

      this.tipoGasto = {
        ...this.tipoGasto,
        ...this.form.value,


      }

      // console.log('this.tipoGasto', this.tipoGasto)
      this.tipoGastosService.actualizarTipoGasto(this.tipoGasto).subscribe((resp: any) => {
        this.functionsService.alertUpdate('TipoGasto')
        this.functionsService.navigateTo('core/catalogos/tipo-gasto')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Tipo de carga')
          this.loading = false


        })
    } else {
      this.functionsService.alertForm('Tipo de carga')
      this.loading = false

      return
    }





  }
  getCatalogos() {
    this.loading = true
    this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
      this.usuarios = []
      resp.usuarios.forEach(usuario => {
        let usr: any
        usr = usuario

        usr.role.forEach(rol => {


          if (rol.clave == this.ADM ||
            rol.clave == this.CTM

          ) {

            if (usr != undefined) {
              this.usuarios.push(usr)

            }
          }
        });
      });
      this.usuarios = this.functionsService.getActives(this.usuarios)


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Usuarios')
        this.loading = false
      })
  }

  back() {
    this.functionsService.navigateTo('core/catalogos/tipo-gasto')
  }
}

