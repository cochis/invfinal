export class Oportunity {
    constructor(
        public id: number,
        public name: string,
        public close_date: string,
        public pipeline_id: number,
        public pipeline_stage_id: number,
        public priority: string,
        public status: string,
        public tags: any[],
        public interaction_count: number,
        public converted_unit: any,
        public converted_value: any,
        public date_stage_changed: number,
        public leads_converted_from: any[],
        public date_lead_created: any,
        public date_created: number,
        public date_modified: number,
        public custom_fields: CustomField[],
        public usuarioCreated: string,
        public activated: Boolean,
        public dateCreated: number,
        public lastEdited: number,
        public assignee_id?: number,
        public company_id?: number,
        public company_name?: string,
        public customer_source_id?: number,
        public details?: string,
        public loss_reason_id?: number,
        public primary_contact_id?: number,
        public monetary_unit?: string,
        public monetary_value?: number,
        public win_probability?: number,
        public date_last_contacted?: number,
        public uid?: string
        ) { }
    }

    interface CustomField {
        custom_field_definition_id: number
        value: any
      }
      
    