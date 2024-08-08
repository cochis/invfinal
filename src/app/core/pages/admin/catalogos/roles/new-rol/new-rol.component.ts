import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/core/models/role.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
@Component({
  selector: 'app-new-rol',
  templateUrl: './new-rol.component.html',
  styleUrls: ['./new-rol.component.css']
})
export class NewRolComponent{
  loading = false
  roles: Role[]
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false


  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private rolesService: RolesService,
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
      this.rolesService.crearRole(this.form.value).subscribe((resp: any) => {
        this.functionsService.alert('Roles', 'Rol creado', 'success')
        this.functionsService.navigateTo('core/catalogos/roles')
        this.loading = false
      },
        (error) => {
          this.functionsService.alertError(error, 'Roles')

          this.loading = false
          this.functionsService.alertError(error,'Roles')

        })
    } else {

      //Message
      this.loading = false
      this.functionsService.alertForm('Roles')
      return 
    }






  }

  back() {
    this.functionsService.navigateTo('core/catalogos/roles')
  }

}

