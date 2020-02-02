import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { Subscription } from 'rxjs';

@Component({
    selector: 'coding-challenge-stocks',
    templateUrl: './stocks.component.html',
    styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit, OnDestroy {
    stockPickerForm: FormGroup;
    symbol: string;
    period: string;
    quotes$ = this.priceQuery.priceQueries$;
    symbolSub$: Subscription;
    periodSub$: Subscription;

    timePeriods = [
        { viewValue: 'All available data', value: 'max' },
        { viewValue: 'Five years', value: '5y' },
        { viewValue: 'Two years', value: '2y' },
        { viewValue: 'One year', value: '1y' },
        { viewValue: 'Year-to-date', value: 'ytd' },
        { viewValue: 'Six months', value: '6m' },
        { viewValue: 'Three months', value: '3m' },
        { viewValue: 'One month', value: '1m' }
    ];

    constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
        this.stockPickerForm = fb.group({
            symbol: [null, Validators.required],
            period: [null, Validators.required]
        });
    }

    ngOnInit() {
        this.symbolSub$ = this.stockPickerForm.get('symbol')
            .valueChanges.pipe(
                debounceTime(200),
            ).subscribe(() => this.fetchQuote());

        this.periodSub$ = this.stockPickerForm.get('period')
            .valueChanges.pipe(
                debounceTime(200),
            ).subscribe(() => this.fetchQuote());
    }

    ngOnDestroy() {
        this.symbolSub$.unsubscribe();
        this.periodSub$.unsubscribe();
    }

    fetchQuote() {
        if (this.stockPickerForm.valid) {
            const { symbol, period } = this.stockPickerForm.value;
            this.priceQuery.fetchQuote(symbol, period);
        }
    }
}
