import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { FinancesComponent } from './finances/finances.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

export const AppRoutes: Routes = [
  // default route
  {
    path: '', // <your-domain>/
    component: FinancesComponent,
  },
  {
    path: 'about', // <your-domain>/about
    component: AboutComponent,
  },
  // "catch all" route (in the case that the route the user is attempting to navigate to doesn't exist)
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
