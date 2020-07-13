import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Store, Action } from '@ngrx/store';

import { AppState } from '../app.reducers';
import { TeaTimeActions } from '../store/tea.actions';
import * as fromTeaTime from '../store/tea.selectors'
import { Observable } from 'rxjs';
import { TeaMaker, Level } from '../teatime.models';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tea-maker',
  templateUrl: './tea-maker.component.html',
  styleUrls: ['./tea-maker.component.styl'],
})
export class SingleTeaMaker {

  @Input() maker: TeaMaker;
  @ViewChild('confirmation') confirmationDialog: ConfirmationDialog;
  action: Action;

  constructor() { }

  deleteMaker() {
    this.action = TeaTimeActions.DeleteTeaMaker({ id: this.maker.id })
    this.confirmationDialog.open()
  }
}

@Component({
  selector: 'app-makers',
  templateUrl: './makers.component.html',
  styleUrls: ['./makers.component.styl']
})
export class MakersComponent implements OnInit {

  makers$: Observable<TeaMaker[]>;

  levelOptions: any;
  createForm: FormGroup;
  formActive: boolean = false;

  constructor(private store: Store<AppState>, private fb: FormBuilder) { }

  ngOnInit() {
    this.store.dispatch(TeaTimeActions.GetTeaMakers());
    this.makers$ = this.store.select(fromTeaTime.selectMakers);

    this.levelOptions = Object.keys(Level)
      .filter(key => !isNaN(Number(Level[key])))
      .map(key => ({ value: Level[key], label: key }))

    this.createForm = this.fb.group({
      first_name: this.fb.control('', Validators.required),
      last_name: this.fb.control('', Validators.required),
      level: this.fb.control(null, Validators.required),
    })
  };

  openForm() {
    this.formActive = true;
  }

  closeForm() {
    this.formActive = false;
  }

  resetForm() {
    this.createForm.reset();
    this.closeForm();
  }

  onSubmit() {
    this.store.dispatch(TeaTimeActions.CreateTeaMaker({ maker: this.createForm.value }))
    this.resetForm();
  }
}
