import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarFacturas, CargarMonedas, CargarSolicitudViaje, CargarTipoSolicitudViajes, CargarTipoTransportes, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Factura } from 'src/app/core/models/factura.model';
import { Moneda } from 'src/app/core/models/moneda.model';

import { SolicitudViaje } from 'src/app/core/models/solicitudViaje.model';
import { Subsidiaria } from 'src/app/core/models/subsidiaria.model';
import { TerminoPago } from 'src/app/core/models/terminoPago.model';
import { TipoGasto } from 'src/app/core/models/tipoGasto.model';

import { TipoSolicitudViaje } from 'src/app/core/models/tipoSolicitudViaje.model';
import { TipoTransporte } from 'src/app/core/models/tipoTransporte.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { FacturasService } from 'src/app/core/services/facturas.service';
import { MonedasService } from 'src/app/core/services/monedas.service';

import { PagoProgramadoService } from 'src/app/core/services/pagoProgramado.service';

import { SolicitudViajesService } from 'src/app/core/services/solicitudViaje.service';

import { TipoSolicitudViajesService } from 'src/app/core/services/tipoSolicitudViaje.service';
import { TipoTransportesService } from 'src/app/core/services/tipoTransporte.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-solicitud-viaje',
  templateUrl: './edit-solicitud-viaje.component.html',
  styleUrls: ['./edit-solicitud-viaje.component.css']
})
export class EditSolicitudViajeComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  solicitudViaje: SolicitudViaje
  public form!: FormGroup
  public formFact!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  tipoTransportes: TipoTransporte[]
  terminoPagos: TerminoPago[]
  subsidiarias: Subsidiaria[]
  tipoGastos: TipoGasto[]
  monedas: Moneda[]
  facturas: Factura[]
  url = environment.base_url
  DLL = environment.DLL
  MXN = environment.MXN
  empleado: any
  usuarios: Usuario[]
  tipoSolicitudViajes: TipoSolicitudViaje[]
  submited: boolean = false
  disabledB = false
  usr = this.functionsService.getLocal('uid')
  uid = this.functionsService.getLocal('uid')
  rol = this.functionsService.getLocal('role')
  isFactura: boolean = false
  ADM = environment.ADM
  CTB = environment.CTB
  CTM = environment.CTM
  EMJ = environment.EMJ
  EML = environment.EML
  REH = environment.REH
  MAQ = environment.MAQ
  COP = environment.COP
  PGP = environment.PGP
  SUP = environment.SUP

  todayT = this.functionsService.numberToDate(this.today)
  editComplete: boolean = false
  environment: any;
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private pagoProgramadoService: PagoProgramadoService,
    private route: ActivatedRoute,
    private usuariosService: UsuariosService,
    private tipoTransportesService: TipoTransportesService,
    private monedasService: MonedasService,
    private tipoSolicitudViajesService: TipoSolicitudViajesService,
    private solicitudViajesService: SolicitudViajesService,
    private facturaService: FacturasService,
  ) {
    this.id = this.route.snapshot.params['id']
    this.edit = this.route.snapshot.params['edit']
    if (this.rol.includes(this.ADM) || this.rol.includes(this.SUP)) { this.editComplete = true } else { this.editComplete = false }

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
    this.solicitudViajesService.cargarSolicitudViajeById(id).subscribe((resp: CargarSolicitudViaje) => {
      this.solicitudViaje = resp.solicitudViaje
      setTimeout(() => {
        this.setForm(this.solicitudViaje)
      }, 500);
    },
      (error: any) => {
        this.loading = false
        this.functionsService.alertError(error, 'Tipo stock')
      })
  }

  createForm() {
    this.form = this.fb.group({
      aprobado: [false],
      tipoSolicitudViaje: ['', [Validators.required]],
      empleado: ['', [Validators.required]],
      dateViaje: ['', [Validators.required]],
      duracion: ['', [Validators.required, Validators.min(0)]],
      destino: ['', [Validators.required, Validators.minLength(3)]],
      proposito: ['', [Validators.required, Validators.minLength(3)]],
      dateSalida: ['', [Validators.required]],
      dateRegreso: ['', [Validators.required]],
      moneda: ['', [Validators.required]],
      medioTransporte: [],
      tipoTransporte: [],
      detalleTransporte: [],
      numeroTransporte: [''],
      cantidadSolicitada: ['', [Validators.required]],
      cantidadAprobada: [''],
      cantidadRegreso: [''],
      fechaAprobacion: [''],
      fechaPagado: [''],
      pagado: [false],
      usuarioCreated: [],
      activated: [],
      dateCreated: [''],
      lastEdited: [],
    })
  }
  setForm(solicitudViaje: any) {
    this.empleado = this.solicitudViaje.empleado
    var solicitud = {
      tipoSolicitudViaje: '',
      empleado: '',
      dateViaje: '',
      duracion: '',
      destino: '',
      proposito: '',
      dateSalida: '',
      dateRegreso: '',
      medioTransporte: '',
      tipoTransporte: '',
      detalleTransporte: '',
      numeroTransporte: '',
      cantidadSolicitada: '',
      cantidadAprobada: '',
      cantidadJustifico: '',
      cantidadRegreso: '',
      aprobado: '',
      moneda: '',
      pagado: false,
      fechaPagado: '',
      fechaAprobacion: '',
      usuarioCreated: '',
      activated: '',
      dateCreated: '',
      lastEdited: ''
    }
    if (this.editComplete && this.edit == 'true') {
      solicitud.tipoSolicitudViaje = solicitudViaje.tipoSolicitudViaje._id
      solicitud.tipoTransporte = solicitudViaje.tipoTransporte._id
      solicitud.moneda = solicitudViaje.moneda._id
    } else if (this.editComplete && this.edit == 'false') {
      solicitud.tipoSolicitudViaje = solicitudViaje.tipoSolicitudViaje.nombre
      solicitud.tipoTransporte = solicitudViaje.tipoTransporte.nombre
      solicitud.moneda = solicitudViaje.moneda.nombre

    } else if (!this.editComplete && this.edit == 'true') {
      solicitud.tipoSolicitudViaje = solicitudViaje.tipoSolicitudViaje._id
      solicitud.tipoTransporte = solicitudViaje.tipoTransporte._id
      solicitud.moneda = solicitudViaje.moneda._id
    }
    else {
      solicitud.tipoSolicitudViaje = solicitudViaje.tipoSolicitudViaje.nombre
      solicitud.tipoTransporte = solicitudViaje.tipoTransporte.nombre
      solicitud.moneda = solicitudViaje.moneda.nombre
    }
    this.form = this.fb.group({


      tipoSolicitudViaje: [solicitud.tipoSolicitudViaje, [Validators.required]],
      empleado: [solicitudViaje.empleado ? (solicitudViaje.empleado.nombre + ' ' + solicitudViaje.empleado.apellidoPaterno) : '', [Validators.required]],
      dateViaje: [solicitudViaje.dateViaje ? this.functionsService.numberToDate(solicitudViaje.dateViaje) : '', [Validators.required]],
      duracion: [solicitudViaje.duracion ? solicitudViaje.duracion : '', [Validators.required, Validators.min(0)]],
      destino: [solicitudViaje.destino ? solicitudViaje.destino : '', [Validators.required, Validators.minLength(3)]],
      proposito: [solicitudViaje.proposito ? solicitudViaje.proposito : '', [Validators.required, Validators.minLength(3)]],
      dateSalida: [solicitudViaje.dateSalida ? this.functionsService.numberToDate(solicitudViaje.dateSalida) : '', [Validators.required]],
      dateRegreso: [solicitudViaje.dateRegreso ? this.functionsService.numberToDate(solicitudViaje.dateRegreso) : '', [Validators.required]],
      medioTransporte: [solicitudViaje.medioTransporte ? solicitudViaje.medioTransporte : ''],
      tipoTransporte: [solicitud.tipoTransporte, [Validators.required]],
      moneda: [solicitud.moneda, [Validators.required]],
      detalleTransporte: [solicitudViaje.detalleTransporte ? solicitudViaje.detalleTransporte : ''],
      numeroTransporte: [solicitudViaje.numeroTransporte ? solicitudViaje.numeroTransporte : ''],
      cantidadSolicitada: [solicitudViaje.cantidadSolicitada ? solicitudViaje.cantidadSolicitada : '', [Validators.required]],
      cantidadJustifico: [this.getTotalFacturas()],
      cantidadAprobada: [(this.functionsService.validateRol(this.rol, this.SUP) || this.functionsService.validateRol(this.rol, this.CTB) || this.functionsService.validateRol(this.rol, this.CTM)) ? { value: solicitudViaje.cantidadAprobada ? solicitudViaje.cantidadAprobada : '', disabled: false } : { value: solicitudViaje.cantidadAprobada ? solicitudViaje.cantidadAprobada : '', disabled: true }],
      cantidadRegreso: [(this.functionsService.validateRol(this.rol, this.EMJ)) ? { value: solicitudViaje.cantidadRegreso, disabled: false } : { value: solicitudViaje.cantidadRegreso, disabled: true }],
      aprobado: [this.functionsService.validateRol(this.rol, this.SUP) ? { value: solicitudViaje.aprobado ? solicitudViaje.aprobado : '', disabled: false } : { value: solicitudViaje.aprobado ? solicitudViaje.aprobado : '', disabled: true }],
      pagado: [this.functionsService.validateRol(this.rol, this.SUP) ? { value: solicitudViaje.pagado ? solicitudViaje.pagado : '', disabled: false } : { value: solicitudViaje.pagado ? solicitudViaje.pagado : '', disabled: true }],
      fechaAprobacion: [solicitudViaje.fechaAprobacion ? this.functionsService.numberToDate(solicitudViaje.fechaAprobacion) : ''],
      fechaPagado: [solicitudViaje.fechaPagado ? this.functionsService.numberToDate(solicitudViaje.fechaPagado) : ''],
      usuarioCreated: [solicitudViaje.usuarioCreated ? solicitudViaje.usuarioCreated : ''],
      activated: [solicitudViaje.activated ? solicitudViaje.activated : ''],
      dateCreated: [solicitudViaje.dateCreated ? solicitudViaje.dateCreated : ''],
      lastEdited: [this.today,],
    })
  }
  async cleanSendForm(form: any) {
    form = {
      aprobado: (form.aprobado == '') ? false : form.aprobado,
      tipoSolicitudViaje: (typeof (form.tipoSolicitudViaje) == 'string') ? form.tipoSolicitudViaje : form.tipoSolicitudViaje._id,
      empleado: this.empleado._id,
      dateViaje: (typeof (form.dateViaje) == 'string') ? this.functionsService.DateToNumber(form.dateViaje) : form.dateViaje,
      duracion: form.duracion,
      destino: form.destino,
      proposito: form.proposito,
      dateSalida: (typeof (form.dateSalida) == 'string') ? this.functionsService.DateToNumber(form.dateSalida) + 100000000 : form.dateSalida + 100000000,
      dateRegreso: (typeof (form.dateRegreso) == 'string') ? this.functionsService.DateToNumber(form.dateRegreso) + 100000000 : form.dateRegreso + 100000000,
      moneda: (typeof (form.moneda) == 'string') ? form.moneda : form.moneda._id,
      medioTransporte: form.medioTransporte,
      tipoTransporte: (typeof (form.tipoTransporte) == 'string') ? form.tipoTransporte : form.tipoTransporte._id,
      detalleTransporte: form.detalleTransporte,
      numeroTransporte: form.numeroTransporte,
      cantidadSolicitada: form.cantidadSolicitada,
      cantidadAprobada: form.cantidadAprobada,
      cantidadRegreso: (form.cantidadSolicitada - form.cantidadJustifico).toFixed(2),
      fechaAprobacion: (typeof (form.fechaAprobacion) == 'string') ? this.functionsService.DateToNumber(form.fechaAprobacion) + 100000000 : form.fechaAprobacion + 100000000,
      fechaPagado: (typeof (form.fechaPagado) == 'string') ? this.functionsService.DateToNumber(form.fechaPagado) + 100000000 : form.fechaPagado + 100000000,
      pagado: (form.pagado == '') ? false : form.pagado,
      usuarioCreated: this.form.value.usuarioCreated._id,

      activated: form.activated,
      dateCreated: (typeof (form.dateCreated) == 'string') ? this.functionsService.DateToNumber(form.dateCreated) + 100000000 : form.dateCreated + 100000000,
      lastEdited: this.today,
      uid: this.id
    }



    return await form
  }
  async onSubmit() {
    this.loading = true
    this.loading = false
    let solicitud = await this.cleanSendForm(this.form.value)
    solicitud = {
      ...solicitud,
      url: this.url,
    }
    if (this.form.valid) {
      this.solicitudViajesService.actualizarSolicitudViaje(solicitud).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Solicitud de viaje')
        this.functionsService.navigateTo('core/viajes')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Solicitud de viaje')
          this.loading = false
        })
    } else {
      this.functionsService.alertForm('Solicitud de viaje')
      this.loading = false
      return
    }

  }
  getUsuario(usuarios: any) {

    usuarios.forEach(usr => {
      if (usr.uid == this.uid) {
        this.empleado = usr

      }
    });
    this.form.get("empleado").setValue((this.empleado.nombre + '' + this.empleado.apellidoPaterno));

  }

  back() {
    this.functionsService.navigateTo('core/viajes')
  }
  getCatalogos() {
    this.loading = true
    this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
      this.usuarios = this.functionsService.getActivos(resp.usuarios)

      this.getUsuario(this.usuarios)
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
    this.monedasService.cargarMonedasAll().subscribe((resp: CargarMonedas) => {
      this.monedas = this.functionsService.getActivos(resp.monedas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Monedas')
        this.loading = false
      })
    this.facturaService.cargarFacturasSolicitud(this.id).subscribe((resp: CargarFacturas) => {
      this.facturas = this.functionsService.getActivos(resp.facturas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Facturas')
        this.loading = false
      })
  }
  getTotalFacturas() {


    this.facturaService.cargarFacturasSolicitud(this.id).subscribe((resp: CargarFacturas) => {
      this.facturas = this.functionsService.getActivos(resp.facturas)
      let total = 0
      this.facturas.forEach((fac: any) => {
        if (fac.activated) {
          total = total + (fac.currencyExchange * fac.cantidad)
        }
      });
      this.form.patchValue({ cantidadJustifico: total.toFixed(2) })
      return total.toFixed(2)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'Facturas')
        this.loading = false
      })
  }
  async newFactura(event) {
    this.isFactura = event.new
    this.getTotalFacturas()
    this.form.patchValue({ cantidadRegreso: (this.form.value.cantidadSolicitada - this.form.value.cantidadJustifico).toFixed(2), })
    setTimeout(async () => {
      if (!event.new && !event.ok) {
        this.loading = true
        let solicitud = await this.cleanSendForm(this.form.value)
        solicitud = {
          ...solicitud,
          url: this.url,
        }
        this.solicitudViajesService.actualizarSolicitudViaje(solicitud).subscribe((resp: any) => {
          this.getId(this.id)
          this.loading = false
        },
          (error) => {
            this.functionsService.alertError(error, 'Solicitud de viaje')
            this.loading = false
          })
      }
    }, 800);

  }
  calculaDias(event) {
    try {
      const fecha = this.form.value.dateViaje.split('-')
      let fechaIn = String(fecha[1].trim()) + '/' + String(fecha[2].trim()) + '/' + String(fecha[0].trim())
      var fechaFormat = new Date(fechaIn)
      fechaFormat.setDate(fechaFormat.getDate() + Number(this.form.value.duracion))
      let year = fechaFormat.getFullYear()
      let month: any = Number(fechaFormat.getMonth() + 1)
      let day: any = Number(fechaFormat.getDate())
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      let fechaF = year + '-' + month + '-' + day
      this.form.patchValue({
        dateSalida: this.form.value.dateViaje,
        dateRegreso: fechaF
      })
    } catch (error) {
      console.error('error', error)

    }
  }
  aprobar() {
    let solicitudViaje = {
      ...this.solicitudViaje,
      aprobado: this.form.value.aprobado,
      fechaAprobacion: this.form.value.aprobado ? this.today : null,
      cantidadAprobada: this.form.value.aprobado ? this.form.value.cantidadAprobada ? this.form.value.cantidadAprobada : this.form.value.cantidadSolicitada : '',
      cantidadJustifico: this.getTotalFacturas()
    }

    this.solicitudViajesService.actualizarSolicitudViaje(solicitudViaje).subscribe((resp: any) => {
      if (this.form.value.aprobado) {

        this.functionsService.alertUpdate('Solicitud aprobada')
      } else {

        this.functionsService.alertUpdate('Solicitud desaprobada')
      }
      this.getId(this.id)
      this.loading = false
    },
      (error) => {
        console.error('error', error)

      })
  }
  pagar(evt) {
    if (evt.srcElement.checked) {
      this.form.patchValue({
        fechaPagado: this.functionsService.numberToDate(this.today)
      })
    } else {
      this.form.patchValue({
        fechaPagado: ''
      })
    }
  }
}
