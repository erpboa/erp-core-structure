import {Injectable} from "@angular/core";
import {ApiErpService} from "../../../api-erp/api-erp.service";
import {switchMap} from "rxjs/operators";
import {Observable,from,of} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FuncionarioService{

    constructor(private _api: ApiErpService) { }

    getFuncionarios(): Observable<any>{
        return from (this._api.post('organigrama/Funcionario/listarFuncionario',{
            start: 0,
            limit:50
        })).pipe(
            switchMap((response) =>{
                return of(response)
            })
        );
    }

}
