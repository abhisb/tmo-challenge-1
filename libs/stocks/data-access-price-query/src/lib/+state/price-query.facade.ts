import { Store, select } from '@ngrx/store';
import { getAllPriceQueries, getSelectedSymbol } from './price-query.selectors';
import { map, skip } from 'rxjs/operators';

import { FetchPriceQuery } from './price-query.actions';
import { Injectable } from '@angular/core';
import { PriceQueryPartialState } from './price-query.reducer';

@Injectable()
export class PriceQueryFacade {
  selectedSymbol$ = this.store.pipe(select(getSelectedSymbol));
  priceQueries$ = this.store.pipe(
    select(getAllPriceQueries),
    skip(1),
    map(priceQueries =>
      priceQueries.map(priceQuery => [priceQuery.date, priceQuery.close])
    )
  );

  constructor(private store: Store<PriceQueryPartialState>) {}

  fetchQuote(symbol: string, period: string) {
    this.store.dispatch(new FetchPriceQuery(symbol, period));
  }

  fetchQuoteByDate(symbol: string, periodFrom: Date, periodTo: Date) {
    this.store.dispatch(new FetchPriceQuery(symbol, 'max', periodFrom, periodTo));
  }

}
