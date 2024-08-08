import { Component } from '@angular/core';
import { CargarDepartamentos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
import { DepartamentosService } from 'src/app/core/services/departamentos.service';
import { Departamento } from 'src/app/core/models/departamento.model';
 

import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css']
})
export class DepartamentoComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  departamentos: Departamento[]
  departamentosTemp: Departamento[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private departamentoService: DepartamentosService
  ) {
    this.getDepartamentos()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.departamentos = this.departamentosTemp
        return
      }
      this.busquedasService.buscar('departamentos', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.departamentos = resp

        this.setDepartamentos()
      })

    }, 500);
  }




  setDepartamentos() {
    this.loading = true
    setTimeout(() => {

      $('#datatableexample').DataTable({
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true,
        lengthMenu: [5, 10, 25]
      });
      this.loading = false

    }, 500);
  }
  getDepartamentos() {
    this.loading = true
    this.departamentoService.cargarDepartamentosAll().subscribe((resp: CargarDepartamentos) => {
      this.departamentos = resp.departamentos
      

      this.departamentosTemp = resp.departamentos
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editDepartamento(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-departamento/true/${id}`)

  }
  isActived(departamento: Departamento) {

    this.departamentoService.isActivedDepartamento(departamento).subscribe((resp: any) => {
      this.getDepartamentos()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'Departamentos')

      })
  }
  viewDepartamento(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-departamento/false/${id}`)

  }

  newDepartamento() {

    this.functionsService.navigateTo('core/catalogos/new-departamento')
  }

}
