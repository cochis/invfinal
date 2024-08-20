import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarClienteLoops, CargarConceptoLoops, CargarEmpresas, CargarMonedas, CargarPagoProgramado, CargarPagoProgramados, CargarProveedorLoops, CargarSubsidiarias, CargarTerminoPagos, CargarTipoGastos, CargarTipoProveedor } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { ClienteLoop } from 'src/app/core/models/clienteLoop.model';
import { ConceptoLoop } from 'src/app/core/models/conceptoLoop.model';
import { Empresa } from 'src/app/core/models/Empresa';
import { Moneda } from 'src/app/core/models/moneda.model';
import { PagoProgramado } from 'src/app/core/models/pagoProgramado.model';
import { ProveedorLoop } from 'src/app/core/models/proveedorLoop.model';
import { Subsidiaria } from 'src/app/core/models/subsidiaria.model';
import { TerminoPago } from 'src/app/core/models/terminoPago.model';
import { TipoGasto } from 'src/app/core/models/tipoGasto.model';
import { TipoProveedor } from 'src/app/core/models/tipoProveedor.model';
import { ClienteLoopsService } from 'src/app/core/services/clienteLoops.service';
import { ConceptoLoopsService } from 'src/app/core/services/conceptoLoops.service';
import { FileService } from 'src/app/core/services/file.service';
import { MonedasService } from 'src/app/core/services/monedas.service';
import { PagoProgramadoService } from 'src/app/core/services/pagoProgramado.service';
import { ProveedorLoopsService } from 'src/app/core/services/proveedorLoops.service';
import { EmpresasService } from 'src/app/core/services/puesto.service copy';
import { RolesService } from 'src/app/core/services/roles.service';
import { SubsidiariaService } from 'src/app/core/services/subsidiaria.service';
import { TerminoPagoService } from 'src/app/core/services/terminoPago.service';
import { TipoGastoService } from 'src/app/core/services/tipoGasto.service';
import { TipoProveedorService } from 'src/app/core/services/tipoProveedor.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-pago-progamado',
  templateUrl: './edit-pago-progamado.component.html',
  styleUrls: ['./edit-pago-progamado.component.css']
})
export class EditPagoProgamadoComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  pagoProgramado: any
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  pdfSubir: any
  pdfTemp: any
  LOOP=environment.LOOP
  JASU=environment.JASU
  proveedorLoops: ProveedorLoop[]
  conceptoLoops: ConceptoLoop[]
  clienteLoops: ClienteLoop[]
  terminoPagos: TerminoPago[]
  subsidiarias: Subsidiaria[]
  empresas: Empresa[]
  tipoGastos: TipoGasto[]
  monedas: Moneda[]
  url = environment.base_url
  usr = this.functionsService.getLocal('uid')
  OTCONCEPTO = environment.OTCONCEPTO
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private pagoProgramadoService: PagoProgramadoService,
    private route: ActivatedRoute,
    private tipoGastoService: TipoGastoService,
    private monedaService: MonedasService,
    private terminoPagoService: TerminoPagoService,
    private subsidiariaService: SubsidiariaService,
    private conceptoLoopsService: ConceptoLoopsService,
    private empresaService: EmpresasService,
    private proveedorLoopsService: ProveedorLoopsService,
    private clienteLoopsService: ClienteLoopsService,
    private fileService: FileService
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

    this.loading = true
    this.pagoProgramadoService.cargarPagoProgramadoById(id).subscribe((resp: CargarPagoProgramado) => {
      this.pagoProgramado = resp.pagoProgramado
      console.log('resp.pagoProgramado', resp.pagoProgramado)
      setTimeout(() => {
        this.setForm(this.pagoProgramado)
      }, 500);
    },
      (error: any) => {
        this.loading = false
        this.functionsService.alertError(error, 'Pago programado')
      })
  }
