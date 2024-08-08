export class Factura {
    constructor(
        public solicitudViaje: string,
        public date: number,
        public descripcion: string,
        public tipoFactura: string,
        public cantidad: number,
        public moneda: string,
        public currencyExchange: number,
        public file: string,
        public activated: boolean,
        public usuarioCreated: any,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}