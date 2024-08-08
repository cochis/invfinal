import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarMonedas, CargarTipoSolicitudViajes, CargarTipoTransporte, CargarTipoTransportes, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Moneda } from 'src/app/core/models/moneda.model';
import { SolicitudViaje } from 'src/app/core/models/solicitudViaje.model';
import { TipoSolicitudViaje } from 'src/app/core/models/tipoSolicitudViaje.model';
import { TipoTransporte } from 'src/app/core/models/tipoTransporte.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { MonedasService } from 'src/app/core/services/monedas.service';
import { SolicitudViajesService } from 'src/app/core/services/solicitudViaje.service';
import { TipoSolicitudViajesService } from 'src/app/core/services/tipoSolicitudViaje.service';
import { TipoTransportesService } from 'src/app/core/services/tipoTransporte.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-new-solicitud-viaje',
  templateUrl: './new-solicitud-viaje.component.html',
  styleUrls: ['./new-solicitud-viaje.component.css']
})
export class NewSolicitudViajeComponent {
  loading = false
  solicitudViajes: SolicitudViaje[]
  usuarios: Usuario[]
  empleado: Usuario
  tipoSolicitudViajes: TipoSolicitudViaje[]
  monedas: Moneda[]
  tipoTransportes: TipoTransporte[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  solicitudViajendo: boolean = false
  msnOk: boolean = false
  submited: boolean = false
  disabledB = false
  usr = this.functionsService.getLocal('uid')
  uid = this.functionsService.getLocal('uid')
  todayT = this.functionsService.numberToDate(this.today)
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private solicitudViajesService: SolicitudViajesService,
    private usuariosService: UsuariosService,
    private tipoTransportesService: TipoTransportesService,
    private monedasService: MonedasService,
    private tipoSolicitudViajesService: TipoSolicitudViajesService,
  ) {
    this.loading = true


    this.createForm()
    this.getCatalogos()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }



  get errorControl() {
    return this.form.controls;
  }
  createForm() {
    this.form = this.fb.group({
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
      aprobado: [false,],
      fechaAprobacion: ['',],
      usuarioCreated: [this.usr,],
      activated: [true,],
      dateCreated: [this.today,],
      lastEdited: [this.today,],

    })
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
      console.log('error', error)

    }



  }
  getUsuario(usuarios: any) {

    usuarios.forEach(usr => {
      if (usr.uid == this.uid) {
        this.empleado = usr
      }
    });
    this.form.get("empleado").setValue((this.empleado.nombre + ' ' + this.empleado.apellidoPaterno));

  }
  onSubmit() {
    this.loading = true
    this.disabledB = true
    this.submited = true
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
      return
    }






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




  }

}

