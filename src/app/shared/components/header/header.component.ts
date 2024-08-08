import { Component, } from '@angular/core';
 
 
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FunctionsService } from '../../services/functions.service';
 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
rol = localStorage.getItem('role')
ADM = environment.ADM
CTB = environment.CTB
CTM = environment.CTM
PGP = environment.PGP
SUP = environment.SUP
EMJ = environment.EMJ
EML = environment.EML
REHU = environment.REH
MAQ = environment.MAQ
VER = environment.version
uid= this.functionsService.getLocal('uid')

constructor(
  public functionsService : FunctionsService
  ) {
    this.validateRol(this.rol,this.MAQ)
  }
  

  logout(){
    this.functionsService.clearLocal()
    this.functionsService.navigateTo('/')
  }
  validateRol(roles:any,rol:string){

    if (roles && rol){
 
      
        return roles.includes(rol)
   

    }


  }
}
