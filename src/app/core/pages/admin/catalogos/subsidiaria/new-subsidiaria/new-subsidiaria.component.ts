import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarEmpresas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Empresa } from 'src/app/core/models/Empresa';
import { Subsidiaria } from 'src/app/core/models/subsidiaria.model';
import { EmpresasService } from 'src/app/core/services/puesto.service copy';

import { SubsidiariaService } from 'src/app/core/services/subsidiaria.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

@Component({
  selector: 'app-new-subsidiaria',
  templateUrl: './new-subsidiaria.component.html',
  styleUrls: ['./new-subsidiaria.component.css']
})
export class NewSubsidiariaComponent {
  loading = false
  subsidiarias: Subsidiaria[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  empresas: Empresa[]


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private subsisidiariasService: SubsidiariaService,
    private empresasService: EmpresasService,
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
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      empresa: ['', [Validators.required, Validators.minLength(3)]],

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

      let subsidiaria = {
        empresa: this.form.value.empresa,
        nombre: this.form.value.nombre,
        clave: this.form.value.clave,
        usuarioCreated: this.functionsService.getLocal('uid')
      }

      this.subsisidiariasService.crearSubsidiaria(subsidiaria).subscribe((resp: any) => {
        this.functionsService.alert('Subsidiaria', 'subsidiaria creada', 'success')
        this.functionsService.navigateTo('core/catalogos/subsidiaria')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Subsidiaria')

          this.loading = false
          this.functionsService.alertError(error, 'Subsidiaria')

        })
    } else {

      //Message
      this.loading = false
      this.functionsService.alertForm('Subsidiaria')
      return
    }






  }

  back() {
    this.functionsService.navigateTo('core/catalogos/subsidiaria')
  }

}

