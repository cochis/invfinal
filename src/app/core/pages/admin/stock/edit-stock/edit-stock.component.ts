import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarRoles, CargarStock, CargarTipoStocks, CargarUsuario, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Role } from 'src/app/core/models/role.model';
import { Stock } from 'src/app/core/models/stock.model';
import { TipoStock } from 'src/app/core/models/tipoStock.model';

import { Usuario } from 'src/app/core/models/usuario.model';
import { FileService } from 'src/app/core/services/file.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { StocksService } from 'src/app/core/services/stock.service';
import { TipoStockService } from 'src/app/core/services/tipoStock.service';

import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-stock',
  templateUrl: './edit-stock.component.html',
  styleUrls: ['./edit-stock.component.css']
})
export class EditStockComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined

  tipoStocks: TipoStock[]
  stock: Stock
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url
  ADM = environment.ADM
  usuarios: Usuario[]
  rol = this.functionsService.getLocal('role')
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private tipoStockService: TipoStockService,
    private stockService: StocksService,
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
     

    this.stockService.cargarStockById(id).subscribe((resp: CargarStock) => {
       
      this.stock = resp.stock

      
      setTimeout(() => {

        this.setForm(this.stock)
      }, 500);

    },
      (error: any) => {

       
        this.functionsService.alertError(error,'Stock')

      })
  }


  getCatalogos() {
   
    this.loading = true
    this.tipoStockService.cargarTipoStocksAll().subscribe((resp: CargarTipoStocks) => {
      this.tipoStocks = resp.tipoStocks
    
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
      clave: ['',],
      nip: ['',],
      modelo: [''  ],
      serie: [''],
      status: [''],
      asignado: [false],
      usuarioAsignado: [''],
      activated: [false],
      dateCreated: [''],
      lastEdited: [this.today],
    })
  }
  setForm(stock: Stock) {
    this.loading = true
  


    var tipoStock = (this.edit === 'false') ? stock.tipoStock.nombre : stock.tipoStock._id



    setTimeout(() => {
      let asignacion = this.functionsService.getValueCatalog(stock.usuarioAsignado,'email',this.usuarios) 
      this.form = this.fb.group({
        tipoStock: [tipoStock, [Validators.required, Validators.minLength(3)]],
        clave: [stock.clave ],
        nip: [stock.nip ],
        modelo: [stock.modelo ],
        serie: [stock.serie ],
        status: [stock.status ],
        asignado: [stock.asignado],
        usuarioAsignado: [(this.edit==='true')?stock.usuarioAsignado : asignacion],
        activated: [stock.activated],
        dateCreated: [stock.dateCreated],
        lastEdited: [this.today],
      })
      this.loading = false
    }, 1500);
    

  }

  onSubmit() {
    this.loading = true
    this.submited = true
    if (this.form.valid) {
      if(this.form.value.usuarioAsignado !== ''){
        this.form.value.asignado = true
      }
      else{
        this.form.value.asignado = false
      }
      this.stock = {
        ...this.stock,
        ...this.form.value,


      }

      this.stock.clave = this.stock.clave.toUpperCase()
      this.stock.modelo = this.stock.modelo.toUpperCase()
      this.stock.nip = this.stock.nip
      this.stock.status = this.stock.status
      this.stock.serie = this.stock.serie.toUpperCase()
      this.stockService.actualizarStock(this.stock).subscribe((resp: any) => {
    
        this.functionsService.alertUpdate('Stock')

        this.functionsService.navigateTo('core/stock')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Stock')
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
      ;
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
      .actualizarFoto(this.imagenSubir, 'stocks', this.stock.uid)
      .then(
        (img) => {
           this.stock.img = img
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
    this.functionsService.navigateTo('core/stock')
  }

}
