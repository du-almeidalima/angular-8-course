import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from "rxjs";

import * as AuthActions from './auth.actions';
import {User} from "../user.model";
import {environment as env} from "../../../../environments/environment";
import {AuthResponseData} from "../../../shared/models/firebase/response-data.model";
import {MessageMapper} from "../../../shared/utils/message-mapper";
import {MessageStatus} from "../../../shared/enums/message-status.enum";

@Injectable()
export class AuthEffects {
  private readonly SIGN_IN_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp';
  private readonly LOGIN_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';

  constructor( private actions$: Actions, private http: HttpClient, private router: Router ) {}

  @Effect()
  authLoginStart = this.actions$.pipe(
    // What Action(ons) type will this Observable reacting
    ofType(AuthActions.LOGIN_START),
    // Taking the Action Observable and mapping it to a new Observable
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(this.LOGIN_URL,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          },
          {
            params: new HttpParams().set('key', env.firebaseAPIKey)
          }
        ).pipe(
          map((resData: AuthResponseData) => {
            const expirationDate = new Date().getTime() + (+resData.expiresIn * 1000);
            const user = new User(resData.email, resData.localId, resData.idToken, new Date(expirationDate));

            return new AuthActions.LogInSuccess(user);
          }),
          catchError((errorRes: HttpErrorResponse) => {
            const errorCode = errorRes?.error?.error?.message;
            const responseMessage = errorCode
            ? MessageMapper.mapMessage(errorCode)
            : { message: 'A different error message format was received from API', status: MessageStatus.ERROR }

            return of(new AuthActions.LogInFail(responseMessage))
          })
        )
    })
    // Creating a new action based on the return from the last Observable
  );

  @Effect({dispatch: false})
  authLoginSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN_SUCCESS),
    tap(() => {

      this.router.navigate(['/'])
    })
  )
}

/*
 * Effects are an RxJS powered side effect model for Store. Effects use streams to provide new sources of actions to reduce
 * state based on external interactions such as network requests, web socket messages and time-based events.
 *
 * In a service-based Angular application, components are responsible for interacting with external resources directly
 * through services. Instead, effects provide a way to interact with those services and isolate them from the
 * components.
 * Effects are where you handle tasks such as fetching data, long-running tasks that produce multiple events, and other
 * external interactions where your components don't need explicit knowledge of these interactions.
 */

/*
 * In my words: Actions are a big Observable that will be notified whenever a action is dispatched in the App, but what
 * makes it different from the reduce is that we don't change the State, so an action is something we need to do in our
 * app, HTTP Calls, Websocket... But it doesn't interfere the state. After this code is done, we can dispatch a new
 * Action.
 * Also, the effect for AuthActions.LOGIN_SUCCESS is firstly captured in AuthReducer and then in AuthEffects.
 * OBS: It's not needed to call subscribe on a Action, NgRx does it already.
 */

/*
 * Creating new Observables for responses
 * The Actions is a Stream of Observables of any Action our app receives, so it can never die!
 * That being said, any observable returned from it can't be a error Observable that would shut the Stream. So we can't
 * use the catchError() Observable in the outer flow, because this would shut the Actions Observable.
 */

/*
 * After finishing the request
 * So a Effect generally dispatch an Action when it's done. By annotating our method with @Effect it'll automatically
 * dispatch a new Action coming from the result Observable1
 */

/*
 * To plug this Effect class into our application, we need to do something similar to the StoreModule,
 * We need to add it into our main Module.
 */