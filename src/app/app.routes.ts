// import { Routes } from '@angular/router';

// export const routes: Routes = [];

import { Routes } from '@angular/router';
import { AdmissionForm } from './components/admission-form/admission-form';
import { MarksEntry } from './components/marks-entry/marks-entry';
import { Graph } from './components/graph/graph';


export const routes: Routes = [
  { path: '', component: AdmissionForm },
  { path: 'marks', component: MarksEntry },
  { path: 'graph', component: Graph }
];