import { Component } from '@angular/core';
import { CargarOrigens } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
import { OrigensService } from 'src/app/core/services/origens.service';
import { Origen } from 'src/app/core/models/origen.model';
 

import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-origen',
  templateUrl: './origen.component.html',
  styleUrls: ['./origen.component.css']
})
export class OrigenComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  origens: Origen[]
  origensTemp: Origen[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private origenService: OrigensService
  ) {
    this.getOrigens()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.origens = this.origensTemp
        return
      }
      this.busquedasService.buscar('origens', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.origens = resp

        this.setOrigens()
      })

    }, 500);
  }




  setOrigens() {
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
  getOrigens() {
    this.loading = true
    this.origenService.cargarOrigensAll().subscribe((resp: CargarOrigens) => {
      this.origens = resp.origens

      this.origensTemp = resp.origens
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editOrigen(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-origen/true/${id}`)

  }
  isActived(origen: Origen) {

    this.origenService.isActivedOrigen(origen).subscribe((resp: any) => {
      this.getOrigens()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'Origens')

      })
  }
  viewOrigen(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-origen/false/${id}`)

  }

  newOrigen() {

    this.functionsService.navigateTo('core/catalogos/new-origen')
  }

}
