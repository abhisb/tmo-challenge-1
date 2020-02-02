import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'coding-challenge-stocks',
    templateUrl: './stocks.component.html',
    styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit, OnDestroy {
    stockPickerForm: FormGroup;
    quotes$ = this.priceQuery.priceQueries$;
    symbolSub$: Subscription;
    periodSub$: Subscription;
    maxDate = new Date();

    constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
        this.stockPickerForm = this.fb.group({
            symbol: [null, Validators.required],
            period: [null, Validators.required],
            periodFrom: [null],
            periodTo: [null]
        });
    }

    ngOnInit() {
        this.symbolSub$ = this.stockPickerForm.get('symbol')
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
            const { symbol, period, periodFrom, periodTo } = this.stockPickerForm.value;
            this.priceQuery.fetchQuoteByDate(symbol, periodFrom, periodTo);
        }
    }

    triggerDateChange() {
        const periodFrom = this.stockPickerForm.value.periodFrom;
        const periodTo = this.stockPickerForm.value.periodTo;
        if (periodFrom && periodTo && periodFrom > periodTo) {
          this.fetchQuote();
        }
    }

}
