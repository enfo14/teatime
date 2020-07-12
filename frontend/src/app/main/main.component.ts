import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { TeaTimeActions } from '../store/tea.actions';
import * as fromTeaTime from '../store/tea.selectors'
import { Tea } from '../teatime.models';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';
import { AppState } from '../app.reducers';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.styl']
})
export class MainComponent implements OnInit {
  tea$: Observable<Tea>;
  voidAction = TeaTimeActions.VoidTeaRound;
  @ViewChild('voidTea') voidTeaDialog: ConfirmationDialog;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(TeaTimeActions.GetTeaRound());
    this.tea$ = this.store.select(fromTeaTime.selectTea);
  }

  requestTea() {
    this.store.dispatch(TeaTimeActions.RequestTeaRound());
  }

  requestVoidTea() {
    this.voidTeaDialog.open()
  }
}
