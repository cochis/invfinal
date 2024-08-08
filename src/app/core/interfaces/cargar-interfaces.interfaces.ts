 
import { Abasto } from "../models/abasto.model"
import { Asignacion } from "../models/asignacion.model"
import { Carga } from "../models/carga.model"
import { ClienteLoop } from "../models/clienteLoop.model"
import { Compania } from "../models/compania.model"
import { Company } from "../models/company.model"
import { CustomField } from "../models/customField.model"
import { DataEs } from "../models/dataEs.model"
import { Departamento } from "../models/departamento.model"
import { Destino } from "../models/destino.model"
import { DollarApi } from "../models/dolarApi.model"
import { Empresa } from "../models/Empresa"
import { EstadoTicket } from "../models/estadoTicket.model"
import { Factura } from "../models/factura.model"
import { Incoterm } from "../models/incoterm.model"
import { Log } from "../models/log.model"
import { MateriaPrima } from "../models/materiaPrima.model"
import { Moneda } from "../models/moneda.model"
import { Oportunity } from "../models/oportunity.model"
import { Origen } from "../models/origen.model"
import { PagoProgramado } from "../models/pagoProgramado.model"
import { Pipeline } from "../models/pipeline.model"
import { Planta } from "../models/planta.model"
import { Producto } from "../models/producto.model"
import { ProductoJasu } from "../models/productoJasu.model"
import { Proveedor } from "../models/proveedor.model"
import { ProveedorLoop } from "../models/proveedorLoop.model"
import { ProveedorTransporte } from "../models/proveedorTransporte.model"
import { Puesto } from "../models/puesto.model"
import { Role } from "../models/role.model"
import { SolicitudViaje } from "../models/solicitudViaje.model"
import { Stock } from "../models/stock.model"
import { Subsidiaria } from "../models/subsidiaria.model"
import { TerminoPago } from "../models/terminoPago.model"
import { Ticket } from "../models/ticket.model"
import { TipoCarga } from "../models/tipoCarga.model"
import { TipoFactura } from "../models/tipoFactura.model"
import { TipoGasto } from "../models/tipoGasto.model"
import { TipoMaterial } from "../models/tipoMaterial.model"
import { TipoProveedor } from "../models/tipoProveedor.model"
import { TipoSolicitudViaje } from "../models/tipoSolicitudViaje.model"
import { TipoStock } from "../models/tipoStock.model"
import { TipoTicket } from "../models/tipoTicket.model"
import { TipoTransporte } from "../models/tipoTransporte.model"
import { UnidadMedida } from "../models/unidadMedida.model"
import { Usuario } from "../models/usuario.model"
import { Zona } from "../models/zona.model"


export interface CargarProductoJasu {
    productoJasu: ProductoJasu
}

export interface CargarProductoJasus {
    total: number
    productoJasus: ProductoJasu[]
} 

export interface CargarUsuario {
    usuario: Usuario
}

export interface CargarUsuarios {
    total: number
    usuarios: Usuario[]
} 



export interface CargarLog {
    log: Log
}

export interface CargarLogs {
    total: number
    logs: Log[]
} 
export interface CargarEmpresa {
    empresa: Empresa
}

export interface CargarEmpresas {
    total: number
    empresas: Empresa[]
} 




export interface CargarTipoTransporte {
    tipoTransporte: TipoTransporte
}

export interface CargarTipoTransportes {
    total: number
    tipoTransportes: TipoTransporte[]
} 
export interface CargarTipoSolicitudViaje {
    tipoSolicitudViaje: TipoSolicitudViaje
}

export interface CargarTipoSolicitudViajes {
    total: number
    tipoSolicitudViajes: TipoSolicitudViaje[]
} 
export interface CargarSolicitudViaje {
    solicitudViaje: SolicitudViaje
}

export interface CargarSolicitudViajes {
    total: number
    solicitudViajes: SolicitudViaje[]
} 
export interface CargarPagoProgramado {
    pagoProgramado: PagoProgramado
}

export interface CargarPuestos {
    total: number
    puestos: Puesto[]
} 
export interface CargarPuesto {
    puesto: Puesto
}

export interface CargarPagoProgramados {
    total: number
    pagoProgramados: PagoProgramado[]
} 

export interface CargarIncoterm {
    incoterm: Incoterm
}

export interface CargarIncoterms {
    total: number
    incoterms: Incoterm[]
} 
export interface CargarDepartamento {
    departamento: Departamento
}

export interface CargarDepartamentos {
    total: number
    departamentos: Departamento[]
} 
export interface CargarProducto {
    producto: Producto
}

export interface CargarProductos {
    total: number
    productos: Producto[]
} 
export interface CargarMoneda {
    moneda: Moneda
}

export interface CargarMonedas {
    total: number
    monedas: Moneda[]
} 
export interface CargarMateriaPrima {
    materiaPrima: MateriaPrima
}

export interface CargarMateriaPrimas {
    total: number
    materiaPrimas: MateriaPrima[]
} 
export interface CargarUnidadMedida {
    unidadMedida: UnidadMedida
}

export interface CargarUnidadMedidas {
    total: number
    unidadMedidas: UnidadMedida[]
} 
export interface CargarTipoMaterial {
    tipoMaterial: TipoMaterial
}

