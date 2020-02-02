import {
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatSelectModule
} from '@angular/material';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedUiChartModule } from '@coding-challenge/shared/ui/chart';
import { StocksComponent } from './stocks/stocks.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: StocksComponent }
    ]),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SharedUiChartModule
  ],
  providers: [MatDatepickerModule],
  declarations: [StocksComponent]
})
export class StocksFeatureShellModule {}
