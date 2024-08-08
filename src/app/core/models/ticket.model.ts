export class Ticket {
    constructor(
        public tipoTicket: string,
        public usuarioCreated: string,
        public usuarioAtendio: string,
        public descripcion: string,
        public respuesta: string,
        public img: string,
        public estado: string,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}