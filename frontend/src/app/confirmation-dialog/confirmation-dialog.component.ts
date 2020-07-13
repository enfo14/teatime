import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducers';

@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.styl']
})
export class ConfirmationDialog implements OnInit {

  @Input() action;
  @Input() description;
  active: boolean = false;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }

  open() {
    this.active = true;
  }

  close() {
    this.active = false;
  }

  onYesClick() {
    this.store.dispatch(this.action);
    this.close()
  }

  onNoClick() {
    this.close()
  }
}
