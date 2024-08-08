import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CargarAbasto, CargarCargas, CargarCompany, CargarDestinos, CargarMateriaPrimas, CargarOrigens, CargarProveedorTransportes, CargarProveedors, CargarTipoCargas, CargarUnidadMedidas, CargarUsuarios } from 'src/app/core/interfaces/cargar-interfaces.interfaces';
import { Abasto } from 'src/app/core/models/abasto.model';
import { Carga } from 'src/app/core/models/carga.model';
import { Company } from 'src/app/core/models/company.model';
import { ContacType } from 'src/app/core/models/contacType.model';
import { Destino } from 'src/app/core/models/destino.model';
import { MateriaPrima } from 'src/app/core/models/materiaPrima.model';
import { Origen } from 'src/app/core/models/origen.model';
import { Proveedor } from 'src/app/core/models/proveedor.model';
import { ProveedorTransporte } from 'src/app/core/models/proveedorTransporte.model';
import { Stock } from 'src/app/core/models/stock.model';
import { TipoCarga } from 'src/app/core/models/tipoCarga.model';
import { TipoStock } from 'src/app/core/models/tipoStock.model';
import { UnidadMedida } from 'src/app/core/models/unidadMedida.model';
import { UserCopper } from 'src/app/core/models/userCopper.model';
import { Usuario } from 'src/app/core/models/usuario.model';
import { AbastosService } from 'src/app/core/services/abastos.service';
import { CargasService } from 'src/app/core/services/cargas.service';
import { CopperServices } from 'src/app/core/services/copper.service';
import { DestinosService } from 'src/app/core/services/destinos.service';
import { FileService } from 'src/app/core/services/file.service';
import { MateriaPrimasService } from 'src/app/core/services/materiaPrimas.service';
import { OrigensService } from 'src/app/core/services/origens.service';
import { ProveedorTransportesService } from 'src/app/core/services/provedorTransportes.service';
import { ProveedorsService } from 'src/app/core/services/proveedor.service';
import { RolesService } from 'src/app/core/services/roles.service';
import { StocksService } from 'src/app/core/services/stock.service';
import { TipoCargasService } from 'src/app/core/services/tipoCargas.service';
import { TipoStockService } from 'src/app/core/services/tipoStock.service';
import { UnidadMedidasService } from 'src/app/core/services/unidadMedida.service';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { FunctionsService } from 'src/app/shared/services/functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent {
  ADM = environment.ADM

  rol = this.functionsService.getLocal('role')
  loading = false
  usuarios: Usuario[]
  cargas: Carga[]
  origens: Origen[]
  unidadMedidas: UnidadMedida[]
  proveedors: Proveedor[]
  proveedorTransportes: ProveedorTransporte[]
  materiaPrimas: MateriaPrima[]
  destinos: Destino[]
  tipoCargas: TipoCarga[]
  createdAbasto: false
  company: Company
  public imagenSubir!: File
  public fotoTicketOrigenTemp: any = []
  public fotoTicketDestinoTemp: any = []
  public form!: FormGroup
  today: Number = this.functionsService.getToday()
  dateToday = this.functionsService.numberToDate(this.today)
  userCoppers: UserCopper[]
  contacTypes: ContacType[]
  submited: boolean = false
  cargando: boolean = false
  msnOk: boolean = false
  id!: string
  edit!: string
  url = environment.base_url
  constructor(
    private fb: FormBuilder,
    public functionsService: FunctionsService,
    public copperServices: CopperServices,
    private origenService: OrigensService,
    private destinoService: DestinosService,
    private unidadMedidaService: UnidadMedidasService,
    private proveedorService: ProveedorsService,
    private materiaPrimasService: MateriaPrimasService,
    private cargasService: CargasService,
    private tipoCargasService: TipoCargasService,
    private proveedorTransportesService: ProveedorTransportesService,
    private fileService: FileService,
    private route: ActivatedRoute,

  ) {
    this.id = this.route.snapshot.params['id']


    this.edit = this.route.snapshot.params['edit']
    this.loading = true

    this.getId(this.id)
    this.getCatalogos()
    this.createForm()
    this.loading = true
    setTimeout(() => {
      this.loading = false

    }, 1500);
  }


  getCatalogos() {
    this.copperServices.cargarUserCoppesAll().subscribe((resp: any) => {
      this.userCoppers = resp.userCoppers
    })
    this.copperServices.cargarContacTypeAll().subscribe((resp: any) => {
      this.contacTypes = resp.contacTypes
    })
  }

  get errorControl() {
    return this.form.controls;
  }
  getId(id: string) {

    this.loading = true
    this.copperServices.cargarCompanyById(id).subscribe((resp: CargarCompany) => {
      this.company = resp.company
      setTimeout(() => {
        this.setForm(this.company)
      }, 1500);
    },
      (error: any) => {
        this.loading = false
        this.functionsService.alertError(error, 'Tipo ticket')
      })
  }
  createForm() {

    this.form = this.fb.group({
      id: [],
      name: [],
      address: [],
      street: [],
      city: [],
      state: [],
      country: [],
      postal_code: [],
      assignee_id: [],
      contact_type_id: [],
      details: [],
      email_domain: [],
      phone_numbers: this.fb.array([]),
      socials: this.fb.array([]),
      tags: this.fb.array([]),
      websites: [],
      custom_fields: [],
      interaction_count: [],
      usuarioCreated: [''],
      activated: [true],
      date_created: [this.today],
      date_modified: [this.today],
    })

  }


  get phone_numbers(): FormArray {
    return this.form.get("phone_numbers") as FormArray
  }
  newPhone(): FormGroup {
    return this.fb.group({
      category: [''],
      number: [''],
      _id: [''],
    })
  }
  phone(phone): FormGroup {
    return this.fb.group({
      number: [phone.number],
      category: [phone.category],
      _id: [phone._id],
    })
  }

  setPhone(phone: any) {
    this.phone_numbers.push(this.phone(phone));
  }
  addPhone() {
    this.phone_numbers.push(this.newPhone());
  }
  removePhone(i: number) {
    this.phone_numbers.removeAt(i);
  }

  get socials(): FormArray {
    return this.form.get("socials") as FormArray
  }
  newSocial(): FormGroup {
    return this.fb.group({
      category: [''],
      url: [''],
      _id: [''],
    })
  }
  social(social): FormGroup {

    return this.fb.group({
      url: [social.url],
      category: [social.category],
      _id: [social._id],
    })
  }

  setSocial(social: any) {
    this.socials.push(this.social(social));
  }
  addSocial() {
    this.socials.push(this.newSocial());
  }
  removeSocial(i: number) {
    this.socials.removeAt(i);
  }
  get tags(): FormArray {
    return this.form.get("tags") as FormArray
  }
  newTag(): FormGroup {
    return this.fb.group({
      text: ['']
    })
  }
  tag(tag): FormGroup {
    return this.fb.group({
      text: [tag]
    })
  }

  setTag(tag: any) {
    this.tags.push(this.tag(tag));
  }
  addTag() {
    this.tags.push(this.newTag());
  }
  removeTag(i: number) {
    this.tags.removeAt(i);
  }


  
  get websites(): FormArray {
    return this.form.get("websites") as FormArray
  }
  newWebsite(): FormGroup {
    return this.fb.group({
      category: [''],
      url: [''],
      _id: [''],
    })
  }
  website(website): FormGroup {

    return this.fb.group({
      url: [website.url],
      category: [website.category],
      _id: [website._id],
    })
  }

  setWebsite(website: any) {
    this.websites.push(this.website(website));
  }
  addWebsite() {
    this.websites.push(this.newWebsite());
  }
  removeWebsite(i: number) {
    this.websites.removeAt(i);
  }












  setForm(company: Company) {
    this.form = this.fb.group({
      id: [company.id],
      name: [company.name],
      address: [company.address],
      street: [company.address.street],
      city: [company.address.city],
      state: [company.address.state],
      country: [company.address.country],
      postal_code: [company.address.postal_code],
      assignee_id: [company.assignee_id],
      contact_type_id: [company.contact_type_id],
      details: [company.details],
      email_domain: [company.email_domain],
      phone_numbers: this.fb.array([]),
      socials: this.fb.array([]),
      tags: this.fb.array([]),
      websites: this.fb.array([]),
      custom_fields: [company.custom_fields],
      interaction_count: [company.interaction_count],
      usuarioCreated: [company.usuarioCreated],
      activated: [true],
      date_created: [company.date_created],
      date_modified: [this.today],
    })


    if (company.phone_numbers.length > 0) {
      company.phone_numbers.forEach(phone => {
        this.setPhone(phone)
      });
    }
    if (company.socials.length > 0) {
      company.socials.forEach(social => {
        this.setSocial(social)
      });
    }
    if (company.tags.length > 0) {
      company.tags.forEach(tag => {
        this.setTag(tag)
      });
    }
    if (company.websites.length > 0) {
      company.websites.forEach(website => {
        this.setWebsite(website)
      });
    }

    this.loading = false


  }


  onSubmit() {
    this.loading = true
    this.submited = true
    // if (!this.createdAbasto) {


    //   if (this.form.valid) {


    //     this.loading = false


    //     if (this.form.value.companies.length > 0) {
    //       var companiesA = []
    //       this.form.value.companies.forEach(viaje => {
    //         let via = {
    //           ...viaje,
    //           fechaAbasto: new Date(viaje.fechaAbasto).getTime(),
    //           fechaProceso: new Date(viaje.fechaProceso).getTime(),
    //         }

    //         companiesA.push(via)
    //       });
    //     }




    //     let obj = {
    //       ...this.abasto,
    //       ...this.form.value,
    //       companies: companiesA,
    //       usuarioCreated: this.functionsService.getLocal('uid')
    //     }






    //     this.abastoService.actualizarAbasto(obj).subscribe((resp: any) => {

    //       //Message
    //       this.functionsService.navigateTo('core/abasto')
    //       this.loading = false
    //     },
    //       (error) => {
    
    //         //Message
    //         this.loading = false


    //       })
    //   } else {

    //     //Message
    //     this.loading = false
    //     return
    //   }
    // } else {

    //   if (this.form.valid) {


    //     this.loading = false


    //     if (this.form.value.companies.length > 0) {
    //       var companiesA = []
    //       this.form.value.companies.forEach(viaje => {
    //         let via = {
    //           ...viaje,
    //           fechaAbasto: new Date(viaje.fechaAbasto).getTime(),
    //           fechaProceso: new Date(viaje.fechaProceso).getTime(),
    //         }

    //         companiesA.push(via)
    //       });

    //     }




    //     let obj = {
    //       ...this.form.value,
    //       companies: companiesA,
    //       usuarioCreated: this.functionsService.getLocal('uid')
    //     }

    //     this.abastoService.crearAbasto(obj).subscribe((resp: any) => {

    //       //Message
    //       this.functionsService.navigateTo('core/abasto')
    //       this.loading = false
    //     },
    //       (error) => {
    //         //Message
    //         this.loading = false


    //       })
    //   } else {

    //     //Message
    //     this.loading = false
    //     return
    //   }

    // }


  }

  back() {
    this.functionsService.navigateTo('core/copper/companies')
  }




}
