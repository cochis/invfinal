import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 
import { Role } from 'src/app/core/models/role.model';
import { Stock } from 'src/app/core/models/stock.model';
import { TipoStock } from 'src/app/core/models/tipoStock.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { Departamento } from 'src/app/core/models/departamento.model';
import { RolesService } from 'src/app/core/services/roles.service';
 
import { TipoStockService } from 'src/app/core/services/tipoStock.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { DepartamentosService } from 'src/app/core/services/departamentos.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-departamento',
  templateUrl: './new-departamento.component.html',
  styleUrls: ['./new-departamento.component.css']
})
export class NewDepartamentoComponent{
  ADM = environment.ADM

  rol = this.functionsService.getLocal('role')
  loading = false
  usuarios: Usuario[]
  departamento: Departamento
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
   
    private departamentosService: DepartamentosService
  ) {
    this.loading = true


    this.getCatalogos()
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }



  getCatalogos() {

    // this.loading = true
    // this.tipoStockService.cargarTipoStocksAll().subscribe((resp: CargarTipoStocks) => {
    //   this.tipoStocks = this.functionsService.getActivos(resp.tipoStocks)


    // },
    //   (error: any) => {

    //     this.functionsService.alertError(error, 'Stock')
    //     this.loading = false


    //   })
    // this.loading = true
    // this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
    //   this.usuarios = this.functionsService.getActivos(resp.usuarios)


    // },
    //   (error: any) => {

    //     this.functionsService.alertError(error, 'Stock')
    //     this.loading = false


    //   })


  }

  get errorControl() {
    return this.form.controls;
  }


  createForm() {
    this.form = this.fb.group({
      nombre: [''],
      clave: [''],
      descripcion: [''],
      usuarioCreated: [''],
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    this.submited = true

   
    if (this.form.valid) {
       
      if (this.form.value.usuarioAsignado != '') {
        this.form.value.asignado = true
      }
      else {
        this.form.value.asignado = false
      }

      this.loading = false

      let obj = {
        ...this.form.value,
        usuarioCreated: this.functionsService.getLocal('uid')
      }
      this.departamentosService.crearDepartamento(obj).subscribe((resp: any) => {

        //Message
        this.functionsService.navigateTo('core/catalogos/departamentos')
        this.loading = false
      },
        (error) => {
  
          this.loading = false


        })
    } else {

      //Message
      this.loading = false
      return
    }


  }

  back() {
    this.functionsService.navigateTo('core/catalogos/departamentos')
  }

}
