import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Carga } from 'src/app/core/models/carga.model';
import { CargasService } from 'src/app/core/services/cargas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-new-carga',
  templateUrl: './new-carga.component.html',
  styleUrls: ['./new-carga.component.css']
})
export class NewCargaComponent {
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
    private cargasService: CargasService,
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
      this.cargasService.crearCarga(this.form.value).subscribe((resp: any) => {
        this.functionsService.alert('Cargas', 'Rol creado', 'success')
        this.functionsService.navigateTo('core/catalogos/carga')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Cargas')

          this.loading = false
          this.functionsService.alertError(error,'Cargas')

        })
    } else {

      //Message
      this.loading = false
      this.functionsService.alertForm('Cargas')
      return 
    }






  }

  back() {
    this.functionsService.navigateTo('core/catalogos/carga')
  }

}

