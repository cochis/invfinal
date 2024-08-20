import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarClienteLoops, CargarConceptoLoops, CargarEmpresas, CargarMonedas, CargarPagoProgramado, CargarPagoProgramados, CargarProveedorLoops, CargarSubsidiarias, CargarTerminoPagos, CargarTipoGastos, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { ClienteLoop } from 'src/app/core/models/clienteLoop.model';
import { ConceptoLoop } from 'src/app/core/models/conceptoLoop.model';
import { Empresa } from 'src/app/core/models/Empresa';
import { Moneda } from 'src/app/core/models/moneda.model';
import { PagoProgramado } from 'src/app/core/models/pagoProgramado.model';
import { ProveedorLoop } from 'src/app/core/models/proveedorLoop.model';
import { Subsidiaria } from 'src/app/core/models/subsidiaria.model';
import { TerminoPago } from 'src/app/core/models/terminoPago.model';
import { TipoGasto } from 'src/app/core/models/tipoGasto.model';

import { Usuario } from 'src/app/core/models/usuario.model';
import { ClienteLoopsService } from 'src/app/core/services/clienteLoops.service';
import { ConceptoLoopsService } from 'src/app/core/services/conceptoLoops.service';
import { FileService } from 'src/app/core/services/file.service';
import { MonedasService } from 'src/app/core/services/monedas.service';
import { PagoProgramadoService } from 'src/app/core/services/pagoProgramado.service';
import { ProveedorLoopsService } from 'src/app/core/services/proveedorLoops.service';
import { EmpresasService } from 'src/app/core/services/puesto.service copy';
import { SubsidiariaService } from 'src/app/core/services/subsidiaria.service';
import { TerminoPagoService } from 'src/app/core/services/terminoPago.service';


import { TipoGastoService } from 'src/app/core/services/tipoGasto.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-pago-progamado',
  templateUrl: './new-pago-progamado.component.html',
  styleUrls: ['./new-pago-progamado.component.css']
})
export class NewPagoProgamadoComponent {
  loading = false
  url = environment.base_url
  CTB = environment.CTB
  CTM = environment.CTM
  EMJ = environment.EMJ
  EML = environment.EML
  ADM = environment.ADM
  LOOP = environment.LOOP
  pdfSubir: any
  pdfTemp: any
  usr = this.functionsService.getLocal('uid')
  empresas: Empresa[]
  monedas: Moneda[]
  conceptoLoops: ConceptoLoop[]
  subsidiarias: Subsidiaria[]
  proveedorLoops: ProveedorLoop[]
  clienteLoops: ClienteLoop[]
  subsidiariasTemp: Subsidiaria[]
  terminoPagos: TerminoPago[]
  terminoPagosTemp: TerminoPago[]
  tipoGastos: TipoGasto[]
  tipoGastosTemp: TipoGasto[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  submited: boolean = false
  pagoProgramado: PagoProgramado
  dateMin = this.functionsService.getToday() + 1209600000
  dateMinT = ''
  validDate = false
  isLoop: boolean = undefined
  consecutivo = 0
  otrConcepto=false
  OTCONCEPTO = environment.OTCONCEPTO
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private pagoProgramadoService: PagoProgramadoService,
    private tipoGastoService: TipoGastoService,
    private monedasService: MonedasService,
    private terminoPagoService: TerminoPagoService,
    private conceptosloopService: ConceptoLoopsService,
    private subsidiariaService: SubsidiariaService,
    private empresasServices: EmpresasService,
    private proveedorLoopsService: ProveedorLoopsService,
    private clienteLoopsService: ClienteLoopsService,
    private fileService: FileService
  ) {
    this.loading = true
    this.getCatalogos()
    this.dateMinT = this.functionsService.numberToDate(this.dateMin)
    this.createForm()
    setTimeout(() => {
      this.loading = false
    }, 1500);
  }




