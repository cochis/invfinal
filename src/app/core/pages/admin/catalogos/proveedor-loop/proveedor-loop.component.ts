import { Component } from '@angular/core';
import { Usuario } from 'src/app/core/models/usuario.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { ProveedorLoop } from 'src/app/core/models/proveedorLoop.model';
import { ProveedorLoopsService } from 'src/app/core/services/proveedorLoops.service';
import { CargarProveedorLoops } from '../../../../interfaces/cargar-interfaces.interfaces';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-proveedor-loop',
  templateUrl: './proveedor-loop.component.html',
  styleUrls: ['./proveedor-loop.component.css']
})
export class ProveedorLoopComponent {
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  proveedorLoops: ProveedorLoop[] = []
  proveedorLoopsTemp: ProveedorLoop[] = []

  loading = false
  url = environment.base_url
  uid = this.functionsService.getLocal('uid')
  today = this.functionsService.getToday()
  willDownload = false;


  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private proveedorLoopsService: ProveedorLoopsService
  ) {
    this.getProveedorLoop()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.proveedorLoops = this.proveedorLoopsTemp
        return
      }
      this.busquedasService.buscar('proveedorLoop', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.proveedorLoops = resp

        this.setPuestos()
      })

    }, 500);
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
      console.log('proveedorLoops', jsonData.proveedorLoops)

      this.setProveedores(jsonData.proveedorLoops)







    }
    reader.readAsBinaryString(file);
  }

  setDownload(data) {
    this.willDownload = true;
    setTimeout(() => {
      const el = document.querySelector("#download");
      el.setAttribute("href", `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
      el.setAttribute("download", 'xlsxtojson.json');
    }, 1000)
  }


  setPuestos() {
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
  getProveedorLoop() {
    this.loading = true
    this.proveedorLoopsService.cargarProveedorLoopsAll().subscribe((resp: CargarProveedorLoops) => {
      // console.log('resp', resp)
      this.proveedorLoops = resp.proveedorLoops
      this.proveedorLoopsTemp = resp.proveedorLoops
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editProveedorLoop(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-proveedor-loop/true/${id}`)

  }
  isActived(proveedorLoop: ProveedorLoop) {

    this.proveedorLoopsService.isActivedProveedorLoop(proveedorLoop).subscribe((resp: any) => {
      this.getProveedorLoop()


    },
      (error: any) => {

        this.functionsService.alertError(error, 'ProveedorLoops')

      })
  }
  viewProveedorLoop(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-proveedor-loop/false/${id}`)

  }

  newProveedorLoop() {

    this.functionsService.navigateTo('core/catalogos/new-proveedor-loop')
  }


  setProveedores(proveedores: any) {
    this.loading = true

    proveedores.forEach(prov => {
      let proveedor = {
        ...prov,
        activated:true,
        usuarioCreated: this.uid,
        dateCreated: this.today,
        lastEdited: this.today
      }
      this.proveedorLoopsService.crearProveedorLoop(proveedor).subscribe(resp => {
        console.log('resp', resp)

      },
        (error) => {
          console.log('error', error)

        })
    });


    this.getProveedorLoop()
    this.loading= false
  }

  updateProveedores(proveedores: any) {
    this.loading = true

    proveedores.forEach(prov => {
      let proveedor = {
        ...prov,
        activated:true,
        usuarioCreated: this.uid,
        dateCreated: this.today,
        lastEdited: this.today
      }
      this.proveedorLoopsService.crearMasivaProveedorLoop(proveedor).subscribe(resp => {
        console.log('resp', resp)

      },
        (error) => {
          console.log('error', error)

        })
    });


    this.getProveedorLoop()
    this.loading= false
  }

}
