import { Component } from '@angular/core';
import { CargarSubsidiarias, CargarTipoProveedors } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';


import { environment } from 'src/environments/environment';
import { TipoProveedor } from 'src/app/core/models/tipoProveedor.model';
import { TipoProveedorService } from 'src/app/core/services/tipoProveedor.service';
import { SubsidiariaService } from 'src/app/core/services/subsidiaria.service';
import { Subsidiaria } from 'src/app/core/models/subsidiaria.model';


@Component({
  selector: 'app-subsidiaria',
  templateUrl: './subsidiaria.component.html',
  styleUrls: ['./subsidiaria.component.css']
})
export class SubsidiariaComponent {
  data!: any
  subsidiarias: TipoProveedor[] = [];
  subsidiariasTemp: TipoProveedor[] = [];
  loading = false
  url = environment.base_url
  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private subsidiariasServices: SubsidiariaService
  ) {
    this.getTipoProveedors()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.subsidiarias = this.subsidiariasTemp
        return
      }
      this.busquedasService.buscar('subsidiarias', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.subsidiarias = resp


        this.setTipoProveedors()
      })

    }, 500);
  }




  setTipoProveedors() {
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
  getTipoProveedors() {
    this.loading = true
    this.subsidiariasServices.cargarSubsidiariasAll().subscribe((resp: CargarSubsidiarias) => {


      this.subsidiarias = resp.subsidiarias

      this.subsidiariasTemp = resp.subsidiarias
      setTimeout(() => {
        this.loading = false
      }, 1500);
    },
      (error) => {
        this.functionsService.alertError(error, 'Tipo stock')
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editTipoProveedor(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-subsidiaria/true/${id}`)
  }
  isActived(subsidiaria: Subsidiaria) {

    this.subsidiariasServices.isActivedSubsidiaria(subsidiaria).subscribe((resp: any) => {
      this.getTipoProveedors()


    },
      (error: any) => {
        this.functionsService.alertError(error, 'Tipo stock')


      })
  }
  viewTipoProveedor(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-subsidiaria/false/${id}`)

  }

  newRol() {

    this.functionsService.navigateTo('core/catalogos/new-subsidiaria')
  }

}
