import { Injectable } from '@angular/core';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private functionsService:FunctionsService) { }
  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'stocks' |'tickets' | 'proveedors' | 'abastos' | 'dataEs' | 'facturas' |'pagoProgramado',
    id: string,
  ) {
    try {
      const url = `${base_url}/upload/${tipo}/${id}`
     
     
      const formData = new FormData()
      formData.append('imagen', archivo)
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || '',
        },
        body: formData,
      })

      const data = await resp.json()
      if (data.ok) {
        return data.nombreArchivo
      } else {
        return false
      }
    } catch (error) {
      this.functionsService.alertError(error,'File')
      return false
    }
  }
  async actualizarAbasto(
    archivo: File,
    tipo: 'abastos',
    id: string,
    tipoViaje:string,
    idViaje:number,
    ) {
      
      
    

      try {
      const url = `${base_url}/upload/${tipo}/${id}/${tipoViaje}/${idViaje}`
   
      const formData = new FormData()
      formData.append('imagen', archivo)
      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || '',
        },
        body: formData,
      })

      const data = await resp.json()
      if (data.ok) {
        return data.nombreArchivo
      } else {
        return false
      }
    } catch (error) {
      this.functionsService.alertError(error,'File')
      return false
    }
  }
}
