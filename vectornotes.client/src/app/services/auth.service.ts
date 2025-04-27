import { Inject, Injectable } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus, EventMessage, RedirectRequest, EventType, AuthenticationResult } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { UserApiService } from './api/user-api.service';
import { UserInfo } from '../model/user-info';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isInitialized = false;
  private isAuthenticatedUser = false;
  tokenExpiration: string = '';
  private readonly _destroying$ = new Subject<void>();
  private ensureUserIsCreated = true;

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private userApiService: UserApiService
  ) { }

  init() {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        console.log("Ensure user is created. (1)")

        if (!this.ensureUserIsCreated) {
          console.log("User is already created. (1)");
          return;
        }
        this.ensureUserIsCreated = false;

        this.userApiService.create(new UserInfo()).subscribe(userInfo => {
          console.log("Email: " + userInfo.email);
          this.setAuthenticated();
          this.isInitialized = true;
        })
      });

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        this.msalService.instance.setActiveAccount(payload.account);

        console.log("Ensure user is created. (2)")

        if (!this.ensureUserIsCreated) {
          console.log("User is already created. (2)");
          return;
        }
        this.ensureUserIsCreated = false;

        this.userApiService.create(new UserInfo()).subscribe(userInfo => {
          console.log("Email: " + userInfo.email);
          this.setAuthenticated();
          this.isInitialized = true;
        })
     });

    // Used for storing and displaying token expiration
    this.msalBroadcastService.msalSubject$.pipe(filter((msg: EventMessage) => msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS)).subscribe(msg => {
      this.tokenExpiration = (msg.payload as any).expiresOn;
      localStorage.setItem('tokenExpiration', this.tokenExpiration);
    });
  }

  destroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  private setAuthenticated() {
    this.isAuthenticatedUser = this.msalService.instance.getAllAccounts().length > 0;
  }

  login() {
    if (this.msalGuardConfig.authRequest) {
      this.msalService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this.msalService.loginRedirect();
    }
  }

  logout() {
    this.msalService.logoutRedirect();
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedUser;
  }

  getUserName(): string | undefined {
    if (!this.isInitialized) {
      return "";
    }
    return this.msalService.instance.getActiveAccount()?.name;
  }
}
