import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarMoneda } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Moneda } from 'src/app/core/models/moneda.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { MonedasService } from 'src/app/core/services/monedas.service';
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-moneda',
  templateUrl: './edit-moneda.component.html',
  styleUrls: ['./edit-moneda.component.css']
})
export class EditMonedaComponent  {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  moneda: Moneda
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url

  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
 private monedasService: MonedasService,
 private route: ActivatedRoute,
 ) {
    this.id = this.route.snapshot.params['id']
   

    this.edit = this.route.snapshot.params['edit']
    
    this.loading = true

    this.getId(this.id)
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }
  getId(id: string) {

    this.loading = true
    this.monedasService.cargarMonedaById(id).subscribe((resp: CargarMoneda) => {
      

      this.moneda = resp.moneda
  

      setTimeout(() => {

        this.setForm(this.moneda)
      }, 500);

    },
      (error: any) => {
        this.loading = false
        this.functionsService.alertError(error,'Tipo ticket')


      })
  }




  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(moneda: Moneda) {
 

    this.form = this.fb.group({
      nombre: [moneda.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [moneda.clave, [Validators.required, Validators.minLength(3)]],
      activated: [moneda.activated],
      dateCreated: [moneda.dateCreated],
      lastEdited: [this.today],
    })
    
 



  }

  onSubmit() {
    this.loading = true
    this.form.value.nombre = this.form.value.nombre.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()

    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Tipo Ticket')
      this.loading = false
      return
    }


    if (this.form.valid) {

      this.moneda = {
        ...this.moneda,
        ...this.form.value,


      }

      this.monedasService.actualizarMoneda(this.moneda).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Moneda')
        this.functionsService.navigateTo('core/catalogos/moneda')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Moneda')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/moneda')
  }

}
