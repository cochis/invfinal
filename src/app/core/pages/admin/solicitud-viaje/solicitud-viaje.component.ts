import { Component } from '@angular/core';
import { CargarRoles, CargarSolicitudViajes } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Role } from 'src/app/core/models/role.model';
import { SolicitudViaje } from 'src/app/core/models/solicitudViaje.model';
import { RolesService } from 'src/app/core/services/roles.service';
import { SolicitudViajesService } from 'src/app/core/services/solicitudViaje.service';
import { BusquedasService } from 'src/app/shared/services/busquedas.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-viaje',
  templateUrl: './solicitud-viaje.component.html',
  styleUrls: ['./solicitud-viaje.component.css']
})
export class SolicitudViajeComponent{
  ADM =environment.ADM  
  CTB = environment.CTB
  CTM = environment.CTM
  EMJ = environment.EMJ
  EML = environment.EML
  REH = environment.REH
  MAQ = environment.MAQ
  COP = environment.COP
  PGP = environment.PGP
  SUP = environment.SUP
  url = environment.base_url 
  loading = false
  solicitudViajes: SolicitudViaje[]
  solicitudViajesTemp: SolicitudViaje[]
  roles: Role[]
  rolesTemp: Role[]
  rol = this.functionsService.getLocal('role')
  uid = this.functionsService.getLocal('uid')
    constructor( 
    private functionsService: FunctionsService,
    private busquedasService: BusquedasService,
    private solicitudViajesService: SolicitudViajesService,
    private rolesService: RolesService,
    ){
      this.functionsService.validateRol(this.rol,this.EMJ)
      this.getSolicitudViajes()
      this.getRoles()
    }
  
    getSolicitudViajes() {
      this.loading = true


      if( 
          this.functionsService.validateRol(this.rol,this.ADM) || 
          this.functionsService.validateRol(this.rol,this.CTM) || 
          this.functionsService.validateRol(this.rol,this.SUP) || 
          this.functionsService.validateRol(this.rol,this.CTB

          )){

        this.solicitudViajesService.cargarAlumnosAll().subscribe((resp: CargarSolicitudViajes) => {
          setTimeout(() => {
            this.solicitudViajes = resp.solicitudViajes
            this.solicitudViajesTemp = resp.solicitudViajes
            this.loading = false
          }, 1500);
        });
      }else{
 
        this.solicitudViajesService.cargarSolicitudesViajeByEmpleado(this.uid).subscribe((resp: CargarSolicitudViajes) => {
          setTimeout(() => {
            this.solicitudViajes = resp.solicitudViajes
            this.solicitudViajesTemp = resp.solicitudViajes
            this.loading = false
          }, 1500);
        });
         


      }


       
    }
    reset(user:any){
    
      const role = user.role._id
      const solicitudViajeCreated = user.solicitudViajeCreated._id
      const password= 123456
      user= {
        ...user,
        role:role,
        solicitudViajeCreated:solicitudViajeCreated,
        activated:false,
        password: password
      }
     
      this.solicitudViajesService.actualizarSolicitudViaje(user).subscribe((resp)=>{
      
        this.functionsService.alertUpdate('SolicitudViaje')
        this.getSolicitudViajes()
      },
      (error)=>{
        this.functionsService.alertError(error,'SolicitudViajes')
  
      })
    }
    getRoles() {
  
      this.loading = true
     
  
      this.rolesService.cargarRolesAll().subscribe((resp: CargarRoles) => {
        this.roles = resp.roles
        setTimeout(() => {
          this.rolesTemp = resp.roles
          this.loading = false
        }, 1500);
      });
  
    }
    editSolicitudViaje(id: string) {
  
      this.functionsService.navigateTo(`/core/edit-viaje/true/${id}`)
  
    }
    isActived(solicitudViaje: SolicitudViaje) {
  
      this.solicitudViajesService.isActivedSolicitudViaje(solicitudViaje).subscribe((resp: any) => {
        this.getSolicitudViajes()
  
  
      },
        (error: any) => {
          this.functionsService.alertError(error,'Solicitud de Viaje')
  
        })
    }
    viewSolicitudViaje(id: string) {
      this.functionsService.navigateTo(`/core/edit-viaje/false/${id}`)
  
    }
  
    newUser() {
  
      this.functionsService.navigateTo('core/new-viaje')
    }
  
  
    buscar(termino) {
      termino = termino.trim()
      setTimeout(() => {
        if (termino.length === 0) {
          this.solicitudViajes = this.solicitudViajesTemp
          return
        }
        this.busquedasService.buscar('solicitudViajes', termino, this.functionsService.isAdmin()).subscribe((resp) => {
          this.solicitudViajes = this.functionsService.getActives(resp)
          
       
        })
  
      }, 500);
    }
     
    buscarCatalogo(tipo: string, value) {
  
      switch (tipo) {
        case 'solicitudViajes':
          if (value == '') {
            this.solicitudViajes = this.solicitudViajesTemp
       
          }
          this.busquedasService.buscarCatalogo('solicitudViajes', value).subscribe((resp) => {
            this.solicitudViajes = resp
          })
          break;
       
  
        case 'salon':
          break;
      }
    }
  }
  