import { Component } from '@angular/core';
import { CargarRoles, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Role } from 'src/app/core/models/role.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  ADM = environment.ADM
  url = environment.base_url
  loading = false
  usuarios: Usuario[]
  usuariosTemp: Usuario[]
  roles: Role[]
  rolesTemp: Role[]
  rol = this.functionsService.getLocal('role')
  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private usuariosService: UsuariosService,
    private rolesService: RolesService,
  ) {


    this.getUsuarios()
    this.getRoles()
  }

  getUsuarios() {
    this.loading = true
    this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
      this.usuarios = resp.usuarios
      setTimeout(() => {
        this.usuariosTemp = resp.usuarios
        this.loading = false
      }, 1500);
    });

  }
  reset(user: any) {

    const role = user.role._id
    const usuarioCreated = user.usuarioCreated._id
    const password = 123456
    user = {
      ...user,
      role: role,
      usuarioCreated: usuarioCreated,
      activated: false,
      password: password
    }

    this.usuariosService.actualizarUsuario(user).subscribe((resp) => {

      this.functionsService.alertUpdate('Usuario')
      this.getUsuarios()
    },
      (error) => {
        this.functionsService.alertError(error, 'Usuarios')

      })
  }
  getRoles() {

    this.loading = true


    this.rolesService.cargarRolesAll().subscribe((resp: CargarRoles) => {


      this.roles = resp.roles
      setTimeout(() => {
        this.rolesTemp = resp.roles

        this.loading = false
      }, 1500);
    });

  }
  editUsuario(id: string) {

    this.functionsService.navigateTo(`/core/edit-user/true/${id}`)

  }
  isActived(usuario: Usuario) {

    this.usuariosService.isActivedUsuario(usuario).subscribe((resp: any) => {
      this.getUsuarios()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Usuarios')

      })
  }
  viewUsuario(id: string) {
    this.functionsService.navigateTo(`/core/edit-user/false/${id}`)

  }

  newUser() {

    this.functionsService.navigateTo('core/new-user')
  }


  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.usuarios = this.usuariosTemp
        return
      }
      this.busquedasService.buscar('usuarios', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.usuarios = this.functionsService.getActives(resp)


      })

    }, 500);
  }

  buscarCatalogo(tipo: string, value) {

    switch (tipo) {
      case 'usuarios':
        if (value == '') {
          this.usuarios = this.usuariosTemp

        }
        this.busquedasService.buscarCatalogo('usuarios-rol', value).subscribe((resp) => {
          this.usuarios = resp
        })
        break;


      case 'salon':
        break;
    }
  }
}
