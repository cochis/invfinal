export class PagoProgramado {
    pagoProgramado: PagoProgramado;
    constructor(

        public consecutivo: number,
        public urgente: boolean,
        public subsidiaria: string,
        public tipoGasto: string,
        public terminoPago: string,
        public proveedor: string,
        public proveedorLoop: string,
        public clienteLoop: string,
        public impExpLoop: string,
        public concepto: string,
        public cantidad: number,
        public fechaSolicitud: number,
        public fechaPago: number,
        public pagado: boolean,
        public fechaProgramada: number,
        public fechaVencimiento: number,
        public pagoA: string,
        public quote: string,
        public aprobacion: boolean,
        public tipoServicio: string,
        public observaciones: string,
        public factura: string,
        public tipoFactura: string,
        public cotizacion: string,
        public comprobante: string,
        public empresa: string,
        public moneda: string,
        public activated: boolean,
        public usuarioCreated: string,
        public dateCreated: string,
        public lastEdited: string,
        public uid: string,




    ) { }
}




