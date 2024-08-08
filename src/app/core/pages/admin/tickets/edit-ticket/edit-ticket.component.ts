import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarEstadoTickets, CargarTicket, CargarTipoTickets, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { EstadoTicket } from 'src/app/core/models/estadoTicket.model';
import { Ticket } from 'src/app/core/models/ticket.model';
import { TipoTicket } from 'src/app/core/models/tipoTicket.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { EstadoTicketService } from 'src/app/core/services/estadoTicket.service';
import { FileService } from 'src/app/core/services/file.service';
import { TicketService } from 'src/app/core/services/ticket.service';
import { TipoTicketService } from 'src/app/core/services/tipoTicket.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css']
})
export class EditTicketComponent{
  loading = false
  ADM =environment.ADM  
  initTicket = environment.init_ticket
  public imagenSubir!: File
  public imgTemp: any = undefined
  estadoTicket: EstadoTicket
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  formSubmitted: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  ticket: Ticket
  usuarios: Usuario[]
  tipoTickets: TipoTicket[]
  estadoTickets: EstadoTicket[]
  id!: string
  edit: string = 'false'
  estadoInicial!: string
  url = environment.base_url
  addPicture=false
  img='default.jpg'
 uid:string = this.functionsService.getLocal('uid')
 rol:string = this.functionsService.getLocal('role')
  constructor(
    private fb: FormBuilder,
    private functionsService: FunctionsService,
    private usuariosService: UsuariosService,
    private ticketsService: TicketService,
    private tipoTicketsService: TipoTicketService,
    private estadosTicketsService: EstadoTicketService,
    private estadoTicketService: EstadoTicketService,
    private route: ActivatedRoute,
    private fileService: FileService,
  ) {
    this.createForm()
      this.getCatalogos()
    
    this.id = this.route.snapshot.params['id']
   

    this.edit = this.route.snapshot.params['edit']
   
    this.loading = true

    this.getId(this.id)

   
    this.loading = true

    setTimeout(() => {

      this.loading = false
    }, 1500);
  }

  getId(id: string) {

    this.loading = true
    this.ticketsService.cargarTicketById(id).subscribe((resp: CargarTicket) => {
      this.ticket = resp.ticket
    
      if( this.ticket.img !== '' &&  this.ticket.img){

        this.img = this.ticket.img
       
      }
      setTimeout(() => {

        this.setForm(this.ticket)
      }, 500);

    },
      (error: any) => {
        this.loading = false
        this.functionsService.alertError(error,'Ticket')


      })
  }
  getCatalogos() {
    
    this.loading = true
    this.tipoTicketsService.cargarTipoTicketsAll().subscribe((resp: CargarTipoTickets) => {
      this.tipoTickets = resp.tipoTickets
    
    },
      (error: any) => {
        this.functionsService.alertError(error,'Ticket')
        this.loading = false
      })
    this.loading = true
    this.estadoTicketService.cargarEstadoTicketsAll().subscribe((resp: CargarEstadoTickets) => {
      this.estadoTickets = resp.estadoTickets
        
    },
      (error: any) => {
        this.functionsService.alertError(error,'Ticket')
        this.loading = false
      })
    this.loading = true
    this.usuariosService.cargarAlumnosAll().subscribe((resp: CargarUsuarios) => {
      this.usuarios = resp.usuarios
        
    },
      (error: any) => {
        this.functionsService.alertError(error,'Ticket')
        this.loading = false
      })

  }

  createForm() {
    this.form = this.fb.group({
      tipoTicket: ['', [Validators.required]],
      usuarioCreated: [''],
      descripcion: ['', [Validators.required]],
      respuesta: [''],
      estado: [''],
      dateCreated: [this.today],
      lastEdited: [this.today],
    })
  }

  setForm(ticket: any) {
   
    let user = this.functionsService.getValueCatalog(ticket.usuarioCreated,'email',this.usuarios) 
    let estadoTicket = this.functionsService.getValueCatalog(ticket.estado,'nombre',this.estadoTickets) 
    let tipoTicket = this.functionsService.getValueCatalog(ticket.tipoTicket,'nombre',this.tipoTickets) 
 

    this.form = this.fb.group({
      tipoTicket: [(this.edit==='true')?ticket.tipoTicket : tipoTicket, [Validators.required]],
      usuarioCreated: [(this.edit==='true')?ticket.usuarioCreated : user],
      descripcion: [ticket.descripcion, [Validators.required]],
      respuesta: [ticket.respuesta, [Validators.required]],
      estado: [(this.edit==='true')?ticket.estado : estadoTicket],
      dateCreated: [this.functionsService.numberToDate(ticket.dateCreated)],
      lastEdited: [this.today],
    })
    
 



  }

  onSubmit() {
    this.loading = true
     
    let obj:Ticket = {
      ...this.ticket,
      ...this.form.value,
      usuarioAtendio:this.uid,
      dateCreated:this.ticket.dateCreated
      
     }
 
     this.ticketsService.actualizarTicket( obj).subscribe(  (resp: any) => {
    
      this.ticket = resp.ticket
      
      this.loading = false
      this.functionsService.alertUpdate('Ticket')
      this.back()
  
       
      
    },
      (error) => {

        this.functionsService.alertError(error, 'Tickets')
        this.loading = false

       

      })
    
    if (this.form.valid) {
    } else {

      //Message
      this.loading = false
      return  
    }


  }
  cambiarImagen(file: any) {
    this.loading = true
    this.imagenSubir = file.target.files[0]
    
    if (!file.target.files[0]) {
      this.imgTemp = null
      this.functionsService.alert('Usuarios', 'No se encontró imagen', 'error')
      this.loading = false
     
    } else {
      

      const reader = new FileReader()
      const url64 = reader.readAsDataURL(file.target.files[0])
     
      reader.onloadend = () => {
        this.imgTemp = reader.result
         
      }
      this.subirImagen()

    }
  }
  subirImagen() {
    this.fileService
      .actualizarFoto(this.imagenSubir, 'tickets', this.ticket.uid)
      .then(
        (img) => {
          this.ticket.img = img
          this.loading = false
          this.functionsService.alertUpdate('Ticket')
          this.back()

        },
        (err) => {

          this.loading = false
          this.functionsService.alert('Ticket', 'Error al subir la imagen', 'error')
        },
      )
  }
  back(){
    this.functionsService.navigateTo('/core/tickets')
  }
}