  createForm() {
    this.form = this.fb.group({

      consecutivo: ['', [Validators.required]],
      urgente: [false],
      subsidiaria: ['', [Validators.required]],
      tipoGasto: ['', [Validators.required]],
      terminoPago: ['', [Validators.required]],
      proveedor: ['', [Validators.required]],
      proveedorLoop: ['', [Validators.required]],
      clienteLoop: ['', [Validators.required]],
      impExpLoop: ['', [Validators.required]],
      concepto: [''],
      conceptoLoop: [null],
      otroConcepto: [''],
      cantidad: ['', [Validators.required]],
      fechaSolicitud: ['', [Validators.required]],
      fechaPago: [''],
      pagado: [false],
      fechaProgramada: [''],
      fechaVencimiento: [''],
      quote: [''],
      aprobacion: [false],
      tipoServicio: [''],
      observaciones: [''],
      factura: ['', [Validators.required]],
      tipoFactura: ['', [Validators.required]],
      cotizacion: [''],
      comprobante: [''],
      empresa: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      usuarioCreated: [this.usr],
      dateCreated: [{ value: this.functionsService.numberToDate(this.today), disabled: true }],
      activated: [true],
      lastEdited: [this.today]
    })
  }


  onSubmit() {
    this.loading = true
    this.submited = true
    let date = new Date(this.form.value.fechaSolicitud).getTime()

    this.form.value.fechaSolicitud = this.today
    this.form.value.fechaSolicitud = date



    this.loading = false





    if (this.form.valid) {
      this.form.value.proveedor = this.form.value.proveedor.toUpperCase().trim()
      this.form.value.concepto = this.form.value.concepto.toUpperCase().trim()
      this.form.value.dateCreated = this.today

      let pagoProgramado = {
        consecutivo: this.form.value.consecutivo,
        urgente: this.form.value.urgente,
        subsidiaria: this.form.value.subsidiaria,
        tipoGasto: this.form.value.tipoGasto,
        terminoPago: this.form.value.terminoPago,
        proveedor: this.form.value.proveedor,
        proveedorLoop: this.form.value.proveedorLoop,
        clienteLoop: this.form.value.clienteLoop,
        impExpLoop: this.form.value.impExpLoop,
        concepto: this.form.value.concepto,
        conceptoLoop: this.form.value.conceptoLoop,
        otroConcepto: this.form.value.otroConcepto,
        cantidad: this.form.value.cantidad,
        fechaSolicitud: (new Date(this.form.value.fechaSolicitud).getTime()) + 100000000,
        fechaPago: this.form.value.fechaPago,
        pagado: this.form.value.pagado,
        fechaProgramada: (new Date(this.form.value.fechaProgramada).getTime()) + 100000000,
        fechaVencimiento: (new Date(this.form.value.fechaVencimiento).getTime()) + 100000000,
        quote: this.form.value.quote,
        aprobacion: this.form.value.aprobacion,
        tipoServicio: this.form.value.tipoServicio,
        observaciones: this.form.value.observaciones,
        factura: this.form.value.factura,
        tipoFactura: this.form.value.tipoFactura,
        cotizacion: this.form.value.cotizacion,
        comprobante: this.form.value.comprobante,
        empresa: this.form.value.empresa,
        moneda: this.form.value.moneda,
        usuarioCreated: this.form.value.usuarioCreated,
        dateCreated: this.form.value.dateCreated,
        activated: this.form.value.activated,
        lastEdited: this.form.value.lastEdited,
        url: this.url

      }
      // console.log('pagoProgramado', pagoProgramado)
      return
      this.pagoProgramadoService.crearPagoProgramado(pagoProgramado).subscribe((resp: any) => {
        this.pagoProgramado = resp.pagoProgramado
        this.functionsService.alert('Pago Programado', 'creado', 'success')
        this.functionsService.navigateTo('core/pagos-programados')
        this.loading = false

      },
        (error) => {
          this.functionsService.alertError(error, 'Pago programado')

          this.loading = false
          this.submited = false
          this.functionsService.alertError(error, 'Pago programado')

        })
    } else {

      //Message
      this.loading = false
      this.submited = false
      this.functionsService.alertForm('Pago programado')
      return
    }






  }

  back() {
    this.functionsService.navigateTo('core/pagos-programados')
  }


