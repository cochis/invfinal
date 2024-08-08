import { Component } from '@angular/core';
import { CargarDestinos } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
import { DestinosService } from 'src/app/core/services/destinos.service';
import { Destino } from 'src/app/core/models/destino.model';
 

import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-destino',
  templateUrl: './destino.component.html',
  styleUrls: ['./destino.component.css']
})
export class DestinoComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  destinos: Destino[]
  destinosTemp: Destino[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private destinoService: DestinosService
  ) {
    this.getDestinos()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.destinos = this.destinosTemp
        return
      }
      this.busquedasService.buscar('destinos', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.destinos = resp

        this.setDestinos()
      })

    }, 500);
  }




  setDestinos() {
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
  getDestinos() {
    this.loading = true
    this.destinoService.cargarDestinosAll().subscribe((resp: CargarDestinos) => {
      this.destinos = resp.destinos

      this.destinosTemp = resp.destinos
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editDestino(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-destino/true/${id}`)

  }
  isActived(destino: Destino) {

    this.destinoService.isActivedDestino(destino).subscribe((resp: any) => {
      this.getDestinos()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'Destinos')

      })
  }
  viewDestino(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-destino/false/${id}`)

  }

  newDestino() {

    this.functionsService.navigateTo('core/catalogos/new-destino')
  }

}
