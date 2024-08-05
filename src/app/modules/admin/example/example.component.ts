import { Component, ViewEncapsulation } from '@angular/core';
import {FuncionarioService} from "../../../core/core-services/organigrama/funcionario/funcionario.service";
import {JsonPipe} from "@angular/common";

@Component({
    selector     : 'example',
    standalone   : true,
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [JsonPipe]
})
export class ExampleComponent
{
    public example: any;
    /**
     * Constructor
     */
    constructor(private _func: FuncionarioService)
    {
    }

    ngOnInit(){
        this._func.getFuncionarios().subscribe((resp)=>{
            this.example = resp.datos;
        });
    }
}
