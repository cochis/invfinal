import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarRoles, CargarStocks, CargarTipoStocks, CargarUsuario, CargarUsuarios  } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Role } from 'src/app/core/models/role.model';
import { Stock } from 'src/app/core/models/stock.model';
import { TipoStock } from 'src/app/core/models/tipoStock.model';
 import { Usuario } from 'src/app/core/models/usuario.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { StocksService } from 'src/app/core/services/stock.service';
import { TipoStockService } from 'src/app/core/services/tipoStock.service';
 import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-stock',
  templateUrl: './new-stock.component.html',
  styleUrls: ['./new-stock.component.css']
})
export class NewStockComponent {
  ADM =environment.ADM
 
  rol = this.functionsService.getLocal('role')
  loading = false
  usuarios: Usuario[]  
  tipoStocks: TipoStock[]
  stock: Stock
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService, 
    private usuariosService: UsuariosService, 
    private tipoStockService: TipoStockService,
    private stockService: StocksService
  ) {
    this.loading = true
    
    
    this.getCatalogos()
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }



  getCatalogos() {

    this.loading = true
    this.tipoStockService.cargarTipoStocksAll().subscribe((resp: CargarTipoStocks) => {
      this.tipoStocks = this.functionsService.getActivos(resp.tipoStocks)
      

    },
      (error: any) => {
   
        this.functionsService.alertError(error,'Stock')
        this.loading = false


      })
    this.loading = true
    this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
      this.usuarios = this.functionsService.getActivos(resp.usuarios)
    

    },
      (error: any) => {
   
        this.functionsService.alertError(error,'Stock')
        this.loading = false


      })


  }

  get errorControl() {
    return this.form.controls;
  }


  createForm() {
    this.form = this.fb.group({
      tipoStock: ['', [Validators.required, Validators.minLength(3)]],
      clave: [''],
      nip: [''],
      modelo: [''  ],
      serie: [''],
      status: [''],
      asignado: [false],
      usuarioAsignado: [''],
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    this.submited = true
 
    if (this.form.valid) {
      this.form.value.clave = this.form.value.clave.toUpperCase()
      this.form.value.nip = this.form.value.nip
      this.form.value.status = this.form.value.status
      this.form.value.modelo = this.form.value.modelo.toUpperCase()
      this.form.value.serie = this.form.value.serie.toUpperCase()
      if(this.form.value.usuarioAsignado != ''){
        this.form.value.asignado = true
      }
      else{
        this.form.value.asignado = false
      }
    
      this.loading = false
      
      let obj = { 
        ...this.form.value,
        usuarioCreated: this.functionsService.getLocal('uid')
      }
      this.stockService.crearStock(obj).subscribe((resp: any) => {

        //Message
        this.functionsService.navigateTo('core/stock')
        this.loading = false
      },
        (error) => {
          //Message
          this.loading = false
     

        })
    } else {

      //Message
      this.loading = false
      return  
    }
 

  }

  back() {
    this.functionsService.navigateTo('core/stock')
  }

}
