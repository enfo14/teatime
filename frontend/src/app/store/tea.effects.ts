import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';

import { TeaTimeActions } from './tea.actions';
import { TeaTimeService } from '../teatime.service'
import { Tea, TeaMaker } from '../teatime.models';

@Injectable()
export class TeaTimeEffects {
  constructor(private actions$: Actions, private backend: TeaTimeService) {}

  getTeaRound$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeaTimeActions.GetTeaRound),
      switchMap(() => this.backend.getCurrentTea())
    );
  })

  requestTeaRound$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeaTimeActions.RequestTeaRound),
      switchMap(() => this.backend.requestTea())
    )
  })

  voidTeaRound$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeaTimeActions.VoidTeaRound),
      switchMap(() => this.backend.voidTea())
    )
  })

  getTeaMakers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeaTimeActions.GetTeaMakers),
      switchMap(() => this.backend.getTeaMakers())
    )
  })

  createTeaMakers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeaTimeActions.CreateTeaMaker),
      switchMap(({ maker }) => this.backend.createTeaMaker(maker))
    )
  })

  deleteTeaMaker$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeaTimeActions.DeleteTeaMaker),
      switchMap(({ id }) => this.backend.deleteTeaMaker({ id }))
    )
  })

  getTeaHistory$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeaTimeActions.GetTeaHistory),
      switchMap(() => this.backend.getTeaHistory())
    )
  })
}
