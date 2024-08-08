export class TipoGasto {
    tipogasto: TipoGasto;
    constructor(
        public empresa: string,
        public nombre: string,
        public clave: string,
        public aprobacionPor: string,
        public activated: boolean,
        public usuarioCreated: any,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}