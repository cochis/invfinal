export class TipoSolicitudViaje {
    tipoSolicitudViaje: TipoSolicitudViaje;
    constructor(
        public nombre: string,
        public clave: string,
        public activated: boolean,
        public usuarioCreated: any,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}