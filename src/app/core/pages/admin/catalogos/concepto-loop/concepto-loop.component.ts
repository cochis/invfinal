import { Component } from '@angular/core';
import { Usuario } from 'src/app/core/models/usuario.model';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { environment } from 'src/environments/environment';
import { ConceptoLoop } from 'src/app/core/models/conceptoLoop.model';
import { ConceptoLoopsService } from 'src/app/core/services/conceptoLoops.service';
import { CargarConceptoLoops } from '../../../../interfaces/cargar-interfaces.interfaces';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-concepto-loop',
  templateUrl: './concepto-loop.component.html',
  styleUrls: ['./concepto-loop.component.css']
})
export class ConceptoLoopComponent{
  uid = this.functionsService.getLocal('uid')
  today = this.functionsService.getToday()
  data!: any
  usuarios: Usuario[] = [];
  usuariosTemp: Usuario[] = [];
  conceptoLoops: ConceptoLoop[] =[]
  conceptoLoopsTemp: ConceptoLoop[]=[]
  
  loading = false
  url = environment.base_url



  constructor(
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
   private conceptoLoopsService: ConceptoLoopsService
  ) {
    this.getConceptoLoop()

  }

  buscar(termino) {
    termino = termino.trim()
    setTimeout(() => {
      if (termino.length === 0) {
        this.conceptoLoops = this.conceptoLoopsTemp
        return
      }
      this.busquedasService.buscar('conceptoLoop', termino, this.functionsService.isAdmin()).subscribe((resp) => {
        this.conceptoLoops = resp

        this.setPuestos()
      })

    }, 500);
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
  getConceptoLoop() {
    this.loading = true
    this.conceptoLoopsService.cargarConceptoLoopsAll().subscribe((resp: CargarConceptoLoops) => {
      // console.log('resp', resp)
      this.conceptoLoops = resp.conceptoLoops
      this.conceptoLoopsTemp = resp.conceptoLoops
      setTimeout(() => {

        this.loading = false
      }, 1500);
    },
      (error) => {
        this.loading = false
        this.functionsService.errorInfo()
      });
  }


  editConceptoLoop(id: string) {

    this.functionsService.navigateTo(`/core/catalogos/edit-concepto-loop/true/${id}`)

  }
  isActived(conceptoLoop : ConceptoLoop) {

    this.conceptoLoopsService.isActivedConceptoLoop(conceptoLoop).subscribe((resp: any) => {
      this.getConceptoLoop()


    },
      (error: any) => {
       
        this.functionsService.alertError(error,'ConceptoLoops')

      })
  }
  viewConceptoLoop(id: string) {
    this.functionsService.navigateTo(`/core/catalogos/edit-concepto-loop/false/${id}`)

  }

  newConceptoLoop() {

    this.functionsService.navigateTo('core/catalogos/new-concepto-loop')
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
      console.log('conceptosLoop', jsonData.conceptoLoop)

      this.setConceptos(jsonData.conceptoLoop)







    }
    reader.readAsBinaryString(file);
  }
  setConceptos(conceptos: any) {
    this.loading = true

    conceptos.forEach(cl => {
      let concepto = {
        ...cl,
        activated:true,
        usuarioCreated: this.uid,
        dateCreated: this.today,
        lastEdited: this.today
      }
      this.conceptoLoopsService.crearConceptoLoop(concepto).subscribe(resp => {
        console.log('resp', resp)

      },
        (error) => {
          console.log('error', error)

        })
    });


    this.getConceptoLoop()
    this.loading= false
  }
}
