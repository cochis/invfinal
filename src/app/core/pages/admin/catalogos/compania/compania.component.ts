import { Component } from '@angular/core';
import { CargarCompanias } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
import { CompaniasService } from 'src/app/core/services/companias.service';
import { Compania } from 'src/app/core/models/compania.model';
 

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-compania',
  templateUrl: './compania.component.html',
  styleUrls: ['./compania.component.css']
})
export class CompaniaComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  companias: Compania[]
  companiasTemp: Compania[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private companiaService: CompaniasService
  ) {
    this.getCompanias()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.companias = this.companiasTemp
        return
      }
      this.busquedasService.buscar('companias', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.companias = resp

        this.setCompanias()
      })

    }, 500);
  }




  setCompanias() {
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
  getCompanias() {
    this.loading = true
    this.companiaService.cargarCompaniasAll().subscribe((resp: CargarCompanias) => {
      this.companias = resp.companias
      this.companiasTemp = resp.companias
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editCompania(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-compania/true/${id}`)

  }
  isActived(compania: Compania) {

    this.companiaService.isActivedCompania(compania).subscribe((resp: any) => {
      this.getCompanias()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'Companias')

      })
  }
  viewCompania(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-compania/false/${id}`)

  }

  newCompania() {

    this.functionsService.navigateTo('core/catalogos/new-compania')
  }

}
