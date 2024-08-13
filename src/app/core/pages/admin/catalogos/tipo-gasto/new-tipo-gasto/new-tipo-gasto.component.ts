import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarEmpresas, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Empresa } from 'src/app/core/models/Empresa';

import { Usuario } from 'src/app/core/models/usuario.model';
import { EmpresasService } from 'src/app/core/services/puesto.service copy';


import { TipoGastoService } from 'src/app/core/services/tipoGasto.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-tipo-gasto',
  templateUrl: './new-tipo-gasto.component.html',
  styleUrls: ['./new-tipo-gasto.component.css']
})
export class NewTipoGastoComponent {
  loading = false
  empresas: Empresa[]
  usuarios: Usuario[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  ADM = environment.ADM
  CTB = environment.CTB
  CTM = environment.CTM
  PGP = environment.PGP

  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private tipoGastoService: TipoGastoService,
    private empresasService: EmpresasService,
  ) {
    this.empresasService.cargarEmpresasAll().subscribe((resp: CargarEmpresas) => {
      this.empresas = resp.empresas
      // console.log('this.empresas::: ', this.empresas);
    })
    this.loading = true
    this.getCatalogos()
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }




  createForm() {
    this.form = this.fb.group({
      empresa: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      aprobacionPor: ['', [Validators.required]],

      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
      this.form.value.clave = this.form.value.clave.toUpperCase().trim()

      let tipoGasto = {
        empresa: this.form.value.empresa,
        nombre: this.form.value.nombre,
        clave: this.form.value.clave,
        aprobacionPor: this.form.value.aprobacionPor,
        usuarioCreated: this.functionsService.getLocal('uid')
      }

      this.tipoGastoService.crearTipoGasto(tipoGasto).subscribe((resp: any) => {
        this.functionsService.alert('Tipo Gasto', 'Tipo de gasto creada', 'success')
        this.functionsService.navigateTo('core/catalogos/tipo-gasto')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Tipo Gasto')

          this.loading = false
          this.functionsService.alertError(error, 'Tipo Gasto')

        })
    } else {

      //Message
      this.loading = false
      this.functionsService.alertForm('Tipo Gasto')
      return
    }






  }

  back() {
    this.functionsService.navigateTo('core/catalogos/tipo-gasto')
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
}

