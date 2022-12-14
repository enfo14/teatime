import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Tea, TeaMaker } from './teatime.models';
import { TeaTimeActions } from './store/tea.actions';
import { AlertService } from './alerts/alert.service';

@Injectable({
  providedIn: 'root',
})
export class TeaTimeService {
  constructor(private http: HttpClient, private alerts: AlertService) {
    this.handleError.bind(this.handleError);
  }

  handleError(error: HttpErrorResponse) {
    this.alerts.error(error.error.detail);
    console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    return throwError('Something bad happened; please try again later.');
  }

  getCurrentTea() {
    /*
     * Fetch current Tea round from API
     */
    const url: URL = new URL('tea/', environment.apiUrl);
    return this.http.get<Tea[]>(url.toString()).pipe(
      map(tea => {
        if (tea.length > 0) {
          return TeaTimeActions.GetTeaRoundSuccess({ tea: tea[0] })
        } else {
          return TeaTimeActions.GetTeaRoundSuccess({ tea: null })
        }
      }),
      catchError(this.handleError)
    );
  }

  requestTea() {
    /*
     * Request a new Tea round from API
     */
    const url: URL = new URL('tea/', environment.apiUrl);
    return this.http.post<Tea>(url.toString(), {}).pipe(
      map(tea => TeaTimeActions.RequestTeaRoundSuccess({ tea })),
      catchError(error => {
        if (error.status === 400) {
          // if the error status is 400 someone else has already requested tea
          this.alerts.error(error.error);
          return of(TeaTimeActions.GetTeaRound())
        } else {
          return this.handleError(error)
        }
      })
    );
  }

  voidTea() {
    /*
     * Void the current Tea round
     */
    const url: URL = new URL('tea/', environment.apiUrl);
    return this.http.delete(url.toString()).pipe(
      map(() => TeaTimeActions.VoidTeaRoundSuccess()),
      catchError(this.handleError)
    );
  }

  getTeaMakers() {
    /*
     * Fetch current members of the team
     */
    const url: URL = new URL('members/', environment.apiUrl);
    return this.http.get<TeaMaker[]>(url.toString()).pipe(
      map(makers => TeaTimeActions.GetTeaMakersSuccess({ makers })),
      catchError(this.handleError)
    );
  }

  createTeaMaker(data: Partial<TeaMaker>) {
    /*
     * Add a new member to the team
     */

    const url: URL = new URL('members/', environment.apiUrl);
    return this.http.post<TeaMaker>(url.toString(), data).pipe(
      map(maker => TeaTimeActions.CreateTeaMakerSuccess({ maker })),
      catchError(this.handleError)
    );
  }

  deleteTeaMaker({ id }: { id: string }) {
    /*
     * Deletes a member of the team
     */
    const url: URL = new URL(`members/${id}/`, environment.apiUrl);
    return this.http.delete(url.toString()).pipe(
      map(() => TeaTimeActions.DeleteTeaMakerSuccess({ id })),
      catchError(this.handleError)
    )
  }

  getTeaHistory() {
    /*
     * Get the historical record of Tea rounds
     */
    const url: URL = new URL('history/', environment.apiUrl);
    return this.http.get<Tea[]>(url.toString()).pipe(
      map(history => TeaTimeActions.GetTeaHistorySuccess({ history })),
      catchError(this.handleError)
    );
  }
}
