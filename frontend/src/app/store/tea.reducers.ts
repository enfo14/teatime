import { createReducer, on } from '@ngrx/store';

import { Tea, TeaMaker } from '../teatime.models';
import { TeaTimeState, initialState } from './tea.state';
import { TeaTimeActions } from './tea.actions';


function storeCurrentTea(state: TeaTimeState, { tea }: { tea: Tea }) {
  return { ...state, tea }
}

function voidCurrentTea(state: TeaTimeState) {
  return { ...state, tea: null }
}

function storeTeaMakers(state: TeaTimeState, { makers }: { makers: TeaMaker[] }) {
  return { ...state, teaMakers: makers }
}

function storeTeaHistory(state: TeaTimeState, { history }: { history: Tea[] }) {
  return { ...state, history }
}

export const TeaTimeReducer = createReducer(
  initialState,
  on(TeaTimeActions.GetTeaRoundSuccess, storeCurrentTea),
  on(TeaTimeActions.RequestTeaRoundSuccess, storeCurrentTea),
  on(TeaTimeActions.VoidTeaRoundSuccess, voidCurrentTea),
  on(TeaTimeActions.GetTeaMakersSuccess, storeTeaMakers),
  on(TeaTimeActions.GetTeaHistorySuccess, storeTeaHistory),
)
