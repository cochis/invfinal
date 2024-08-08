import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarPlanta, CargarCompanias } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Planta } from 'src/app/core/models/planta.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { PlantasService } from 'src/app/core/services/plantas.service';

import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import { Compania } from 'src/app/core/models/compania.model';
import { CompaniasService } from 'src/app/core/services/companias.service';
@Component({
  selector: 'app-edit-planta',
  templateUrl: './edit-planta.component.html',
  styleUrls: ['./edit-planta.component.css']
})
export class EditPlantaComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  planta: Planta
  companias: Compania[]
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
    private plantasService: PlantasService,
    private companiasService: CompaniasService,
    private route: ActivatedRoute,
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

  getCatalogos() {
    this.loading = true
    this.companiasService.cargarCompaniasAll().subscribe((resp: CargarCompanias) => {
      this.companias = this.functionsService.getActivos(resp.companias)


    },
      (error: any) => {

        this.functionsService.alertError(error, 'Stock')
        this.loading = false


      })
  }
  getId(id: string) {

    this.loading = true
    this.plantasService.cargarPlantaById(id).subscribe((resp: CargarPlanta) => {


      this.planta = resp.planta


      setTimeout(() => {

        this.setForm(this.planta)
      }, 500);

    },
      (error: any) => {
        this.loading = false
        this.functionsService.alertError(error, 'Tipo ticket')


      })
  }




  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      clave: ['', [Validators.required, Validators.minLength(3)]],
      compania: ['', [Validators.required]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(planta: Planta) {


    this.form = this.fb.group({
      nombre: [planta.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [planta.clave, [Validators.required, Validators.minLength(3)]],
      compania: [planta.compania, [Validators.required]],
      activated: [planta.activated],
      dateCreated: [planta.dateCreated],
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

      this.planta = {
        ...this.planta,
        ...this.form.value,


      }

      this.plantasService.actualizarPlanta(this.planta).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Planta')
        this.functionsService.navigateTo('core/catalogos/planta')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'Planta')
          this.loading = false



        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return
    }






  }


  back() {
    this.functionsService.navigateTo('core/catalogos/planta')
  }

}
