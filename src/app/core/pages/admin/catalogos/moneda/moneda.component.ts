import { Component } from '@angular/core';
import { CargarMonedas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';


import { HttpClient } from '@angular/common/http';

import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
import { MonedasService } from 'src/app/core/services/monedas.service';
import { Moneda } from 'src/app/core/models/moneda.model';
 

import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-moneda',
  templateUrl: './moneda.component.html',
  styleUrls: ['./moneda.component.css']
})
export class MonedaComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  monedas: Moneda[]
  monedasTemp: Moneda[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private monedaService: MonedasService
  ) {
    this.getMonedas()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.monedas = this.monedasTemp
        return
      }
      this.busquedasService.buscar('monedas', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.monedas = resp

        this.setMonedas()
      })

    }, 500);
  }




  setMonedas() {
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
  getMonedas() {
    this.loading = true
    this.monedaService.cargarMonedasAll().subscribe((resp: CargarMonedas) => {
      this.monedas = resp.monedas

      this.monedasTemp = resp.monedas
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editMoneda(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-moneda/true/${id}`)

  }
  isActived(moneda: Moneda) {

    this.monedaService.isActivedMoneda(moneda).subscribe((resp: any) => {
      this.getMonedas()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'Monedas')

      })
  }
  viewMoneda(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-moneda/false/${id}`)

  }

  newMoneda() {

    this.functionsService.navigateTo('core/catalogos/new-moneda')
  }

}
