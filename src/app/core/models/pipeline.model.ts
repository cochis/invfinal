

export class Pipeline {
  constructor(
      public id: string,
      public name: string,
      public stages: Stage[],
      public activated: boolean,
      public usuarioCreated: any,
      public dateCreated: number,
      public lastEdited: number,
      public uid?: string
  ) { }
}

export interface Stage {

  id: number
  name: string
  win_probability?: number
}
