import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import { AppState } from '../app.reducers';
import { TeaTimeActions } from '../store/tea.actions';
import * as fromTeaTime from '../store/tea.selectors';
import { initialState } from '../store/tea.state';
import { Level, TeaMaker } from '../teatime.models';

import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';
import { MakerLevelPipe } from '../maker-level.pipe';
import { MakersComponent, SingleTeaMaker } from './makers.component';

describe('SingleTeaMaker', () => {
  let component: SingleTeaMaker;
  let fixture: ComponentFixture<SingleTeaMaker>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleTeaMaker, ConfirmationDialog, MakerLevelPipe ],
      providers: [ provideMockStore({ initialState: { teaTime: initialState }})]
    })
    .compileComponents()
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleTeaMaker);
    component = fixture.componentInstance;
    component.maker = { id: '4', first_name: 'James', last_name: 'Bond', level: Level.Mid}
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteMaker', () => {
    beforeEach(() => {
      component.deleteMaker();
    })

    it('should set the DeleteTeaMaker action with the correct id', () => {
      expect(component.action).toEqual(TeaTimeActions.DeleteTeaMaker({ id: '4' }))
    })

    it('should open the confirmation dialog', () => {
      expect(component.confirmationDialog.active).toBeTrue();
    })
  });
})

describe('MakersComponent', () => {
  let component: MakersComponent;
  let fixture: ComponentFixture<MakersComponent>;
  let store: MockStore<AppState>;

  let makers: TeaMaker[] = [
    { id: '1', first_name: 'James', last_name: 'Bond', level: 1 },
    { id: '2', first_name: 'Sherlock', last_name: 'Holmes', level: 2 },
    { id: '3', first_name: 'Jane', last_name: 'Marple', level: 3 }
  ]

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakersComponent, SingleTeaMaker, ConfirmationDialog, MakerLevelPipe ],
      providers: [ provideMockStore({ initialState: { teaTime: initialState }}), FormBuilder]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakersComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    store.overrideSelector(fromTeaTime.selectMakers, makers);
    spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch the action to get the tea makers', () => {
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(TeaTimeActions.GetTeaMakers())
  });

  it('should get the tea makers from the store', done => {
    component.makers$.subscribe(teaMakers => {
      expect(teaMakers).toEqual(makers);
      done();
    });
  });

  it('should parse the Level enum to use in the form', () => {
    let levelOptions = [
      { label: 'Junior', value: 1 },
      { label: 'Mid', value: 2 },
      { label: 'Senior', value: 3 },
    ];
    expect(component.levelOptions).toEqual(levelOptions);
  });

  it('should create the form', () => {
    expect(component.createForm).toBeTruthy();
  });

  describe('openForm', () => {
    it('should set the \'formActive\' attribute to true', () => {
      component.openForm();
      expect(component.formActive).toBeTrue();
    });
  });

  describe('closeForm', () => {
    it('should set the \'formActive\' attribute to false', () => {
      component.closeForm();
      expect(component.formActive).toBeFalse();
    });
  });

  describe('resetForm', () => {
    it('should reset the form', () => {
      spyOn(component.createForm, 'reset').and.callThrough();
      component.resetForm();
      expect(component.createForm.reset).toHaveBeenCalled();
    });

    it('should close the form', () => {
      component.resetForm();
      expect(component.formActive).toBeFalse();
    });
  });

  describe('onSubmit', () => {
    let teaMaker = { first_name: 'Jane', last_name: 'Marple', level: Level.Senior }

    beforeEach(() => {
      component.createForm.setValue(teaMaker)
    });

    it('should dispatch the CreateTeaMaker action with the form value', () => {
      component.onSubmit();
      expect(store.dispatch).toHaveBeenCalledWith(TeaTimeActions.CreateTeaMaker({ maker: teaMaker }));
    });

    it('should reset the form', () => {
      spyOn(component, 'resetForm').and.callThrough();
      component.onSubmit();
      expect(component.resetForm).toHaveBeenCalled();
    })
  })
});
