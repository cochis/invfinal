import { Component } from '@angular/core';
import { CargarEmpresas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
 
 

import { environment } from 'src/environments/environment';
import { Empresa } from 'src/app/core/models/Empresa';
import { EmpresasService } from 'src/app/core/services/puesto.service copy';
@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  empresas: Empresa[]
  empresasTemp: Empresa[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private empresaService: EmpresasService
  ) {
    this.getEmpresas()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.empresas = this.empresasTemp
        return
      }
      this.busquedasService.buscar('empresas', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.empresas = resp

        this.setEmpresas()
      })

    }, 500);
  }




  setEmpresas() {
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
  getEmpresas() {
    this.loading = true
    this.empresaService.cargarEmpresasAll().subscribe((resp: CargarEmpresas) => {
      // console.log('resp', resp)
      this.empresas = resp.empresas
      this.empresasTemp = resp.empresas
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        console.error('error', error)
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editEmpresa(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-empresa/true/${id}`)

  }
  isActived(empresa: Empresa) {

    this.empresaService.isActivedEmpresa(empresa).subscribe((resp: any) => {
      this.getEmpresas()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'Empresas')

      })
  }
  viewEmpresa(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-empresa/false/${id}`)

  }

  newEmpresa() {

    this.functionsService.navigateTo('core/catalogos/new-empresa')
  }

}
