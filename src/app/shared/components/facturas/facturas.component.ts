import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {   ModalService } from '@developer-partners/ngx-modal-dialog';
import { CargarFactura, CargarFacturas, CargarMonedas, CargarTipoFacturas, CargarTipoSolicitudViajes, CargarTipoTransporte, CargarTipoTransportes, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { DollarApi } from 'src/app/core/models/dolarApi.model';
import { Factura } from 'src/app/core/models/factura.model';
import { Moneda } from 'src/app/core/models/moneda.model';
import { SolicitudViaje } from 'src/app/core/models/solicitudViaje.model';
import { TipoFactura } from 'src/app/core/models/tipoFactura.model';
import { TipoSolicitudViaje } from 'src/app/core/models/tipoSolicitudViaje.model';
import { TipoTransporte } from 'src/app/core/models/tipoTransporte.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { DollarApisService } from 'src/app/core/services/dolarapi.service';
import { FacturasService } from 'src/app/core/services/facturas.service';
import { FileService } from 'src/app/core/services/file.service';
import { MonedasService } from 'src/app/core/services/monedas.service';
import { SolicitudViajesService } from 'src/app/core/services/solicitudViaje.service';
import { TipoFacturaService } from 'src/app/core/services/tipoFactura.service';
import { TipoSolicitudViajesService } from 'src/app/core/services/tipoSolicitudViaje.service';
import { TipoTransportesService } from 'src/app/core/services/tipoTransporte.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { ModalComponent } from '../modal/modal.component';


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {
  @Input() idSolicitud: string;
  @Input() pagado: boolean;
  @Input() cantidadSolicitada: number;
  @Output() isFacturaNew: EventEmitter<any> = new EventEmitter();
  loading = false
  ADM = environment.ADM
  CTB = environment.CTB
  CTM = environment.CTM
  url = environment.base_url
  DLL = environment.DLL
  MXN = environment.MXN
  newFac: boolean = false
  facturas: Factura[] =[]
  usuarios: Usuario[]
  empleado: Usuario
  exChange: any
  tipoSolicitudViajes: TipoSolicitudViaje[]
  monedas: Moneda[]
  factura: Factura = undefined
  tipoTransportes: TipoTransporte[]
  tipoFacturas: TipoFactura[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  solicitudViajendo: boolean = false
  msnOk: boolean = false
  submited: boolean = false
  disabledB = false
  usr = this.functionsService.getLocal('uid')
  uid = this.functionsService.getLocal('uid')
  rol = this.functionsService.getLocal('role')
  todayT = this.functionsService.numberToDate(this.today)
  newFacturaBol: boolean = false
  imagenSubir: any
  imgTemp: any

  isEdit: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private solicitudViajesService: SolicitudViajesService,
    private usuariosService: UsuariosService,
    private tipoTransportesService: TipoTransportesService,
    private tipoFacturasService: TipoFacturaService,
    private tipoSolicitudViajesService: TipoSolicitudViajesService,
    private monedasService: MonedasService,
    private dolarApiService: DollarApisService,
    private fileService: FileService,
    private facturasService: FacturasService,
    private readonly modalService: ModalService
  ) {
    this.loading = true
 
    

    this.getDollar()
    this.createForm()
    this.isFacturaNew.emit({
      new: true,
      ok: false
    });
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }
  ngOnInit()  {
    this.getCatalogos()
    this.getFacturas(this.idSolicitud)
    
  }


  sumaFacturas(facturas:any){
    var sum =0
    facturas.forEach((factura:any) => {
       
      if(factura.moneda =='MXN'){

        sum= sum + factura.cantidad
      }else {
        sum= sum +( factura.cantidad * factura.currencyExchange)

      }

      
    });
    return sum
  }

  get errorControl() {
    return this.form.controls;
  }
  newFactura() {

    this.isEdit = false
    this.form.reset()
    this.newFac = true
    this.isFacturaNew.emit({
      new: true,
      ok: false
    });
    ;
    this.form.patchValue({ solicitudViaje: this.idSolicitud })
  }
  closeFactura() {

    this.newFac = false

  }
  getDollar() {
    if (this.url.includes('localhost')) {
      this.exChange = {
        "moneda": "USD",
        "nombre": "Dólar",
        "compra": 18.5635,
        "venta": 18.577,
        "fix": 18.5385,
        "fechaActualizacion": "2024-06-13T00:00:00.000Z"
      }
      

    } else {
      this.exChange = this.dolarApiService.cargarDollar
      
    }


  }
  createForm() {
    this.form = this.fb.group({

      solicitudViaje: ['', [Validators.required]],
      date: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      tipoFactura: ['', [Validators.required]],
      cantidad: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      currencyExchange: [this.exChange.fix, [Validators.required]],
      file: ['', [Validators.required]],
      activated: [true, [Validators.required]],
      usuarioCreated: [this.uid, [Validators.required]],
      dateCreated: [this.today, [Validators.required]],
      lastEdited: [this.today, [Validators.required]],



    })
  }
  onSubmit() {
    this.loading = true
    this.disabledB = true
    this.submited = true


   
    this.form.value.activated = true
    this.form.value.date = this.functionsService.DateToNumber(this.form.value.date)



    this.loading = false
    this.disabledB = false
    this.submited = false
    this.newFac = false
    this.isFacturaNew.emit({
      new: false,
      ok: true
    });
    this.onEdit= undefined
    return false



    if (this.form.valid) {
      this.form.value.empleado = this.usr
      this.form.value.dateSalida = this.form.value.dateSalida ? this.functionsService.DateToNumber(this.form.value.dateSalida) : ''
      this.form.value.dateRegreso = this.form.value.dateRegreso ? this.functionsService.DateToNumber(this.form.value.dateRegreso) : ''
      this.form.value.dateViaje = this.form.value.dateViaje ? this.functionsService.DateToNumber(this.form.value.dateViaje) : ''
      this.form.value.fechaAprobacion = this.form.value.fechaAprobacion ? this.functionsService.DateToNumber(this.form.value.fechaAprobacion) : ''

      this.solicitudViajesService.crearSolicitudViaje(this.form.value).subscribe((resp: any) => {
        this.functionsService.alert('Solicitud de Viaje', 'Solicitud creada', 'success')
        this.functionsService.navigateTo('core/viajes')
        this.loading = false
        this.disabledB = false
        this.isFacturaNew.emit(false);
      },
        (error) => {

          this.disabledB = false

          this.loading = false
          this.submited = false
          this.functionsService.alertError(error, 'Solicitud de Viaje')

        })
    } else {

      this.disabledB = false
      //Message
      this.loading = false
      this.functionsService.alertForm('Solicitud de Viaje')
      return false
    }






  }
  onEdit(){
 
    let facturaEdit={
      ...this.form.value,
      date: this.functionsService.DateToNumber(this.form.value.date),
      file:this.factura.file 
    }
  
  }
  back() {
    this.isFacturaNew.emit({
      new: false,
      ok: false
    });
    this.newFac = false
  }
  getCatalogos() {




    this.loading = true
    this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
      this.usuarios = this.functionsService.getActivos(resp.usuarios)

    },
      (error: any) => {
        this.functionsService.alertError(error, 'Usuarios')
        this.loading = false
      })

    this.tipoTransportesService.cargarTipoTransportesAll().subscribe((resp: CargarTipoTransportes) => {
      this.tipoTransportes = this.functionsService.getActivos(resp.tipoTransportes)


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo Solicitud de Viaje')

      })

    this.tipoSolicitudViajesService.cargarTipoSolicitudViajesAll().subscribe((resp: CargarTipoSolicitudViajes) => {
      this.tipoSolicitudViajes = this.functionsService.getActivos(resp.tipoSolicitudViajes)

    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo Solicitud Viajes')
        this.loading = false
      })
    this.tipoFacturasService.cargarTipoFacturasAll().subscribe((resp: CargarTipoFacturas) => {
      this.tipoFacturas = this.functionsService.getActivos(resp.tipoFacturas)


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo Facturas')
        this.loading = false
      })

    this.monedasService.cargarMonedasAll().subscribe((resp: CargarMonedas) => {
      this.monedas = this.functionsService.getActivos(resp.monedas)


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Monedas')
        this.loading = false
      })

   




  }
  setExchange(event) {
   
    if (event == this.DLL) {
      this.form.patchValue({ currencyExchange: this.exChange.fix })
    } else {
      this.form.patchValue({ currencyExchange: 1 })


    }
  }


  setFile(file: any) {
    this.loading = true
    this.imagenSubir = file.target.files[0]

    if (this.factura) {
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
        setTimeout(() => {
          
          this.setFactura(this.factura)
          this.loading =false
        }, 550);

      }
    } else {
       
      this.form.value.date = this.functionsService.DateToNumber(this.form.value.date)
  
      let factura = {
        ...this.form.value,
        file: undefined,
        activated:true,
        lastEdited:this.today,
        dateCreated:this.today
      }
      this.facturasService.crearFactura(factura).subscribe((resp: any) => {
      
        this.factura = resp.factura
        setTimeout(() => {
          
          this.setFactura(this.factura)
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
            this.setFactura(this.factura)
            this.getFacturas(this.idSolicitud)
           
          }
        }, 500);
      },
        (error) => {
         
          this.loading = false
          this.submited = false
        })
    }
  }
  subirImagen() {
    this.loading = true
    this.fileService
      .actualizarFoto(this.imagenSubir, 'facturas', this.factura.uid)
      .then(
        async (file) => {
          this.factura.file = file
         
          await this.getFactura(this.factura.uid)
          setTimeout(() => {
            
            this.isFacturaNew.emit({
              new: false,
              ok: false
            });
            this.newFac = false
          }, 1000);
        },
        (err) => {
          this.loading = false
          this.functionsService.alert('Usuarios', 'Error al subir la imagen', 'error')
        },
      )
  }
  setFactura(factura:any){
    this.form = this.fb.group({


      solicitudViaje :[factura.solicitudViaje._id , [Validators.required]],
      date :[(typeof(factura.date)=='number')? this.functionsService.numberToDate(factura.date):factura.date , [Validators.required]],
      descripcion :[factura.descripcion , [Validators.required]],
      tipoFactura :[factura.tipoFactura._id  , [Validators.required]],
      cantidad :[factura.cantidad , [Validators.required]],
      moneda :[factura.moneda._id  , [Validators.required]],
      currencyExchange :[factura.currencyExchange , [Validators.required]],
      file :[  ],
      activated :[factura.activated  ],
      usuarioCreated :[factura.usuarioCreated  ],
      dateCreated :[factura.dateCreated  ],
      lastEdited :[this.today , [Validators.required]],
      uid :[factura.uid  ],

       
    })

  }
  getFacturas(solicitud:string){

    this.loading = true
    setTimeout(() => {
      
      this.facturasService.cargarFacturasSolicitud(solicitud).subscribe((resp: CargarFacturas) => {
        
        this.facturas = resp.facturas
        this.loading=false
        
      },
      (error) => {
          this.loading=false
      
  
        })
    }, 800);
  }
  getFactura(id:string){
    this.facturasService.cargarFacturaById(id).subscribe((resp:CargarFactura)=>{
      this.factura = resp.factura
     
    },
  (error)=>{
 

  })
  }



  async editFactura(id:string){
    this.form.reset()
    this.isEdit = true
    this.loading= true
    this.newFac = true
    this.isFacturaNew.emit({
      new: true,
      ok: false
    });
    await this.getFactura(id)
    setTimeout(() => {
      
      this.setFactura(this.factura)
      this.loading = false
 
    }, 2500);
   
  }

  showPdf(factura: Factura){
    this.modalService.show<Factura>(ModalComponent,{
      title:'Ver pdf',
      size:1,
      model:factura,
      mode:'fullScreen'
    })
  }



}

