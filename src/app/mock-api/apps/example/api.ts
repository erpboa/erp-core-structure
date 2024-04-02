import { Injectable } from '@angular/core';
import { BobyMockApiService } from '../../../../@boby/lib/mock-api';

@Injectable({providedIn: 'root'})
export class ExampleMockApi
{

    /**
     * Constructor
     */
    constructor(private _bobyMockApiService: BobyMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {

        // -----------------------------------------------------------------------------------------------------
        // @ Categories - GET
        // -----------------------------------------------------------------------------------------------------
        this._bobyMockApiService
            .onGet('api/apps/example/items')
            .reply(() =>
            {
                // List the items
                const items = [];



                return [200, items];
            });

    }
}
