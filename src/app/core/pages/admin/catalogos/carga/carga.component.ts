import { Component } from '@angular/core';
import { CargarCargas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
import { CargasService } from 'src/app/core/services/cargas.service';
import { Carga } from 'src/app/core/models/carga.model';
 

import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.css']
})
export class CargaComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  cargas: Carga[]
  cargasTemp: Carga[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private cargasService: CargasService
  ) {
    this.getCargas()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.cargas = this.cargasTemp
        return
      }
      this.busquedasService.buscar('cargas', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.cargas = resp

        this.setCargas()
      })

    }, 500);
  }




  setCargas() {
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
  getCargas() {
    this.loading = true
    this.cargasService.cargarCargasAll().subscribe((resp: CargarCargas) => {
       
      this.cargas = resp.cargas

      this.cargasTemp = resp.cargas
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editCarga(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-carga/true/${id}`)

  }
  isActived(carga: Carga) {

    this.cargasService.isActivedCarga(carga).subscribe((resp: any) => {
      this.getCargas()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'Cargas')

      })
  }
  viewCarga(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-carga/false/${id}`)

  }

  newCarga() {

    this.functionsService.navigateTo('core/catalogos/new-carga')
  }

}