  getCatalogos() {
    this.loading = true
    this.pagoProgramadoService.cargarPagoProgramadosAll().subscribe((resp: CargarPagoProgramados) => {
      this.consecutivo = resp.total + 1
      // console.log('this.consecutivo', this.consecutivo)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'terminoPagos')
        this.loading = false
      })
    this.terminoPagoService.cargarTerminoPagosAll().subscribe((resp: CargarTerminoPagos) => {
      this.terminoPagos = this.functionsService.getActives(resp.terminoPagos)
      this.terminoPagosTemp = this.terminoPagos
    },
      (error: any) => {
        this.functionsService.alertError(error, 'terminoPagos')
        this.loading = false
      })
    this.empresasServices.cargarEmpresasAll().subscribe((resp: CargarEmpresas) => {
      this.empresas = this.functionsService.getActives(resp.empresas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'empresas')
        this.loading = false
      })
    this.subsidiariaService.cargarSubsidiariasAll().subscribe((resp: CargarSubsidiarias) => {
      this.subsidiarias = this.functionsService.getActives(resp.subsidiarias)
      this.subsidiariasTemp = this.subsidiarias
    },
      (error: any) => {
        this.functionsService.alertError(error, 'subsidiarias')
        this.loading = false
      })
    this.tipoGastoService.cargarTipoGastosAll().subscribe((resp: CargarTipoGastos) => {
      this.tipoGastos = this.functionsService.getActives(resp.tipoGastos)
      this.tipoGastosTemp = this.tipoGastos
    },
      (error: any) => {
        this.functionsService.alertError(error, 'tipoGastos')
        this.loading = false
      })
    this.monedasService.cargarMonedasAll().subscribe((resp: CargarMonedas) => {
      this.monedas = this.functionsService.getActives(resp.monedas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Monedas')
        this.loading = false
      })
    this.monedasService.cargarMonedasAll().subscribe((resp: CargarMonedas) => {
      this.monedas = this.functionsService.getActives(resp.monedas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Monedas')
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
    this.conceptosloopService.cargarConceptoLoopsAll().subscribe((resp: CargarConceptoLoops) => {
      this.conceptoLoops = resp.conceptoLoops
      // console.log('this.clienteLoops', this.clienteLoops)
      this.loading = false
    },
      (error) => {
        this.functionsService.alertError(error, 'PagoProgramado')

      });


  }

  setFile(file: any, tipo: string) {
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
    } else {

      this.form.value.date = this.functionsService.DateToNumber(this.form.value.date)


      let pagoProgramado = {
        consecutivo: this.consecutivo,
        urgente: this.form.value.urgente,
        subsidiaria: this.form.value.subsidiaria,
        tipoGasto: this.form.value.tipoGasto,
        terminoPago: this.form.value.terminoPago,
        proveedor: this.form.value.proveedor,
        proveedorLoop: (this.form.value.proveedorLoop == '') ? null : this.form.value.proveedorLoop,
        clienteLoop: (this.form.value.clienteLoop == '') ? null : this.form.value.clienteLoop,
        impExpLoop: this.form.value.impExpLoop,
        concepto: this.form.value.concepto,
        conceptoLoop: this.form.value.conceptoLoop,
        otroConcepto: this.form.value.otroConcepto,
        cantidad: this.form.value.cantidad,
        fechaSolicitud: (new Date(this.form.value.fechaSolicitud).getTime()) + 100000000,
        fechaPago: this.form.value.fechaPago,
        pagado: this.form.value.pagado,
        fechaProgramada: '',
        fechaVencimiento: (new Date(this.form.value.fechaVencimiento).getTime()) + 100000000,
        quote: this.form.value.quote,
        aprobacion: this.form.value.aprobacion,
        tipoServicio: this.form.value.tipoServicio,
        observaciones: this.form.value.observaciones,
        factura: this.form.value.factura,
        tipoFactura: this.form.value.tipoFactura,
        cotizacion: this.form.value.cotizacion,
        comprobante: this.form.value.comprobante,
        empresa: this.form.value.empresa,
        moneda: this.form.value.moneda,
        usuarioCreated: this.form.value.usuarioCreated,
        dateCreated: this.today,
        activated: this.form.value.activated,
        lastEdited: this.form.value.lastEdited,
        url: this.url

      }
     

      this.pagoProgramadoService.crearPagoProgramado(pagoProgramado).subscribe((resp: any) => {

        this.pagoProgramado = resp.pagoProgramado
        setTimeout(() => {

          this.setPagoProgramado(this.pagoProgramado)
          if (!file.target.files[0]) {
            this.pdfTemp = null
            this.functionsService.alert('Usuarios', 'No se encontró imagen', 'error')
            this.loading = false

          } else {
            const reader = new FileReader()
            const url64 = reader.readAsDataURL(file.target.files[0])
            reader.onloadend = () => {
              this.pdfTemp = reader.result
            }
            this.subirImagen(tipo)
            this.setPagoProgramado(this.pagoProgramado)
            this.functionsService.alert('Pago Programado', 'creado', 'success')
            this.functionsService.navigateTo('core/pagos-programados')
            this.loading = false


          }
        }, 500);
      },
        (error) => {

          this.loading = false
          this.submited = false
        })
    }
  }
  subirImagen(tipo) {
    this.loading = true
    this.fileService
      .actualizarPago(this.pdfSubir, this.pagoProgramado.uid, tipo)
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
  isDateValid(date) {
    let dt = this.functionsService.DateToNumber(date)
    if (dt >= this.dateMin) {
      this.validDate = true
    } else {
      this.validDate = false
    }
  }


  setPagoProgramado(pagoProgramado: any) {
    this.form = this.fb.group({

      consecutivo: [pagoProgramado.consecutivo],
      urgente: [pagoProgramado.urgente],
      subsidiaria: [pagoProgramado.subsidiaria],
      tipoGasto: [pagoProgramado.tipoGasto],
      terminoPago: [pagoProgramado.terminoPago],
      proveedor: [pagoProgramado.proveedor],
      proveedorLoop: [pagoProgramado.proveedorLoop],
      clienteLoop: [pagoProgramado.clienteLoop],
      impExpLoop: [pagoProgramado.impExpLoop],
      concepto: [pagoProgramado.concepto],
      conceptoLoop: [pagoProgramado.conceptoLoop],
      otroConcepto: [pagoProgramado.otroConcepto],
      cantidad: [pagoProgramado.cantidad],
      fechaSolicitud: [pagoProgramado.fechaSolicitud],
      fechaPago: [pagoProgramado.fechaPago],
      pagado: [pagoProgramado.pagado],
      fechaProgramada: [pagoProgramado.fechaProgramada],
      fechaVencimiento: [pagoProgramado.fechaVencimiento],
      quote: [pagoProgramado.quote],
      aprobacion: [pagoProgramado.aprobacion],
      tipoServicio: [pagoProgramado.tipoServicio],
      observaciones: [pagoProgramado.observaciones],
      factura: [pagoProgramado.factura],
      tipoFactura: [pagoProgramado.tipoFactura],
      cotizacion: [pagoProgramado.cotizacion],
      comprobante: [pagoProgramado.comprobante],
      empresa: [pagoProgramado.empresa],
      moneda: [pagoProgramado.moneda],
      usuarioCreated: [pagoProgramado.usuarioCreated],
      dateCreated: [pagoProgramado.dateCreated],
      activated: [pagoProgramado.activated],
      lastEdited: [pagoProgramado.lastEdited],


    })
  }

  selectEmpresa(empresa) {
    // console.log('empresa::: ', empresa);

    this.subsidiarias = this.subsidiariasTemp
    // // console.log(' this.subsidiarias::: ', this.subsidiarias);
    this.tipoGastos = this.tipoGastosTemp
    this.terminoPagos = this.terminoPagosTemp


    this.subsidiarias = this.subsidiarias.filter((sub: any) => {

      this.form.patchValue({ fechaSolicitada: '' })
      if (sub.empresa._id == empresa) {
        return sub
      }
    })
    // // console.log('this.subsidiarias::: ', this.subsidiarias);
    this.tipoGastos = this.tipoGastos.filter((tg: any) => { return tg.empresa._id == empresa })
    this.terminoPagos = this.terminoPagos.filter((tp: any) => { return tp.empresa._id == empresa })
    if (empresa == this.LOOP) {
      this.isLoop = true
      this.dateMin = this.functionsService.getToday() + 345600000


    } else {

      this.isLoop = false
      this.dateMin = this.functionsService.getToday() + 1209600000

    }


  }
  selectTipoFactura(factura) {
    // console.log('factura', factura)

  }
  validateConcepto(otro: string) {
    console.log('otro', otro)
    if(otro ==this.OTCONCEPTO){
      this.otrConcepto= true
    }else{
      this.otrConcepto= false
      this.form.patchValue({otroConcepto :''})
      
    }
    

  }

}

