import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/olp/olp.module').then(m => m.OlpModule)
  },
];
