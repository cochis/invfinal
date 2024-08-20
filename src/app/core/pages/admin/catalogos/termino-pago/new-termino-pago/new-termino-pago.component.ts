import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarEmpresas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Empresa } from 'src/app/core/models/Empresa';
import { TerminoPago } from 'src/app/core/models/terminoPago.model';
import { EmpresasService } from 'src/app/core/services/puesto.service copy';

import { TerminoPagoService } from 'src/app/core/services/terminoPago.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-new-termino-pago',
  templateUrl: './new-termino-pago.component.html',
  styleUrls: ['./new-termino-pago.component.css']
})
export class NewTerminoPagoComponent {
  loading = false
  terminoPagos: TerminoPago[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  empresas: Empresa[]

  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private empresasService: EmpresasService,
    private subsisidiariasService: TerminoPagoService,
  ) {
    this.loading = true
    this.empresasService.cargarEmpresasAll().subscribe((resp: CargarEmpresas) => {
      this.empresas = resp.empresas
      // console.log('this.empresas::: ', this.empresas);
    })
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }




  createForm() {
    this.form = this.fb.group({
      empresa: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],

      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
      this.form.value.clave = this.form.value.clave.toUpperCase().trim()
  

      let terminoPago = {
        nombre: this.form.value.nombre,
        clave: this.form.value.clave,
        empresa: this.form.value.empresa,
        usuarioCreated: this.functionsService.getLocal('uid')
      }

      this.subsisidiariasService.crearTerminoPago(terminoPago).subscribe((resp: any) => {
        this.functionsService.alert('Terminos de pago', 'Termino de pago creada', 'success')
        this.functionsService.navigateTo('core/catalogos/termino-pago')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'TerminoPago')

          this.loading = false
          this.functionsService.alertError(error, 'TerminoPago')

        })
    } else {

      //Message
      this.loading = false
      this.functionsService.alertForm('TerminoPago')
      return
    }






  }

  back() {
    this.functionsService.navigateTo('core/catalogos/termino-pago')
  }

}