export interface CargarTipoMaterials {
    total: number
    tipoMaterials: TipoMaterial[]
} 

export interface CargarRol {
    role: Role
}

export interface CargarRoles {
    total: number
    roles: Role[]
} 
export interface CargarOrigen {
    origen: Origen
}

export interface CargarOrigens {
    total: number
    origens: Origen[]
} 
export interface CargarPlanta {
    planta: Planta
}

export interface CargarPlantas {
    total: number
    plantas: Planta[]
} 
export interface CargarCustomField {
    customField: CustomField
}

export interface CargarCustomFields {
    total: number
    customFields: CustomField[]
} 
export interface CargarOportunity {
    oportunity: Oportunity
}

export interface CargarOportunities {
    total: number
    oportunities: Oportunity[]
} 
export interface CargarCompany {
    company: Company
}

export interface CargarCompanys {
    total: number
    companys: Company[]
} 
export interface CargarCompania {
    compania: Compania
}

export interface CargarCompanias {
    total: number
    companias: Compania[]
} 
export interface CargarProveedorTransporte {
    proveedorTransporte: ProveedorTransporte
}

export interface CargarProveedorTransportes {
    total: number
    proveedorTransportes: ProveedorTransporte[]
} 
export interface CargarDestino {
    destino: Destino
}

export interface CargarDestinos {
    total: number
    destinos: Destino[]
} 
export interface CargarCarga {
    carga:Carga
}

export interface CargarCargas {
    total: number
    cargas: Carga[]
} 
export interface CargarMoneda {
    moneda:Moneda
}

export interface CargarMonedas {
    total: number
    monedas: Moneda[]
} 
export interface CargarTipoCarga {
    tipoCarga:TipoCarga
}

export interface CargarTipoCargas {
    total: number
    tipoCargas: TipoCarga[]
} 
export interface CargarTipoStock {
    tipoStock: TipoStock
}

export interface CargarTipoStocks {
    total: number
    tipoStocks: TipoStock[]
} 
export interface CargarTipoProveedor {
    tipoProveedor: TipoProveedor
}

export interface CargarTipoProveedors {
    total: number
    tipoProveedors: TipoProveedor[]
} 
export interface CargarSubsidiaria {
    subsidiaria: Subsidiaria
}

export interface CargarSubsidiarias {
    total: number
    subsidiarias: Subsidiaria[]
} 
export interface CargarTipoGasto {
    tipoGasto: TipoGasto
}

export interface CargarTipoGastos {
    total: number
    tipoGastos: TipoGasto[]
} 
export interface CargarTipoFactura {
    tipoFactura: TipoFactura
}

export interface CargarTipoFacturas {
    total: number
    tipoFacturas: TipoFactura[]
} 
export interface CargarTerminoPago {
    terminoPago: TerminoPago
}

export interface CargarTerminoPagos {
    total: number
    terminoPagos: TerminoPago[]
} 
export interface CargarTipoTicket {
    tipoTicket: TipoTicket
}

export interface CargarTipoTickets {
    total: number
    tipoTickets: TipoTicket[]
} 
export interface CargarEstadoTicket {
    estadoTicket: EstadoTicket
}

export interface CargarEstadoTickets {
    total: number
    estadoTickets: EstadoTicket[]
} 
export interface CargarStock {
    stock: Stock
}

export interface CargarStocks {
    total: number
    stocks: Stock[]
} 
export interface CargarProveedor {
    proveedor: Proveedor
}

export interface CargarProveedors {
    total: number
    proveedors: Proveedor[]
} 
export interface CargarZona {
    zona: Zona
}

export interface CargarZonas {
    total: number
    zonas: Zona[]
} 
export interface CargarAsignacion {
    asignacion: Asignacion
}

export interface CargarAsignacions {
    total: number
    asignacions: Asignacion[]
} 
export interface CargarTicket {
    ticket: Ticket
}

export interface CargarTickets {
    total: number
    tickets: Ticket[]
} 
export interface CargarDollarApi {
    dollarApi: DollarApi
}
export interface CargarAbasto {
    abasto: Abasto
}

export interface CargarAbastos {
    total: number
    abastos: Abasto[]
} 
export interface CargarFactura {
    factura: Factura
}

export interface CargarFacturas {
    total: number
    facturas: Factura[]
} 
export interface CargarOportunity {
    oportunity: Oportunity
}

export interface CargarOportunities {
    total: number
    oportunities: Oportunity[]
} 
export interface CargarPipeline {
    pipeline: Pipeline
}

export interface CargarPipelines {
    total: number
    pipelines: Pipeline[]
} 
export interface CargarDataEs {
    dataEs: DataEs
}

export interface CargarDataEss {
    total: number
    dataEss: DataEs[]
} 
export interface CargarProveedorLoop {
    proveedorLoop: ProveedorLoop
}

export interface CargarProveedorLoops {
    total: number
    proveedorLoops: ProveedorLoop[]
} 
export interface CargarClienteLoop {
    clienteLoop: ClienteLoop
}

export interface CargarClienteLoops {
    total: number
    clienteLoops: ClienteLoop[]
} 