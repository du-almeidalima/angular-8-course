import {NgModule} from "@angular/core";
import {AuthComponent} from "./auth.component";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "./auth.interceptor";
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";

const AUTH_ROUTES: Routes = [
  { path: 'login', component: AuthComponent }
];

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports:
  [
    CommonModule,
    FormsModule,
    RouterModule.forChild(AUTH_ROUTES),
    SharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AuthModule {

}
