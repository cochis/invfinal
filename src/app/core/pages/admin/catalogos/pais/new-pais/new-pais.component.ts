import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 
import { Role } from 'src/app/core/models/role.model';
import { Stock } from 'src/app/core/models/stock.model';
import { TipoStock } from 'src/app/core/models/tipoStock.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { Pais } from 'src/app/core/models/pais.model';
import { RolesService } from 'src/app/core/services/roles.service';
 
import { TipoStockService } from 'src/app/core/services/tipoStock.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { PaissService } from 'src/app/core/services/pais.service';
@Component({
  selector: 'app-new-pais',
  templateUrl: './new-pais.component.html',
  styleUrls: ['./new-pais.component.css']
})
export class NewPaisComponent{
  ADM = environment.ADM

  rol = this.functionsService.getLocal('role')
  loading = false
  usuarios: Usuario[]
  pais: Pais
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
   
    private paissService: PaissService
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
      this.paissService.crearPais(obj).subscribe((resp: any) => {
        console.log('resp', resp)

        //Message
        this.functionsService.navigateTo('core/catalogos/paises')
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
    this.functionsService.navigateTo('core/catalogos/paises')
  }

}
