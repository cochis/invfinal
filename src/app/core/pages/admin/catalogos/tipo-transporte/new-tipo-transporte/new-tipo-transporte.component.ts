import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Carga } from 'src/app/core/models/carga.model';
import { CargasService } from 'src/app/core/services/cargas.service';
import { TipoTransportesService } from 'src/app/core/services/tipoTransporte.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-new-tipo-transporte',
  templateUrl: './new-tipo-transporte.component.html',
  styleUrls: ['./new-tipo-transporte.component.css']
})
export class NewTipoTransporteComponent {
  loading = false
  cargas: Carga[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private tipoTransportesService: TipoTransportesService,
  ) {
    this.loading = true

    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }




  createForm() {
    this.form = this.fb.group({
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
      this.tipoTransportesService.crearTipoTransporte(this.form.value).subscribe((resp: any) => {
        this.functionsService.alert('Cargas', 'Tipo de carga creado', 'success')
        this.functionsService.navigateTo('core/catalogos/tipo-transporte')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Tipo Cargas')

          this.loading = false
          this.functionsService.alertError(error,'Tipo Cargas')

        })
    } else {

      //Message
      this.loading = false
      this.functionsService.alertForm('Tipo Cargas')
      return 
    }






  }

  back() {
    this.functionsService.navigateTo('core/catalogos/tipoTransporte')
  }

}

