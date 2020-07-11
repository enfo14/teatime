import { Tea, TeaMaker } from '../teatime.models';

export interface TeaState {
  tea: Tea;
  teaMakers: TeaMaker[];
  history: Tea[];
}

export const initialState: TeaState = {
  tea: null,
  teaMakers: [],
  history: [],
}
