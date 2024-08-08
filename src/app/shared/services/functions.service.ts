import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(
    private router: Router,
  ) { }


  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resp => {
                resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
            },
            err => {
                reject(err);
          });
    });
}
  navigateTo(url: string) {
    this.router.navigateByUrl(url, { replaceUrl: true })
  }

  getToday() {
    return Date.now()
  }

  getLocal(name: string) {
    return localStorage.getItem(name)
  }
  setLocal(name: string, value: any) {


    switch (typeof (value)) {
      case 'object':
        localStorage.setItem(name, JSON.stringify(value))
        break;
      case 'boolean':
        localStorage.setItem(name, JSON.stringify(value))
        break;

      default:
        localStorage.setItem(name, value)
        break;
    }

  }

  clearLocal() {
    localStorage.clear();
  }
  removeItemLocal(name: string) {
    localStorage.removeItem(name)
  }



  getValueCatalogCat(id: string, filter: string, categoria: string, catalogo: any) {
 

    let ret = catalogo.filter((cat: any) => {
      return cat[categoria] === id
    })

    return ret[0][filter]
  }
  getValueCatalogCooper(id: any, filter: string, catalogo: any) {
    try {
      let ret = catalogo.filter((cat: any) => {
        return cat.id === id
      })
      return ret[0][filter]
    } catch (error) {
      return (error)
    }
  }
  getValueCatalogCooperStage(id: any,id2:any,filter: string, catalogo: any) {
    try {
      let ret = catalogo.filter((cat: any) => {
        return cat.id === id
      })
      let ret2 =  ret[0].stages.filter((cat2:any)=>{
        return cat2.id === id2
      })
      return ret2[0][filter]
    
    } catch (error) {
     
      return (error)
    }
  }
  getValueCatalog(id: any, filter: string, catalogo: any) {
    try {
      let ret = catalogo.filter((cat: any) => {
        return cat.uid === id
      })
      return ret[0][filter]
    } catch (error) {
      return (error)
    }

  }
  getValuesCatalog(id: string, filter: string, catalogo: any) {
     

    let ret = catalogo.filter((cat: any) => {
      return cat.uid === id
    })

    return ret
  }

  getActives(obj: any) {
    let ret = obj.filter((item: any) => {
      return item.activated === true
    })
    return ret
  }
  sendMessage(tipo: string, header: string, message: string,) {
    let mes = {
      tipo,
      header,
      message
    }
    return mes

  }
  numberToDate(date) {
    let today = new Date(date)
    var m = today.getMonth() + 1
    var monthT = m.toString()
    var d = today.getDate()
    var dayT = today.getDate().toString()
    let dt
    if (d < 10) {
      dayT = '0' + d
    }
    if (m < 10) {
      monthT = '0' + m
    }
    dt = today.getFullYear() + '-' + monthT + '-' + dayT
    return dt
  }

  DateToNumber(date){
    return new Date(date).getTime()

  }

  alert(title: string, message: string, type: any) {
    Swal.fire(title, message, type)
  }
  alertUpdate(tipo: string) {
    Swal.fire(tipo, 'Información actualizada', 'success')
  }
  alertError(data: object, tipo: string) {
    

    Swal.fire(tipo, 'Algo extraño paso intente mas tarde', 'error')
  }
  alertForm(type: string) {

    Swal.fire(type, 'Favor llenar todos los campos', 'info')
  }
  errorInfo() {

    Swal.fire('Info', 'Error al cargar la información', 'error')
  }

  async answertAlert(question:string){
    Swal.fire({
      title: question,
    showCancelButton: true,
      confirmButtonText: 'Si',
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
     return await result
    })
  }



  isAdmin() {

    const ADM = environment.ADM
    const rol = this.getLocal('role')
    if (rol == ADM) {
      return true
    } else {
      return false
    }
  }

  getActivos(array: any) {
    let x = array.filter((a: any) => {
      if (a.activated) {
        return a
      }
    })
    return x
  }
   

  logout() {
    localStorage.clear()
    this.router.navigateByUrl('/auth/login')

  }

  validateRol(roles:any,rol:string){

    if (roles && rol){
        return roles.includes(rol)
    }


  }
}
