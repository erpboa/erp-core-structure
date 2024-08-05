import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError, from } from 'rxjs';

import PxpClient from 'pxp-client';
import { environment } from '../../../environments/environment';
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthService
{
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
        let auth = JSON.parse(localStorage.getItem('aut'));

        if( auth ) {
            this._authenticated = true;
        }else{
            this._router.navigate(['sign-in']);
        }
    }


    /**
     * Initialize params for authentication ERP
     */
    initErp() {
        PxpClient.init(
            environment.host,
            environment.baseUrl,
            environment.mode,
            environment.port,
            environment.protocol,
            environment.backendRestVersion,
            environment.initWebSocket,
            environment.portWs,
            environment.backendVersion,
            environment.urlLogin,
            environment.storeToken
        );
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        this.initErp();

        return from(PxpClient.login(credentials.email, credentials.password)).pipe(
            switchMap((response: any) =>
            {
                if ( response.data.success ) {
                    this._authenticated = true;

                    let protocol = location.protocol.replace(':', '');
                    let user = {
                        id: response.data.id_usuario,
                        name: response.data.nombre_usuario,
                        email: response.user,
                        avatar: `${protocol}://erp.boa.bo/uploaded_files/sis_parametros/Archivo/${response.data.logo}`,
                        status: "online"
                    };
                    this._userService.user = user;

                    // Return a new observable with the response
                    return of(user);
                }
            }),
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Sign in using the token
        return this._httpClient.post('api/auth/sign-in-with-token', {
            accessToken: this.accessToken,
        }).pipe(
            catchError(() =>

                // Return false
                of(false),
            ),
            switchMap((response: any) =>
            {
                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                if ( response.accessToken )
                {
                    this.accessToken = response.accessToken;
                }

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            }),
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('aut');
        // Set the authenticated flag to false
        this._authenticated = false;
        PxpClient.logout();
        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        let auth:any = localStorage.getItem('aut');
        if ( auth !== null)
            auth = JSON.parse(auth);

        // Check if the user is logged in
        if (auth) {
            return of(true);
        }

        return of(false);
    }

    /**
     * Redirect to
     */
    redirect(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }
}
