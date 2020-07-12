import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ConfirmationDialog } from './confirmation-dialog.component';
import { AppState } from '../app.reducers';
import { initialState } from '../store/tea.state';
import { Store } from '@ngrx/store';
import { TeaTimeActions } from '../store/tea.actions';

describe('ConfirmationDialog', () => {
  let component: ConfirmationDialog;
  let fixture: ComponentFixture<ConfirmationDialog>;
  let store: MockStore<AppState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationDialog ],
      providers: [provideMockStore({ initialState: { teaTime: initialState } })]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDialog);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('open', () => {
    it('sets the \'active\' attribute to true', () => {
      expect(component.active).toBeFalse();
      component.open();
      expect(component.active).toBeTrue();
    });
  });

  describe('close', () => {
    beforeEach(() => {
      component.active = true;
    });

    it('sets the \'active\' attribute to false', () => {
      expect(component.active).toBeTrue();
      component.close();
      expect(component.active).toBeFalse();
    });
  });

  describe('onYesClick', () => {
    beforeEach(() => {
      component.action = TeaTimeActions.VoidTeaRound;
      spyOn(component, 'close').and.callThrough();
    });

    it('should dispatch the action that has been passed as input', () => {
      component.onYesClick();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(TeaTimeActions.VoidTeaRound())
    });

    it('should close the dialog', () => {
      component.onYesClick();
      expect(component.close).toHaveBeenCalled();
    });
  });

  describe('onNoClick', () => {
    beforeEach(() => {
      component.action = TeaTimeActions.VoidTeaRound;
      spyOn(component, 'close').and.callThrough();
    });

    it('should not dispatch any action', () => {
      component.onNoClick();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should close the dialog', () => {
      component.onNoClick();
      expect(component.close).toHaveBeenCalled();
    });
  });
});
