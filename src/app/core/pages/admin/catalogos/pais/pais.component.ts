import { Component } from '@angular/core';
import { CargarPaiss } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Usuario } from 'src/app/core/models/usuario.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { Pais } from 'src/app/core/models/pais.model';
import { environment } from 'src/environments/environment';
import { PaissService } from 'src/app/core/services/pais.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.css']
})
export class PaisComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  paiss: Pais[]
  paissTemp: Pais[]
  paises: Pais[]
  today = this.functionsService.getToday()
  uid = this.functionsService.getLocal('uid')
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private paisService: PaissService
  ) {
    this.getPaiss()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.paiss = this.paissTemp
        return
      }
      this.busquedasService.buscar('paises', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.paiss = resp

        this.setPaiss()
      })

    }, 500);
  }




  setPaiss() {
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
  getPaiss() {
    this.loading = true
    this.paisService.cargarPaissAll().subscribe((resp: CargarPaiss) => {
      this.paiss = resp.paiss

      this.paissTemp = resp.paiss
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editPais(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-pais/true/${id}`)

  }
  isActived(pais: Pais) {

    this.paisService.isActivedPais(pais).subscribe((resp: any) => {
      this.getPaiss()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'Paiss')

      })
  }
  viewPais(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-pais/false/${id}`)

  }

  newPais() {

    this.functionsService.navigateTo('core/catalogos/new-pais')
  }

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      console.log('paises', jsonData.paises)

      this.setPaises(jsonData.paises)







    }
    reader.readAsBinaryString(file);
  }

  setPaises(paises: any) {
    this.loading = true

    paises.forEach(pas => {
      let pais = {
        ...pas,
        activated:true,
        usuarioCreated: this.uid,
        dateCreated: this.today,
        lastEdited: this.today
      }
      this.paisService.crearPais(pais).subscribe(resp => {
        console.log('resp', resp)

      },
        (error) => {
          console.log('error', error)

        })
    });


    this.getPaiss()
    this.loading= false
  }

}
