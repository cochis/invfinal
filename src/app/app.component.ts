import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { FunctionsService } from './shared/services/functions.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sistemas LOOP-JASU';
  constructor(private update: SwUpdate, private functionsService: FunctionsService) {
    this.updateClient()


  }
  updateClient() {

    this.update.available.subscribe((event) => {
   
      Swal.fire({
        title: 'Existe una nueva version de la aplicación favor de actualizar',

        confirmButtonText: 'Actualizar',

      }).then((result) => {

        if (result.isConfirmed) {
          window.location.reload()
        }
      })

    })
  }

}
