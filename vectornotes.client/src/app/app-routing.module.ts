import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AllNotesViewComponent } from './all-notes-view/all-notes-view.component';
import { SemanticBrowserComponent } from './semantic-browser/semantic-browser.component';
import { MsalGuard, MsalRedirectComponent } from '@azure/msal-angular';
import { InsightComponent } from './insight/insight.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'insights', component: InsightComponent, canActivate: [MsalGuard] },
  { path: 'notes', component: AllNotesViewComponent, canActivate: [MsalGuard] },
  { path: 'browser', component: SemanticBrowserComponent, canActivate: [MsalGuard] },
  { path: 'browser/:id', component: SemanticBrowserComponent, canActivate: [MsalGuard] },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
