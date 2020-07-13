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

function createTeaMaker(state: TeaTimeState, { maker }: { maker: TeaMaker }) {
  return { ...state, teaMakers: [...state.teaMakers, maker ]}
}

function deleteTeaMaker(state: TeaTimeState, { id }: { id: string }) {
  let teaMakers: TeaMaker[] = state.teaMakers.filter(maker => maker.id !== id)
  return { ...state, teaMakers }
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
  on(TeaTimeActions.CreateTeaMakerSuccess, createTeaMaker),
  on(TeaTimeActions.DeleteTeaMakerSuccess, deleteTeaMaker),
  on(TeaTimeActions.GetTeaHistorySuccess, storeTeaHistory),
)
