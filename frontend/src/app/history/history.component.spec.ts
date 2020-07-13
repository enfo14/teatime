import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import { HistoryComponent } from './history.component';
import { AppState } from '../app.reducers';
import { initialState } from '../store/tea.state';
import { TeaMaker, Tea } from '../teatime.models';
import { TeaTimeActions } from '../store/tea.actions';
import * as fromTeaTime from '../store/tea.selectors';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let store: MockStore<AppState>;

  let makers: TeaMaker[] = [
    { id: '1', first_name: 'James', last_name: 'Bond', level: 1 },
    { id: '2', first_name: 'Sherlock', last_name: 'Holmes', level: 2 },
    { id: '3', first_name: 'Jane', last_name: 'Marple', level: 3 }
  ]

  let history: Tea[] = [
    { timestamp: new Date('2017-05-20T11:05:23Z'), made_by: makers[0], voided: false },
    { timestamp: new Date('2017-05-20T13:41:04Z'), made_by: makers[1], voided: false },
    { timestamp: new Date('2017-05-20T14:15:23Z'), made_by: makers[0], voided: true },
    { timestamp: new Date('2017-05-21T09:11:59Z'), made_by: makers[0], voided: false },
    { timestamp: new Date('2017-05-20T11:51:33Z'), made_by: makers[2], voided: false },
    { timestamp: new Date(), made_by: makers[1], voided: false }
  ]

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryComponent ],
      providers: [ provideMockStore({ initialState: { teaTime: initialState }})]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    store.overrideSelector(fromTeaTime.selectHistory, history);
    store.overrideSelector(fromTeaTime.selectMakers, makers);
    spyOn(store, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch the actions to get the data from the API', () => {
    expect(store.dispatch).toHaveBeenCalledTimes(2);
    expect(store.dispatch).toHaveBeenCalledWith(TeaTimeActions.GetTeaHistory());
    expect(store.dispatch).toHaveBeenCalledWith(TeaTimeActions.GetTeaMakers());
  });

  it('should get the history of tea rounds from the store', done => {
    component.history$.subscribe(hist => {
      expect(hist).toEqual(history);
      done();
    });
  });

  it('should get the list of tea makers from the store', done => {
    component.makers$.subscribe(teaMakers => {
      expect(teaMakers).toEqual(makers);
      done();
    });
  });

  it('should pipe the history data to get last week\'s rounds', done => {
    component.lastWeek$.subscribe(rounds => {
      expect(rounds.length).toEqual(1);
      done();
    });
  });

  it('should combine the makers and history data to get the top makers', done => {
    component.topMakers$.subscribe(topMakers => {
      expect(topMakers[0].id).toEqual(makers[0]);
      expect(topMakers[0].rounds.length).toEqual(3);
      done();
    });
  });
});
