export class Asignacion {
    constructor(
        public stock: string,
        public usuario: string,
        public estadoEntrega: string,
        public imgEntrega: string,
        public descripcionEntrega: string,
        public aceptacion: boolean,
        public quienEntrego: string,
        public estadoRegreso: string,
        public imgRegreso: string,
        public descripcionRegreso: string,
        public aceptacionRegreso: boolean,
        public quienRecibio: string,
        public activated: boolean,
        public usuarioCreated: any,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}