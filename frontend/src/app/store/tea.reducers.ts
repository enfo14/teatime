import { createReducer, on } from '@ngrx/store';

import { Tea, TeaMaker } from '../teatime.models';
import { TeaState, initialState } from './tea.state';
import { TeaTimeActions } from './tea.actions';


function storeCurrentTea(state: TeaState, { tea }: { tea: Tea[] }) {
  if (tea.length > 0) {
    return { ...state, tea: tea[0] }
  } else {
    return { ...state, tea: null }
  }
}

function voidCurrentTea(state: TeaState) {
  return { ...state, tea: null }
}

function storeTeaMakers(state: TeaState, { makers }: { makers: TeaMaker[] }) {
  return { ...state, teaMakers: makers }
}

function storeTeaHistory(state: TeaState, { history }: { history: Tea[] }) {
  return { ...state, history }
}

export const TeaTimeReducer = createReducer(
  initialState,
  on(TeaTimeActions.GetTeaRoundSuccess, storeCurrentTea),
  on(TeaTimeActions.VoidTeaRoundSuccess, voidCurrentTea),
  on(TeaTimeActions.GetTeaMakersSuccess, storeTeaMakers),
  on(TeaTimeActions.GetTeaHistorySuccess, storeTeaHistory),
)
