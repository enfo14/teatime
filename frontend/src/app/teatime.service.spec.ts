import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import { TeaTimeService } from './teatime.service';
import { environment } from 'src/environments/environment';
import { Level, Tea, TeaMaker } from './teatime.models';
import { TeaState } from './store/tea.state';
import { TeaTimeActions } from './store/tea.actions';
import { map } from 'rxjs/operators';

const initialState: TeaState = {
  tea: null,
  teaMakers: [],
  history: [],
};

describe('TeaTimeService', () => {
  let store: MockStore<TeaState>;
  let service: TeaTimeService;
  let httpTestingController: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideMockStore({ initialState })],
    });
  }));

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(TeaTimeService);
    store = TestBed.get<Store<TeaState>>(Store);
    spyOn(store, 'dispatch');
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('handleError', () => {
    it('should be executed if an error occurs', () => {
      spyOn(service, 'handleError').and.callThrough();
      service.getCurrentTea().subscribe(
        data => fail('should have failed with the 500 error'),
        error => {
          expect(service.handleError).toHaveBeenCalled();
          expect(error).toEqual('Something bad happened; please try again later.');
        }
      );
      const req = httpTestingController.expectOne(
        req => req.url === new URL('tea/', environment.apiUrl).toString()
      );
      req.flush('Internal server error', { status: 500, statusText: 'INTERNAL SERVER ERROR'});
    });
  });

  describe('getCurrentTea', () => {
    it('gets the current tea round from the API', done => {
      service.getCurrentTea().subscribe(action => {
        expect(action).toEqual(TeaTimeActions.GetTeaRoundSuccess({ tea: [] }));
        done();
      })
      const req = httpTestingController.expectOne(
       req => req.url === new URL('tea/', environment.apiUrl).toString()
      );
      expect(req.request.method).toEqual('GET');
      req.flush([]);
    })
  })

  describe('requestTea', () => {
    let tea: Tea = {
      timestamp: new Date('2017-05-20T11:03:21Z'),
      made_by: { id: '1', first_name: 'James', last_name: 'Bond', level: 1},
      voided: false,
    }

    it('requests a new tea round from the API', done => {
      service.requestTea().subscribe(action => {
        expect(action).toEqual(TeaTimeActions.RequestTeaRoundSuccess({ tea }));
        done();
      })
      const req = httpTestingController.expectOne(
       req => req.url === new URL('tea/', environment.apiUrl).toString()
      );
      expect(req.request.method).toEqual('POST');
      req.flush(tea, { status: 201, statusText: 'Created' });
    });

    it('handles the validation error when tea has already been requested', done => {
      spyOn(service, 'handleError');
      service.requestTea().subscribe(action => {
        expect(action).toEqual(TeaTimeActions.GetTeaRound());
        expect(service.handleError).not.toHaveBeenCalled()
        done();
      })
      const req = httpTestingController.expectOne(
       req => req.url === new URL('tea/', environment.apiUrl).toString()
      )
      req.flush([], { status: 400 , statusText: 'Validation error' })
    });

    it('handles the error normally if it is not a validation error', done => {
      spyOn(service, 'handleError').and.callThrough();
      service.requestTea().subscribe(
        data => fail('should have failed with the 500 error'),
        error => {
          expect(service.handleError).toHaveBeenCalled();
          expect(error).toEqual('Something bad happened; please try again later.');
          done();
        }
      );
      const req = httpTestingController.expectOne(
        req => req.url === new URL('tea/', environment.apiUrl).toString()
      );
      req.flush([], { status: 500, statusText: 'Internal server error'})
    })
  });

  describe('voidTea', () => {
    it('voids the current tea round from the API', done => {
      service.voidTea().subscribe(action => {
        expect(action).toEqual(TeaTimeActions.VoidTeaRoundSuccess());
        done();
      })
      const req = httpTestingController.expectOne(
       req => req.url === new URL('tea/', environment.apiUrl).toString()
      );
      expect(req.request.method).toEqual('DELETE');
      req.flush([]);
    });
  });

  describe('voidTea', () => {
    it('voids the current tea round from the API', done => {
      service.voidTea().subscribe(action => {
        expect(action).toEqual(TeaTimeActions.VoidTeaRoundSuccess());
        done();
      })
      const req = httpTestingController.expectOne(
       req => req.url === new URL('tea/', environment.apiUrl).toString()
      );
      expect(req.request.method).toEqual('DELETE');
      req.flush([]);
    });
  });

  describe('getTeaMakers', () => {
    let makers = [
      { id: '1', first_name: 'James', last_name: 'Bond', level: 1 },
      { id: '2', first_name: 'Sherlock', last_name: 'Holmes', level: 2 },
      { id: '3', first_name: 'Jane', last_name: 'Marple', level: 3 }
    ]

    it('gets the list of tea makers from the API', done => {
      service.getTeaMakers().subscribe(action => {
        expect(action).toEqual(TeaTimeActions.GetTeaMakersSuccess({ makers }));
        done();
      })
      const req = httpTestingController.expectOne(
       req => req.url === new URL('members/', environment.apiUrl).toString()
      );
      expect(req.request.method).toEqual('GET');
      req.flush(makers);
    });
  });

  describe('createTeaMaker', () => {
    let maker: TeaMaker = { id: '4', first_name: 'Hercule', last_name: 'Poirot', level: 3 }

    it('adds a new tea maker to the API', done => {
      service.createTeaMaker(maker).subscribe(action => {
        expect(action).toEqual(TeaTimeActions.CreateTeaMakerSuccess());
        done();
      })
      const req = httpTestingController.expectOne(
       req => req.url === new URL('members/', environment.apiUrl).toString()
      );
      expect(req.request.method).toEqual('POST');
      req.flush({});
    });
  });

  describe('deleteTeaMaker', () => {
    it('deletes a tea maker from the API', done => {
      service.deleteTeaMaker({ id: '4' }).subscribe(action => {
        expect(action).toEqual(TeaTimeActions.DeleteTeaMakerSuccess());
        done();
      })
      const req = httpTestingController.expectOne(
       req => req.url === new URL('members/4/', environment.apiUrl).toString()
      );
      expect(req.request.method).toEqual('DELETE');
      req.flush({});
    });
  });

  describe('getTeaHistory', () => {
    let makers = [
      { id: '1', first_name: 'James', last_name: 'Bond', level: 1 },
      { id: '2', first_name: 'Sherlock', last_name: 'Holmes', level: 2 },
      { id: '3', first_name: 'Jane', last_name: 'Marple', level: 3 }
    ]

    let history = [
      { timestamp: new Date('2017-05-20T11:05:23Z'), made_by: makers[0], voided: false },
      { timestamp: new Date('2017-05-20T13:41:04Z'), made_by: makers[1], voided: false },
      { timestamp: new Date('2017-05-20T14:15:23Z'), made_by: makers[0], voided: true },
      { timestamp: new Date('2017-05-21T09:11:59Z'), made_by: makers[0], voided: false },
      { timestamp: new Date('2017-05-20T11:51:33Z'), made_by: makers[2], voided: false },
    ]

    it('gets the history of tea rounds from the API', done => {
      service.getTeaHistory().subscribe(action => {
        expect(action).toEqual(TeaTimeActions.GetTeaHistorySuccess({ history }));
        done();
      })
      const req = httpTestingController.expectOne(
       req => req.url === new URL('history/', environment.apiUrl).toString()
      );
      expect(req.request.method).toEqual('GET');
      req.flush(history);
    });
  });

});
