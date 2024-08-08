import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarEmpresas, CargarMonedas, CargarPagoProgramado, CargarPagoProgramados, CargarSubsidiarias, CargarTerminoPagos, CargarTipoGastos, CargarTipoProveedor } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Empresa } from 'src/app/core/models/Empresa';
import { Moneda } from 'src/app/core/models/moneda.model';
import { PagoProgramado } from 'src/app/core/models/pagoProgramado.model';
import { Subsidiaria } from 'src/app/core/models/subsidiaria.model';
import { TerminoPago } from 'src/app/core/models/terminoPago.model';
import { TipoGasto } from 'src/app/core/models/tipoGasto.model';
import { TipoProveedor } from 'src/app/core/models/tipoProveedor.model';
import { MonedasService } from 'src/app/core/services/monedas.service';
import { PagoProgramadoService } from 'src/app/core/services/pagoProgramado.service';
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
  pagoProgramado: PagoProgramado
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  terminoPagos: TerminoPago[]
  subsidiarias: Subsidiaria[]
  empresas: Empresa[]
  tipoGastos: TipoGasto[]
  monedas: Moneda[]
  url = environment.base_url
  usr = this.functionsService.getLocal('uid')
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private pagoProgramadoService: PagoProgramadoService,
    private route: ActivatedRoute,
    private tipoGastoService: TipoGastoService,
    private monedaService: MonedasService,
    private terminoPagoService: TerminoPagoService,
    private subsidiariaService: SubsidiariaService,
    private empresaService: EmpresasService,
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
        this.functionsService.alertError(error, 'Tipo stock')
      })
  }
createForm() {
    this.form = this.fb.group({
      subsidiaria: [''],
      tipoGasto: [''],
      terminoPago: [''],
      proveedor: [''],
      concepto: [''],
      cantidad: [''],
      fechaSolicitud: [''],
      dateCreated: [''],
      lastEdited: [''],
      usuarioCreated: [''],
      fechaPago: [''],
      fechaProgramada: [''],
      aprobacion: [''],
      moneda: [''],
      pagado: [''],
      empresa: [''],
      observaciones: [''],
      activated: [''],
    })
  }
  setForm(pagoProgramado: any) {
    console.log('pagoProgramado', pagoProgramado.empresa)
    
    console.log('typeof(pagoProgramado.empresa)', typeof(pagoProgramado.empresa))
    var ok = false
    if (this.usr == pagoProgramado.tipoGasto.aprobacionPor ) {
      ok = true
    }
    this.form = this.fb.group({
      subsidiaria: [pagoProgramado.subsidiaria._id],
      tipoGasto: [pagoProgramado.tipoGasto._id],
      terminoPago: [pagoProgramado.terminoPago._id],
      moneda: [pagoProgramado.moneda._id],
      proveedor: [pagoProgramado.proveedor],
      concepto: [pagoProgramado.concepto],
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
    this.form.value.dateCreated = new Date(this.form.value.dateCreated).getTime() + 100000000
    this.form.value.aprobacion = (this.form.value.aprobacion == 'false' || this.form.value.aprobacion == false) ? false : true,
      this.form.value.fechaPago = (this.form.value.fechaPago !== '') ? new Date(this.form.value.fechaPago).getTime() : ''
    this.form.value.fechaProgramada = (this.form.value.fechaProgramada !== '') ? new Date(this.form.value.fechaProgramada).getTime() : ''
    this.form.value.usuarioCreated = this.form.value.usuarioCreated._id
    // this.loading = false
    //   return


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
      this.functionsService.alertForm('Tipo stock')
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
    this.monedaService.cargarMonedasAll().subscribe((resp: CargarMonedas) => {
      this.monedas = this.functionsService.getActives(resp.monedas)
    },
      (error: any) => {
        this.functionsService.alertError(error, 'tipoGastos')
        this.loading = false
      })
  }

  updateForm(event) {


  }
}
