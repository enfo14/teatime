import { ActionReducer, MetaReducer } from '@ngrx/store';

import { environment } from 'src/environments/environment';
import { TeaTimeState } from './store/tea.state';

export interface AppState {
  teaTime: TeaTimeState,
}

export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();
    return result;
  };
}

export const metaReducers: MetaReducer<any>[] = !environment.production ? [logger] : [];
