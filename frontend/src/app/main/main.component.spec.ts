import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import { MainComponent } from './main.component';
import { TeaTimeActions } from '../store/tea.actions';
import * as fromTeaTime from '../store/tea.selectors';
import { initialState } from '../store/tea.state';
import { Tea } from '../teatime.models';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';
import { AppState } from '../app.reducers';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let store: MockStore<AppState>;

  let tea: Tea = {
    timestamp: new Date('2017-05-20T11:03:21Z'),
    made_by: { id: '1', first_name: 'James', last_name: 'Bond', level: 1},
    voided: false,
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainComponent, ConfirmationDialog ],
      providers: [provideMockStore({ initialState: { teaTime: initialState } })]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
    store.overrideSelector(fromTeaTime.selectTea, tea);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('dispatches the action to get the current tea state', () => {
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(TeaTimeActions.GetTeaRound());
    });

    it('gets the current tea state from the store', done => {
      component.tea$.subscribe(t => {
        expect(t).toEqual(tea);
        done();
      });
    });
  });

  describe('requestTea', () => {
    beforeEach(() => {
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(TeaTimeActions.GetTeaRound());
      component.requestTea();
    });

    it('dispatches the action to request a new tea round', () => {
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenCalledWith(TeaTimeActions.RequestTeaRound());
    });
  });

  describe('requestVoidTea', () => {
    beforeEach(() => {
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(TeaTimeActions.GetTeaRound());
      spyOn(component.voidTeaDialog, "open");
      component.requestVoidTea()
    });

    it('opens the confirmation dialog to void the current tea round', () => {
      expect(component.voidTeaDialog.open).toHaveBeenCalledTimes(1)
    });
  });
});
