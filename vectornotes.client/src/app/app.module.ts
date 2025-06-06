import { HTTP_INTERCEPTORS, HttpClientModule, HttpInterceptor, provideHttpClient } from '@angular/common/http';
import { Inject, Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from './general/spinner/spinner.component';
import { LoadingInterceptor } from './services/loading.interceptor';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { SemanticBrowserComponent } from './semantic-browser/semantic-browser.component';
import { AllNotesViewComponent } from './all-notes-view/all-notes-view.component';
import { CardListComponent } from './all-notes-view/card-list/card-list.component';
import { QuickNoteEditorComponent } from './quick-note-editor/quick-note-editor.component';
import { ReactiveFormsModule } from '@angular/forms';

// Required for MSAL
import { IPublicClientApplication, PublicClientApplication, InteractionType, BrowserCacheLocation, LogLevel } from '@azure/msal-browser';
import { MsalGuard, MsalInterceptor, MsalBroadcastService, MsalInterceptorConfiguration, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalGuardConfiguration, MsalRedirectComponent, ProtectedResourceScopes } from '@azure/msal-angular';
import { NoteCardComponent } from './all-notes-view/note-card/note-card.component';
import { CreateTagDialogComponent } from './create-tag-dialog/create-tag-dialog.component';
import { TagListComponent } from './tag-list/tag-list.component';
import { InsightComponent } from './insight/insight.component';
import { NoteMapComponent } from './note-map/note-map.component';
import { CollectionSelectorComponent } from './collection-selector/collection-selector.component';
import { CreateCollectionDialogComponent } from './create-collection-dialog/create-collection-dialog.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MoveNoteDialogComponent } from './move-note-dialog/move-note-dialog.component';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: "0eef49d8-a279-4b40-8317-388bf1acf00d",
      authority: "https://login.microsoftonline.com/c3177814-4713-490a-8352-ef79204f200e",
      redirectUri: "/",
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE
    },
    system: {
      loggerOptions: {
        loggerCallback(logLevel: LogLevel, message: string) {
          console.log(message);
        },
        logLevel: LogLevel.Warning,
        piiLoggingEnabled: true,
      },
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string | ProtectedResourceScopes> | null>();

  protectedResourceMap.set("https://graph.microsoft.com/v1.0/me", ["user.read"]);

  protectedResourceMap.set("/api/", ["api://95186c57-9c79-4de8-a29e-bea5d80b6cd8/Notes.Manage"]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read']
    }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    NavbarComponent,
    HomeComponent,
    SemanticBrowserComponent,
    AllNotesViewComponent,
    CardListComponent,
    QuickNoteEditorComponent,
    NoteCardComponent,
    CreateTagDialogComponent,
    TagListComponent,
    InsightComponent,
    NoteMapComponent,
    CollectionSelectorComponent,
    CreateCollectionDialogComponent,
    ConfirmationDialogComponent,
    MoveNoteDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatTableModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatChipsModule,
    MatTabsModule,
    MatSelectModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatExpansionModule,
    ReactiveFormsModule,
    HttpClientModule,
    MsalModule
  ],
  providers: [
    provideAnimationsAsync(),
    //provideHttpClient(), bad idea, MsalInterceptor won't work
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
