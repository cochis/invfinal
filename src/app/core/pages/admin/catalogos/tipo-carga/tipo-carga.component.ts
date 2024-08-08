import { Component } from '@angular/core';
import { CargarTipoCargas } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';

 
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
 
import { CargasService } from 'src/app/core/services/cargas.service';
import { Carga } from 'src/app/core/models/carga.model';
 

import { environment } from 'src/environments/environment';
import { TipoCargasService } from 'src/app/core/services/tipoCargas.service';
import { TipoCarga } from 'src/app/core/models/tipoCarga.model';


@Component({
  selector: 'app-tipo-carga',
  templateUrl: './tipo-carga.component.html',
  styleUrls: ['./tipo-carga.component.css']
})
export class TipoCargaComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  tipoCargas: Carga[]
  tipoCargasTemp: Carga[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private tipoCargasService: TipoCargasService
  ) {
    this.getTipoCargas()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.tipoCargas = this.tipoCargasTemp
        return
      }
      this.busquedasService.buscar('tipoCargas', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.tipoCargas = resp

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
  getTipoCargas() {
    this.loading = true
    this.tipoCargasService.cargarTipoCargasAll().subscribe((resp: CargarTipoCargas) => {
   
      this.tipoCargas = resp.tipoCargas

      this.tipoCargasTemp = resp.tipoCargas
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editTipoCarga(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-tipo-carga/true/${id}`)

  }
  isActived(tipoCarga: TipoCarga) {

    this.tipoCargasService.isActivedCarga(tipoCarga).subscribe((resp: any) => {
      this.getTipoCargas()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'Cargas')

      })
  }
  viewTipoCarga(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-tipo-carga/false/${id}`)

  }

  newTipoCarga() {

    this.functionsService.navigateTo('core/catalogos/new-tipo-carga')
  }

}
