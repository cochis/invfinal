export class SolicitudViaje {
    constructor(


        public tipoSolicitudViaje: string,
        public empleado: string,
        public dateViaje: number,
        public duracion: number,
        public destino: string,
        public proposito: string,
        public dateSalida: number,
        public dateRegreso: number,
        public medioTransporte: string,
        public tipoTransporte: string,
        public detalleTransporte: string,
        public numeroTransporte: string,
        public cantidadSolicitada: number,
        public cantidadAprobada: number,
        public cantidadJustifico: number,
        public cantidadRegreso: number,
        public aprobado: boolean,
        public fechaAprobacion: number,
        public moneda: string,
        public usuarioCreated: string,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public fechaPagado?: number,
        public pagado?: boolean,
        public uid?: string

    ) { }
}
