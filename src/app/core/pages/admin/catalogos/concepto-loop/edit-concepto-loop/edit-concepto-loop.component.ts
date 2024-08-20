import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarTipoStock, CargarConceptoLoop } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { ConceptoLoop } from 'src/app/core/models/conceptoLoop.model';
import { ConceptoLoopsService } from 'src/app/core/services/conceptoLoops.service';
import { RolesService } from 'src/app/core/services/roles.service';
 
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-concepto-loop',
  templateUrl: './edit-concepto-loop.component.html',
  styleUrls: ['./edit-concepto-loop.component.css']
})
export class EditConceptoLoopComponent {
  loading = false
  public imagenSubir!: File
  public imgTemp: any = undefined
  conceptoLoop: ConceptoLoop
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
 private conceptoLoopsService: ConceptoLoopsService,
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
    this.conceptoLoopsService.cargarConceptoLoopById(id).subscribe((resp: CargarConceptoLoop) => {
      

      this.conceptoLoop = resp.conceptoLoop
  

      setTimeout(() => {

        this.setForm(this.conceptoLoop)
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
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }
  setForm(conceptoLoop: ConceptoLoop) {
 

    this.form = this.fb.group({
      name: [conceptoLoop.name, [Validators.required, Validators.minLength(3)]],
      clave: [conceptoLoop.clave, [Validators.required, Validators.minLength(3)]],
      
      activated: [conceptoLoop.activated],
      dateCreated: [conceptoLoop.dateCreated],
      lastEdited: [this.today],
    })
    
 



  }

  onSubmit() {
    this.loading = true
    this.form.value.name = this.form.value.name.toUpperCase().trim()
    this.form.value.clave = this.form.value.clave.toUpperCase().trim()
  

    if (this.form.value.nombre === '' || this.form.value.clave === '') {
      this.functionsService.alertForm('Concepto loop')
      this.loading = false
      return
    }


    if (this.form.valid) {

      this.conceptoLoop = {
        ...this.conceptoLoop,
        ...this.form.value,


      }

      this.conceptoLoopsService.actualizarConceptoLoop(this.conceptoLoop).subscribe((resp: any) => {
        this.functionsService.alertUpdate('Concepto de Loop')
        this.functionsService.navigateTo('core/catalogos/concepto-loop')
        this.loading = false
      },
        (error) => {

          this.functionsService.alertError(error, 'ConceptoLoop')
          this.loading = false

      

        })
    } else {
      this.functionsService.alertForm('Roles')
      this.loading = false

      return  
    }




 

  }


  back() {
    this.functionsService.navigateTo('core/catalogos/concepto-loop')
  }

}