createForm() {
    this.form = this.fb.group({

      consecutivo: [''],
      urgente: [''],
      subsidiaria: [''],
      tipoGasto: [''],
      terminoPago: [''],
      proveedor: [''],
      proveedorLoop: [''],
      clienteLoop: [''],
      impExpLoop: [''],
      concepto: [''],
      conceptoLoop: [''],
      otroConcepto: [''],
      cantidad: [''],
      fechaSolicitud: [''],
      fechaPago: [''],
      pagado: [''],
      fechaProgramada: [''],
      fechaVencimiento: [''],
      quote: [''],
      aprobacion: [''],
      tipoServicio: [''],
      observaciones: [''],
      factura: [''],
      tipoFactura: [''],
      cotizacion: [''],
      comprobante: [''],
      empresa: [''],
      moneda: [''],
      usuarioCreated: [''],
      dateCreated: [''],
      activated: [''],
      lastEdited: [''],
    })
  }

  aprobacion(){
     // console.log('aprobacion',this.form.value.aprobacion)
    this.pagoProgramado={
      
      ...this.pagoProgramado,
      aprobacion:(this.form.value.aprobacion=='true')?true:false
    }
   
    this.setForm(this.pagoProgramado)
  }
  setForm(pagoProgramado: any) {
     console.log('pagoProgramado', pagoProgramado.conceptoLoop)
     console.log(this.conceptoLoops);
     
     
  
     
    var ok = false
    if ( this.pagoProgramado.tipoGasto.aprobacionPor.includes(this.usr)  ) {
      ok = true
    }else {
      
      ok = false
    }

    this.form = this.fb.group({
      consecutivo: [pagoProgramado.consecutivo],
      urgente: [pagoProgramado.urgente],
      proveedorLoop: [pagoProgramado.proveedorLoop?pagoProgramado.proveedorLoop._id:null],
      clienteLoop: [pagoProgramado.clienteLoop?pagoProgramado.clienteLoop._id:null],
      impExpLoop: [pagoProgramado.impExpLoop],
      fechaVencimiento:[pagoProgramado.aprobacion ?
        { value: pagoProgramado.fechaVencimiento ? this.functionsService.numberToDate(pagoProgramado.fechaVencimiento) : '', disabled: false } :
        { value: pagoProgramado.fechaVencimiento ? this.functionsService.numberToDate(pagoProgramado.fechaVencimiento) : '', disabled: true }],
      quote: [pagoProgramado.quote],
      tipoServicio: [pagoProgramado.tipoServicio],
      tipoFactura: [pagoProgramado.tipoFactura],
      factura: [pagoProgramado.factura],
      cotizacion: [pagoProgramado.cotizacion],
      comprobante: [pagoProgramado.comprobante],
      subsidiaria: [pagoProgramado.subsidiaria?pagoProgramado.subsidiaria._id:null],
      tipoGasto: [pagoProgramado.tipoGasto?pagoProgramado.tipoGasto._id:null],
      terminoPago: [pagoProgramado.terminoPago?pagoProgramado.terminoPago._id:null],
      moneda: [pagoProgramado.moneda?pagoProgramado.moneda._id:null],
      proveedor: [pagoProgramado.proveedor],
      concepto: [pagoProgramado.concepto],
      conceptoLoop: [pagoProgramado.conceptoLoop?pagoProgramado.conceptoLoop._id:null],
      otroConcepto: [pagoProgramado.otroConcepto],
      cantidad: [pagoProgramado.cantidad],
      empresa: [(typeof(pagoProgramado.empresa)=='string')?pagoProgramado.empresa:(this.edit =='true')?pagoProgramado.empresa._id:pagoProgramado.empresa.nombre],
      fechaSolicitud: [{ value: this.functionsService.numberToDate(pagoProgramado.fechaSolicitud) ? this.functionsService.numberToDate(pagoProgramado.fechaSolicitud) : '', disabled: true }],
      dateCreated: [this.functionsService.numberToDate(pagoProgramado.dateCreated)],
      lastEdited: [this.today],
      usuarioCreated: [pagoProgramado.usuarioCreated],
      aprobacion: [
        ok? ((pagoProgramado.aprobacion==true) ? { value: 'true', disabled: false } : { value: 'false', disabled: false })
        : 
        ((pagoProgramado.aprobacion==true) ? { value: 'true', disabled: true } : { value: 'false', disabled: true })
      ],
      fechaPago: [pagoProgramado.aprobacion ?
        { value: pagoProgramado.fechaPago ? this.functionsService.numberToDate(pagoProgramado.fechaPago) : '', disabled: false } :
        { value: pagoProgramado.fechaPago ? this.functionsService.numberToDate(pagoProgramado.fechaPago) : '', disabled: true }],
      fechaProgramada: [pagoProgramado.aprobacion ?
        { value: pagoProgramado.fechaProgramada ? this.functionsService.numberToDate(pagoProgramado.fechaProgramada + 100000000) : '', disabled: false } :
        { value: pagoProgramado.fechaProgramada ? this.functionsService.numberToDate(pagoProgramado.fechaProgramada + 100000000) : '', disabled: true }],
      pagado: [pagoProgramado.aprobacion ?
        { value: pagoProgramado.pagado ? 'true' : 'false', disabled: false } :
        { value: pagoProgramado.pagado ? 'true' : 'false', disabled: true }
      ],
      observaciones: [pagoProgramado.aprobacion ?
        { value: pagoProgramado.observaciones, disabled: false } :
        { value: pagoProgramado.observaciones, disabled: true }
      ],
      activated: [pagoProgramado.activated],
    })
  }
  onSubmit() {
    this.loading = true
    // console.log('this.form', this.form)
    // console.log('this.form.value', this.form.value)
    this.form.value.dateCreated = new Date(this.form.value.dateCreated).getTime() + 100000000
    this.form.value.aprobacion = (this.form.value.aprobacion == 'false' || this.form.value.aprobacion == false) ? false : true,
      this.form.value.fechaPago = (this.form.value.fechaPago !== '') ? new Date(this.form.value.fechaPago).getTime() : ''
    this.form.value.fechaProgramada = (this.form.value.fechaProgramada !== '') ? new Date(this.form.value.fechaProgramada).getTime() : ''
    this.form.value.fechaVencimiento = (this.form.value.fechaVencimiento !== '') ? new Date(this.form.value.fechaVencimiento).getTime() : ''
    this.form.value.usuarioCreated = this.form.value.usuarioCreated._id
 

    this.form.value.pagado = (this.form.value.pagado == 'true') ? true : false
    if (this.form.valid) {
      this.pagoProgramado = {
        ...this.pagoProgramado,

        ...this.form.value,
        url:this.url,
        lastEdited: this.today

      }
      this.pagoProgramadoService.actualizarPagoProgramado(this.pagoProgramado).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Pago programado')
        this.functionsService.navigateTo('core/pagos-programados')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Pago programado')
          this.loading = false



        })
    } else {
      this.functionsService.alertForm('Pago programado')
      this.loading = false

      return
    }





  }
  back() {
    this.functionsService.navigateTo('core/pagos-programados')
  }
  getCatalogos() {
    this.loading = true
    this.terminoPagoService.cargarTerminoPagosAll().subscribe((resp: CargarTerminoPagos) => {
      this.terminoPagos = this.functionsService.getActives(resp.terminoPagos)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'terminoPagos')
        this.loading = false
      })
    this.empresaService.cargarEmpresasAll().subscribe((resp: CargarEmpresas) => {
      this.empresas = this.functionsService.getActives(resp.empresas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'terminoPagos')
        this.loading = false
      })
    this.subsidiariaService.cargarSubsidiariasAll().subscribe((resp: CargarSubsidiarias) => {
      this.subsidiarias = this.functionsService.getActives(resp.subsidiarias)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'subsidiarias')
        this.loading = false
      })
    this.tipoGastoService.cargarTipoGastosAll().subscribe((resp: CargarTipoGastos) => {
      this.tipoGastos = this.functionsService.getActives(resp.tipoGastos)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'tipoGastos')
        this.loading = false
      })
    this.conceptoLoopsService.cargarConceptoLoopsAll().subscribe((resp: CargarConceptoLoops) => {
      this.conceptoLoops = this.functionsService.getActives(resp.conceptoLoops)
      console.log('this.conceptoLoops', this.conceptoLoops)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'ConceptoLoop')
        this.loading = false
      })
    this.monedaService.cargarMonedasAll().subscribe((resp: CargarMonedas) => {
      this.monedas = this.functionsService.getActives(resp.monedas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'tipoGastos')
        this.loading = false
      })
      this.proveedorLoopsService.cargarProveedorLoopsAll().subscribe((resp: CargarProveedorLoops) => {
        this.proveedorLoops = resp.proveedorLoops
        // console.log('this.proveedorLoops', this.proveedorLoops)
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'PagoProgramado')
  
        });
      this.clienteLoopsService.cargarClienteLoopsAll().subscribe((resp: CargarClienteLoops) => {
        this.clienteLoops = resp.clienteLoops
        // console.log('this.clienteLoops', this.clienteLoops)
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'PagoProgramado')
  
        });
  }
  setFile(file: any,tipo:string) {
    this.loading = true
    this.pdfSubir = file.target.files[0]


    if (this.pagoProgramado) {
      if (!file.target.files[0]) {
        this.pdfTemp = null
        this.functionsService.alert('Factura', 'No se encontró PDF', 'error')
        this.loading = false

      } else {


        const reader = new FileReader()
        const url64 = reader.readAsDataURL(file.target.files[0])

        reader.onloadend = () => {
          this.pdfTemp = reader.result

        }
        this.subirImagen(tipo)
        setTimeout(() => {

          this.setPagoProgramado(this.pagoProgramado)
          this.loading = false
        }, 550);

      }
    }  

  }
  subirImagen(tipo) {
    this.loading = true
    this.fileService
      .actualizarPago(this.pdfSubir, this.pagoProgramado.uid,tipo)
      .then(
        async (file) => {
          this.pagoProgramado.factura = file


        },
        (err) => {
          this.loading = false
          this.functionsService.alert('Usuarios', 'Error al subir la imagen', 'error')
        },
      )
  }
 
  setPagoProgramado(pagoProgramado: any) {
    console.log('pagoProgramado', pagoProgramado)
        
    var ok = false
    if ( this.pagoProgramado.tipoGasto.aprobacionPor.includes(this.usr)  ) {
      ok = true
    }else {
      
      ok = false
    }
    this.form = this.fb.group({

      consecutivo: [pagoProgramado.consecutivo],
      urgente: [pagoProgramado.urgente],
      proveedorLoop: [pagoProgramado.proveedorLoop],
      clienteLoop: [pagoProgramado.clienteLoop],
      impExpLoop: [pagoProgramado.impExpLoop],
      fechaVencimiento:[pagoProgramado.aprobacion ?
        { value: pagoProgramado.fechaVencimiento ? this.functionsService.numberToDate(pagoProgramado.fechaVencimiento) : '', disabled: false } :
        { value: pagoProgramado.fechaVencimiento ? this.functionsService.numberToDate(pagoProgramado.fechaVencimiento) : '', disabled: true }],
      quote: [pagoProgramado.quote],
      tipoServicio: [pagoProgramado.tipoServicio],
      tipoFactura: [pagoProgramado.tipoFactura],
      factura: [pagoProgramado.factura],
      cotizacion: [pagoProgramado.cotizacion],
      comprobante: [pagoProgramado.comprobante],
      subsidiaria: [pagoProgramado.subsidiaria._id],
      tipoGasto: [pagoProgramado.tipoGasto._id],
      terminoPago: [pagoProgramado.terminoPago._id],
      moneda: [pagoProgramado.moneda._id],
      proveedor: [pagoProgramado.proveedor],
      concepto: [pagoProgramado.concepto],
      conceptoLoop: [pagoProgramado.conceptoLoop._id],
      otroConcepto: [pagoProgramado.otroConcepto],
      cantidad: [pagoProgramado.cantidad],
      empresa: [(typeof(pagoProgramado.empresa)=='string')?pagoProgramado.empresa:(this.edit =='true')?pagoProgramado.empresa._id:pagoProgramado.empresa.nombre],
      fechaSolicitud: [{ value: this.functionsService.numberToDate(pagoProgramado.fechaSolicitud) ? this.functionsService.numberToDate(pagoProgramado.fechaSolicitud) : '', disabled: true }],
      dateCreated: [this.functionsService.numberToDate(pagoProgramado.dateCreated)],
      lastEdited: [this.today],
      usuarioCreated: [pagoProgramado.usuarioCreated],
      aprobacion: [
        ok? ((pagoProgramado.aprobacion==true) ? { value: 'true', disabled: false } : { value: 'false', disabled: false })
        : 
        ((pagoProgramado.aprobacion==true) ? { value: 'true', disabled: true } : { value: 'false', disabled: true })
      ],
      fechaPago: [pagoProgramado.aprobacion ?
        { value: pagoProgramado.fechaPago ? this.functionsService.numberToDate(pagoProgramado.fechaPago) : '', disabled: false } :
        { value: pagoProgramado.fechaPago ? this.functionsService.numberToDate(pagoProgramado.fechaPago) : '', disabled: true }],
      fechaProgramada: [pagoProgramado.aprobacion ?
        { value: pagoProgramado.fechaProgramada ? this.functionsService.numberToDate(pagoProgramado.fechaProgramada + 100000000) : '', disabled: false } :
        { value: pagoProgramado.fechaProgramada ? this.functionsService.numberToDate(pagoProgramado.fechaProgramada + 100000000) : '', disabled: true }],
      pagado: [pagoProgramado.aprobacion ?
        { value: pagoProgramado.pagado ? 'true' : 'false', disabled: false } :
        { value: pagoProgramado.pagado ? 'true' : 'false', disabled: true }
      ],
      observaciones: [pagoProgramado.aprobacion ?
        { value: pagoProgramado.observaciones, disabled: false } :
        { value: pagoProgramado.observaciones, disabled: true }
      ],
      activated: [pagoProgramado.activated],
    
 
    })
  }
}
