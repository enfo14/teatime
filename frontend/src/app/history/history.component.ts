import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, forkJoin, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { AppState } from '../app.reducers';
import { TeaTimeActions } from '../store/tea.actions';
import * as fromTeaTime from '../store/tea.selectors'
import { TeaMaker, Level, Tea } from '../teatime.models';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.styl']
})
export class HistoryComponent implements OnInit {

  makers$: Observable<TeaMaker[]>;
  topMakers$: Observable<any[]>;
  history$: Observable<Tea[]>;
  lastWeek$: Observable<Tea[]>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(TeaTimeActions.GetTeaHistory());
    this.store.dispatch(TeaTimeActions.GetTeaMakers());
    this.history$ = this.store.select(fromTeaTime.selectHistory);
    this.makers$ = this.store.select(fromTeaTime.selectMakers);

    const timestamp: moment.Moment = moment()
      .subtract(7, 'days');

    this.lastWeek$ = this.history$.pipe(
      map(history => history.filter(tea => moment(tea.timestamp) > timestamp))
    )

    this.topMakers$ = combineLatest(this.history$, this.makers$, (history, makers) => {
      return makers.map(maker => ({
        ...maker,
        rounds: history.filter(tea => tea.made_by.id === maker.id)
      }))
        .sort((a, b) => b.rounds.length - a.rounds.length)
    });
  };
}
