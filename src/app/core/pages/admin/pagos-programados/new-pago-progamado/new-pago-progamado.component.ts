import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarClienteLoops, CargarEmpresas, CargarMonedas, CargarPagoProgramado, CargarPagoProgramados, CargarProveedorLoops, CargarSubsidiarias, CargarTerminoPagos, CargarTipoGastos, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { ClienteLoop } from 'src/app/core/models/clienteLoop.model';
import { Empresa } from 'src/app/core/models/Empresa';
import { Moneda } from 'src/app/core/models/moneda.model';
import { PagoProgramado } from 'src/app/core/models/pagoProgramado.model';
import { ProveedorLoop } from 'src/app/core/models/proveedorLoop.model';
import { Subsidiaria } from 'src/app/core/models/subsidiaria.model';
import { TerminoPago } from 'src/app/core/models/terminoPago.model';
import { TipoGasto } from 'src/app/core/models/tipoGasto.model';

import { Usuario } from 'src/app/core/models/usuario.model';
import { ClienteLoopsService } from 'src/app/core/services/clienteLoops.service';
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
  pdfSubir: any
  pdfTemp: any
  usr = this.functionsService.getLocal('uid')
  empresas: Empresa[]
  monedas: Moneda[]
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
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private pagoProgramadoService: PagoProgramadoService,
    private tipoGastoService: TipoGastoService,
    private monedasService: MonedasService,
    private terminoPagoService: TerminoPagoService,
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
      concepto: ['', [Validators.required]],
      cantidad: ['', [Validators.required]],
      fechaSolicitud: ['', [Validators.required]],
      fechaPago: [''  ],
      pagado: [false  ],
      fechaProgramada: [''  ],
      fechaVencimiento: [''  ],
      quote: [''  ],
      aprobacion: [false  ],
      tipoServicio: [''  ],
      observaciones: [''  ],
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
        activated: this.form.value.activated,
        cantidad: this.form.value.cantidad,
        concepto: this.form.value.concepto,
        dateCreated: this.today,
        fechaSolicitud: (new Date(this.form.value.fechaSolicitud).getTime()) + 100000000,
        lastEdited: this.form.value.lastEdited,
        proveedor: this.form.value.proveedor,
        subsidiaria: this.form.value.subsidiaria,
        terminoPago: this.form.value.terminoPago,
        tipoGasto: this.form.value.tipoGasto,
        moneda: this.form.value.moneda,
        usuarioCreated: this.usr,
        url: this.url

      }


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
      this.consecutivo = resp.total +1
      console.log('this.consecutivo', this.consecutivo)
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
        console.log('this.proveedorLoops', this.proveedorLoops)
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'PagoProgramado')
  
        });
      this.clienteLoopsService.cargarClienteLoopsAll().subscribe((resp: CargarClienteLoops) => {
        this.clienteLoops = resp.clienteLoops
        console.log('this.clienteLoops', this.clienteLoops)
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'PagoProgramado')
  
        });
  

  }

  setFile(file: any) {
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
        this.subirImagen()
        setTimeout(() => {

          this.setPagoProgramado(this.pagoProgramado)
          this.loading = false
        }, 550);

      }
    } else {

      this.form.value.date = this.functionsService.DateToNumber(this.form.value.date)

      let pagoProgramado = {
        consecutivo: this.consecutivo,
        activated: this.form.value.activated,
        cantidad: this.form.value.cantidad,
        urgente: this.form.value.urgente,
        concepto: this.form.value.concepto,
        dateCreated: this.today,
        fechaSolicitud: (new Date(this.form.value.fechaSolicitud).getTime()) + 100000000,
        lastEdited: this.form.value.lastEdited,
        proveedor: this.form.value.proveedor,
        empresa: this.form.value.empresa,
        subsidiaria: this.form.value.subsidiaria,
        terminoPago: this.form.value.terminoPago,
        tipoGasto: this.form.value.tipoGasto,
        moneda: this.form.value.moneda,
        usuarioCreated: this.usr,
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
            this.subirImagen()
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
  isDateValid(date) {
    let dt = this.functionsService.DateToNumber(date)
    if (dt >= this.dateMin) {
      this.validDate = true
    } else {
      this.validDate = false
    }
  }
  subirImagen() {
    this.loading = true
    this.fileService
      .actualizarFoto(this.pdfSubir, 'pagoProgramado', this.pagoProgramado.uid)
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
    this.form = this.fb.group({
      activated: [pagoProgramado.activated],
      cantidad: [pagoProgramado.cantidad],
      concepto: [pagoProgramado.concepto],
      dateCreated: [pagoProgramado.dateCreated],
      fechaSolicitud: [pagoProgramado.fechaSolicitud],
      lastEdited: [pagoProgramado.lastEdited],
      proveedor: [pagoProgramado.proveedor],
      subsidiaria: [pagoProgramado.subsidiaria],
      terminoPago: [pagoProgramado.terminoPago],
      tipoGasto: [pagoProgramado.tipoGasto],
      moneda: [pagoProgramado.moneda],
      usuarioCreated: [pagoProgramado.usuarioCreated],
    })
  }

  selectEmpresa(empresa) {
    console.log('empresa::: ', empresa);

    this.subsidiarias = this.subsidiariasTemp
    // console.log(' this.subsidiarias::: ', this.subsidiarias);
    this.tipoGastos = this.tipoGastosTemp
    this.terminoPagos = this.terminoPagosTemp


    this.subsidiarias = this.subsidiarias.filter((sub: any) => {
     
      this.form.patchValue({fechaSolicitada:''})
      if (sub.empresa._id == empresa) {
        return sub
      }
    })
    // console.log('this.subsidiarias::: ', this.subsidiarias);
    this.tipoGastos = this.tipoGastos.filter((tg: any) => { return tg.empresa._id == empresa })
    this.terminoPagos = this.terminoPagos.filter((tp: any) => { return tp.empresa._id == empresa })
    if (empresa == '66a7d0898e30740fa7670bf4') {
      this.isLoop = true
      this.dateMin = this.functionsService.getToday() + 345600000


    } else {
      
      this.isLoop = false
      this.dateMin = this.functionsService.getToday() + 1209600000
 
    }
   

  }
  selectTipoFactura(factura){
    console.log('factura', factura)

  }


}

