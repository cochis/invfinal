import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarEmpresas, CargarTerminoPago } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Empresa } from 'src/app/core/models/Empresa';
import { TerminoPago } from 'src/app/core/models/terminoPago.model';
import { EmpresasService } from 'src/app/core/services/puesto.service copy';
import { TerminoPagoService } from 'src/app/core/services/terminoPago.service';



import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-termino-pago',
  templateUrl: './edit-termino-pago.component.html',
  styleUrls: ['./edit-termino-pago.component.css']
})
export class EditTerminoPagoComponent {
  loading = false
  ADM = environment.ADM

  public imagenSubir!: File
  public imgTemp: any = undefined

  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  terminoPago: TerminoPago
  id!: string
  edit: string = 'false'
  estadoInicial!: string
  url = environment.base_url
  addPicture = false
  img = 'default.jpg'
  uid: string = this.functionsService.getLocal('uid')
  rol: string = this.functionsService.getLocal('role')
  empresas: Empresa[]
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private empresasService: EmpresasService,
    private terminoPagosService: TerminoPagoService,
    private route: ActivatedRoute,
  ) {
    this.empresasService.cargarEmpresasAll().subscribe((resp: CargarEmpresas) => {
      this.empresas = resp.empresas
      console.log('this.empresas::: ', this.empresas);
    })
    this.createForm()


    this.id = this.route.snapshot.params['id']
    this.edit = this.route.snapshot.params['edit']
    this.loading = true
    this.getId(this.id)
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 1500);
  }
  getId(id: string) {
    this.loading = true
    this.terminoPagosService.cargarTerminoPagoById(id).subscribe((resp: any) => {

      this.terminoPago = resp.terminoPago
      setTimeout(() => {
        this.setForm(this.terminoPago)
      }, 500);

    },
      (error: any) => {
        this.loading = false
        this.functionsService.alertError(error, 'Carga')


      })
  }


  createForm() {
    this.form = this.fb.group({
      empresa: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(terminoPago: TerminoPago) {


    this.form = this.fb.group({
      empresa: [terminoPago.empresa, [Validators.required, Validators.minLength(3)]],
      nombre: [terminoPago.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [terminoPago.clave, [Validators.required, Validators.minLength(3)]],
      activated: [terminoPago.activated],
      dateCreated: [terminoPago.dateCreated],
      lastEdited: [this.today],
    })

  }

  onSubmit() {
    this.loading = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()

    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Roles')
      this.loading = false
      return
    }


    if (this.form.valid) {

      this.terminoPago = {
        ...this.terminoPago,
        ...this.form.value,


      }

      this.terminoPagosService.actualizarTerminoPago(this.terminoPago).subscribe((resp: any) => {
        this.functionsService.alertUpdate('TerminoPago')
        this.functionsService.navigateTo('core/catalogos/termino-pago')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Tipo de carga')
          this.loading = false


        })
    } else {
      this.functionsService.alertForm('Tipo de carga')
      this.loading = false

      return
    }





  }


  back() {
    this.functionsService.navigateTo('core/catalogos/termino-pago')
  }
}

