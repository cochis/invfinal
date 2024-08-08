import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'jquery';
import { pipe, tap } from 'rxjs';
 
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
 
const base_url = environment.base_url
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private functionsService: FunctionsService,
    
  ) {

 
   }
  get token(): string {
    return localStorage.getItem('token') || ''
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    }
  }

  login(loginForm: any) {

    const url = `${base_url}/login`
    return this.http.post(url, loginForm).pipe(
      tap((resp: any) => {
        
        this.functionsService.setLocal('token', resp.token)
        this.functionsService.setLocal('uid', resp.uid)
        this.functionsService.setLocal('email', resp.email)
        this.functionsService.setLocal('role', resp.role)

        
        // localStorage.setItem('token', resp.token)
      }),
    )
  }
  existEmail(email: string) {
   
    const url = `${base_url}/login/exist/${email}`
    return this.http.get(url).pipe(
      tap((resp: any) => {


      }),
    )
  }

  verificationEmail(email: string,token:string) {
    
    const headers:any = {
      'x-token':  token,
    } 
    const url = `${base_url}/login/activated/${email}`
    return this.http.get(url,headers).pipe(
      tap((resp: any) => {
     


      },
      (error)=>{
        this.functionsService.alertError(error,'Verificación correo electrónico')

      }),
    )
  }


}
