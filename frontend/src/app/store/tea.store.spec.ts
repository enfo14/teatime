/*
 * Tests for all things related to state management
 */

import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import { environment } from 'src/environments/environment';
import { Tea, TeaMaker } from '../teatime.models';
import { TeaTimeActions } from './tea.actions';
import * as fromTeaTime from './tea.selectors'
import { TeaTimeState } from './tea.state';
import { AppState } from '../app.reducers';

const teaMakers: TeaMaker[] = [
  { id: '1', first_name: 'James', last_name: 'Bond', level: 1 },
  { id: '2', first_name: 'Sherlock', last_name: 'Holmes', level: 2 },
  { id: '3', first_name: 'Jane', last_name: 'Marple', level: 3 }
]

const history: Tea[] = [
  { timestamp: new Date('2017-05-20T11:05:23Z'), made_by: teaMakers[0], voided: false },
  { timestamp: new Date('2017-05-20T13:41:04Z'), made_by: teaMakers[1], voided: false },
  { timestamp: new Date('2017-05-20T14:15:23Z'), made_by: teaMakers[0], voided: true },
  { timestamp: new Date('2017-05-21T09:11:59Z'), made_by: teaMakers[0], voided: false },
  { timestamp: new Date('2017-05-20T11:51:33Z'), made_by: teaMakers[2], voided: false },
]

const initialState: TeaTimeState = {
  tea: null,
  teaMakers,
  history,
};

describe('fromTeaTime selectors', () => {
  let store: MockStore<AppState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: { teaTime: initialState }})],
    });
  }));

  beforeEach(() => {
    store = TestBed.get<Store<AppState>>(Store);
    spyOn(store, 'dispatch');
  });

  describe('selectTea', () => {
    it('should return the current tea round if there is one', done => {
      store.select(fromTeaTime.selectTea).subscribe(tea => {
        expect(tea).toBeNull();
        done();
      });
    });
  });

  describe('selectMakers', () => {
    it('should return the list of makers from the store', done => {
      store.select(fromTeaTime.selectMakers).subscribe(makers => {
        expect(makers).toEqual(teaMakers);
        done();
      });
    });
  });

  describe('selectHistory', () => {
    it('should return the history of tea rounds from the store', done => {
      store.select(fromTeaTime.selectHistory).subscribe(hist => {
        expect(hist).toEqual(history);
        done();
      })
    })
  })
});
