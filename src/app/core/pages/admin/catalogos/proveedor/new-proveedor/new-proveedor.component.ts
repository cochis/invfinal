import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarIncoterms, CargarMateriaPrimas, CargarProductos, CargarRoles, CargarStocks, CargarTipoProveedor, CargarTipoProveedors, CargarTipoStocks, CargarUsuario, CargarUsuarios, CargarZonas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Incoterm } from 'src/app/core/models/incoterm.model';
import { MateriaPrima } from 'src/app/core/models/materiaPrima.model';
import { Producto } from 'src/app/core/models/producto.model';
import { Stock } from 'src/app/core/models/stock.model';
import { TipoProveedor } from 'src/app/core/models/tipoProveedor.model';
import { Zona } from 'src/app/core/models/zona.model';
import { IncotermsService } from 'src/app/core/services/incoterm.service';
import { MateriaPrimasService } from 'src/app/core/services/materiaPrimas.service';
import { ProductosService } from 'src/app/core/services/producto.service';
import { ProveedorsService } from 'src/app/core/services/proveedor.service';
import { TipoProveedorService } from 'src/app/core/services/tipoProveedor.service';
import { ZonasService } from 'src/app/core/services/zona.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-new-proveedor',
  templateUrl: './new-proveedor.component.html',
  styleUrls: ['./new-proveedor.component.css']
})
export class NewProveedorComponent {
  ADM = environment.ADM

  rol = this.functionsService.getLocal('role')
  loading = false

  tipoProveedors: TipoProveedor[]
  zonas: Zona[]
  incoterms: Incoterm[]
  productos: Producto[]
  materiaPrimas: MateriaPrima[]
  stock: Stock
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private materiaPrimasService: MateriaPrimasService,
    private productosService: ProductosService,
    private tipoProveedorService: TipoProveedorService,
    private zonasService: ZonasService,
    private incotermsService: IncotermsService,
    private proveedorsService: ProveedorsService,


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
    this.productosService.cargarProductosAll().subscribe((resp: CargarProductos) => {
      this.productos = this.functionsService.getActivos(resp.productos)
 
    },
      (error: any) => {

        this.functionsService.alertError(error, 'Productos')
        this.loading = false


      })
    this.loading = true
    this.incotermsService.cargarIncotermsAll().subscribe((resp: CargarIncoterms) => {
      this.incoterms = this.functionsService.getActivos(resp.incoterms)
 
    },
      (error: any) => {

        this.functionsService.alertError(error, 'Incoterms')
        this.loading = false


      })
    this.loading = true
    this.materiaPrimasService.cargarMateriaPrimasAll().subscribe((resp: CargarMateriaPrimas) => {
      this.materiaPrimas = this.functionsService.getActivos(resp.materiaPrimas)
  
    },
      (error: any) => {

        this.functionsService.alertError(error, 'Incoterms')
        this.loading = false


      })


  }

  get errorControl() {
    return this.form.controls;
  }


  createForm() {
    this.form = this.fb.group({


 
      clave: ['' ,[Validators.required]],
      nombreEmpresa: ['',[Validators.required]],
      nombreRepresentante: ['',[Validators.required]],
    
      materiaPrimas: ['',[Validators.required]],
      actividadEconomica: ['',[Validators.required]],
      rfc: ['',[Validators.required]],
      direccionFiscal: ['',[Validators.required]],
      estado: [''],
      municipio:[''],
      codigoPostal: [''],
      telefono: [''],
      correo: [''],
      incoterm: [''],
    
      activated: [false],
      usuarioCreated: [''],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    this.submited = true

    if (this.form.valid) {
      



      this.loading = false

      let obj = {
        ...this.form.value,
        usuarioCreated: this.functionsService.getLocal('uid')
      }
      this.proveedorsService.crearProveedor(obj).subscribe((resp: any) => {
        this.functionsService.alert('Proveedor', 'Proveedor creado', 'success')
        this.functionsService.navigateTo('core/catalogos/proveedor')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Proveedor')

          this.loading = false
          this.functionsService.alertError(error, 'Proveedor')

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
