import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarEmpresas, CargarSubsidiaria } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Empresa } from 'src/app/core/models/Empresa';
import { Subsidiaria } from 'src/app/core/models/subsidiaria.model';
import { EmpresasService } from 'src/app/core/services/puesto.service copy';
import { SubsidiariaService } from 'src/app/core/services/subsidiaria.service';



import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-subsidiaria',
  templateUrl: './edit-subsidiaria.component.html',
  styleUrls: ['./edit-subsidiaria.component.css']
})
export class EditSubsidiariaComponent {
  loading = false
  ADM = environment.ADM

  public imagenSubir!: File
  public imgTemp: any = undefined

  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  subsidiaria: Subsidiaria
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
    private subsidiariasService: SubsidiariaService,
    private route: ActivatedRoute,
  ) {
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
    this.empresasService.cargarEmpresasAll().subscribe((resp: CargarEmpresas) => {
      this.empresas = resp.empresas
      console.log('this.empresas::: ', this.empresas);
    })
    this.subsidiariasService.cargarSubsidiariaById(id).subscribe((resp: Subsidiaria) => {

      this.subsidiaria = resp.subsidiaria
      setTimeout(() => {
        this.setForm(this.subsidiaria)
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
  setForm(subsidiaria: Subsidiaria) {


    this.form = this.fb.group({
      empresa: [subsidiaria.empresa, [Validators.required, Validators.minLength(3)]],
      nombre: [subsidiaria.nombre, [Validators.required, Validators.minLength(3)]],
      clave: [subsidiaria.clave, [Validators.required, Validators.minLength(3)]],
      activated: [subsidiaria.activated],
      dateCreated: [subsidiaria.dateCreated],
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

      this.subsidiaria = {
        ...this.subsidiaria,
        ...this.form.value,


      }

      this.subsidiariasService.actualizarSubsidiaria(this.subsidiaria).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Subsidiaria')
        this.functionsService.navigateTo('core/catalogos/subsidiaria')
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
    this.functionsService.navigateTo('core/catalogos/subsidiaria')
  }
}

