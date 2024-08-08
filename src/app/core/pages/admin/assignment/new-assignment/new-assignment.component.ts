import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargarRoles, CargarStocks, CargarUsuarios  } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Role } from 'src/app/core/models/role.model';
import { Stock } from 'src/app/core/models/stock.model';
 import { Usuario } from 'src/app/core/models/usuario.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { StocksService } from 'src/app/core/services/stock.service';
 import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-assignment',
  templateUrl: './new-assignment.component.html',
  styleUrls: ['./new-assignment.component.css']
})
export class NewAssignmentComponent {
  ADM = environment.ADM
 
  rol = this.functionsService.getLocal('role')
  loading = false
 
  stocks: Stock[]
  usuarios: Usuario[]
  usuario: Usuario
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  cameraOK=false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService, 
    private stocksService: StocksService,
    private usuariosService: UsuariosService
  ) {
    this.loading = true
   
    
    this.getCatalogos()
    this.createForm()
    setTimeout(() => {

      this.loading = false
    }, 1500);
  }


  takePicture(){
    this.cameraOK = true
  }
  getCatalogos() {

    this.loading = true
 
    
    this.stocksService.cargarStocksAll().subscribe((resp: CargarStocks) => {
   
      this.stocks = this.functionsService.getActivos(resp.stocks)
 

    },
      (error: any) => {
        this.functionsService.alertError(error,'Asignación')
        this.loading = false


      })
    this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
      this.usuarios = this.functionsService.getActivos(resp.usuarios)
    

    },
      (error: any) => {
        this.functionsService.alertError(error,'Asignación')
        this.loading = false


      })


  }

  get errorControl() {
    return this.form.controls;
  }


  createForm() {
    this.form = this.fb.group({
      stock: ['', [Validators.required, Validators.minLength(3)]],
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      estadoEntrega: [''],
      quienEntrego: [''],
      aceptacion: [''],
      estadoRegreso: [''],
      quienRecibio: [''],
      aceptacionRegreso: [''],
      
      activated: [false],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }


  onSubmit() {
    this.loading = true
    this.submited = true

    if (this.form.valid) {
      this.form.value.nombre = this.form.value.nombre.toUpperCase()
      this.form.value.apellidoPaterno = this.form.value.apellidoPaterno.toUpperCase()
      this.form.value.apellidoMaterno = this.form.value.apellidoMaterno.toUpperCase()
      this.form.value.email = this.form.value.email.toLowerCase()
      if (this.form.value.salon === '') { this.form.value.salon = undefined }
      let obj = {
        ...this.form.value,
        usuarioCreated: this.functionsService.getLocal('uid')
      }
      this.usuariosService.crearUsuario(obj).subscribe((resp: any) => {

        //Message
        this.functionsService.navigateTo('core/users')
        this.loading = false
      },
        (error) => {
          //Message
          this.loading = false
          this.functionsService.alertError(error,'Asignación')

        })
    } else {

      //Message
      this.loading = false
      return  
    }






  }

  back() {
    this.functionsService.navigateTo('core/usuarios/vista-usuarios')
  }

  showPicture(event:any){
    if(event.ok === true){
      this.cameraOK=false
   
    }else {
      
      this.cameraOK=false
      var d:any
      this.functionsService.alertError(d,"Error en camara")
    }

  }

}
