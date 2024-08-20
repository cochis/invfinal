import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/core/models/usuario.model';
import { ConceptoLoop } from 'src/app/core/models/conceptoLoop.model';
import { ConceptoLoopsService } from 'src/app/core/services/conceptoLoops.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-new-concepto-loop',
  templateUrl: './new-concepto-loop.component.html',
  styleUrls: ['./new-concepto-loop.component.css']
})
export class NewConceptoLoopComponent {
  ADM = environment.ADM

  rol = this.functionsService.getLocal('role')
  loading = false
  usuarios: Usuario[]
  conceptoLoop: ConceptoLoop
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
   
    private conceptoLoopsService: ConceptoLoopsService
  ) {
    this.loading = true


    this.getCatalogos()
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }



  getCatalogos() {

    // this.loading = true
    // this.tipoStockService.cargarTipoStocksAll().subscribe((resp: CargarTipoStocks) => {
    //   this.tipoStocks = this.functionsService.getActivos(resp.tipoStocks)


    // },
    //   (error: any) => {

    //     this.functionsService.alertError(error, 'Stock')
    //     this.loading = false


    //   })
    // this.loading = true
    // this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
    //   this.usuarios = this.functionsService.getActivos(resp.usuarios)


    // },
    //   (error: any) => {

    //     this.functionsService.alertError(error, 'Stock')
    //     this.loading = false


    //   })


  }

  get errorControl() {
    return this.form.controls;
  }


  createForm() {
    this.form = this.fb.group({
      name: [''],
      clave: [''],
      usuarioCreated: [''],
      activated: [true],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    this.submited = true

    
    if (this.form.valid) {
       
    
      this.loading = false

      let obj = {
        ...this.form.value,
        usuarioCreated: this.functionsService.getLocal('uid')
      }
      // console.log('obj', obj)
      this.conceptoLoopsService.crearConceptoLoop(obj).subscribe((resp: any) => {

        //Message
        this.functionsService.navigateTo('core/catalogos/concepto-loop')
        this.loading = false
      },
        (error) => {
  
          this.loading = false


        })
    } else {

      //Message
      this.loading = false
      return
    }


  }

  back() {
    this.functionsService.navigateTo('core/catalogos/concepto-loop')
  }

}

