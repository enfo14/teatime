import { createSelector } from '@ngrx/store';
import { TeaTimeState } from './tea.state';
import { AppState } from '../app.reducers';

const getState = (state: AppState) => state.teaTime;

export const selectTea = createSelector(getState, (state: TeaTimeState) => state.tea);
export const selectMakers = createSelector(getState, (state: TeaTimeState) => state.teaMakers);
export const selectHistory = createSelector(getState, (state: TeaTimeState) => state.history);
