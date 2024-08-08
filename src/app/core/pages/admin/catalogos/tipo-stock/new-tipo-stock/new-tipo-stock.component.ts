import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoStock } from 'src/app/core/models/tipoStock.model';
import { TipoStockService } from 'src/app/core/services/tipoStock.service';


import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-new-tipo-stock',
  templateUrl: './new-tipo-stock.component.html',
  styleUrls: ['./new-tipo-stock.component.css']
})
export class NewTipoStockComponent {
  loading = false
  tipoStock: TipoStock[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private tipoStocksService: TipoStockService,
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
      this.tipoStocksService.crearTipoStock(this.form.value).subscribe((resp: any) => {
        this.functionsService.alert('Tipo stock', 'Tipo stock creado', 'success')
        this.functionsService.navigateTo('core/catalogos/tipoStock')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Tipo Stock')

          this.loading = false
        

        })
    } else {

      //Message
      this.loading = false
      this.functionsService.alertForm('Tipo stock ')
      return 
    }






  }

  back() {
    this.functionsService.navigateTo('core/catalogos/roles')
  }

}

