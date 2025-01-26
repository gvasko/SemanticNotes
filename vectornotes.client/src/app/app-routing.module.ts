import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AllNotesViewComponent } from './all-notes-view/all-notes-view.component';
import { SemanticNavigatorComponent } from './semantic-navigator/semantic-navigator.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'notes', component: AllNotesViewComponent },
  { path: 'navigator', component: SemanticNavigatorComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
