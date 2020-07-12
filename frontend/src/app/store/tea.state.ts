import { Tea, TeaMaker } from '../teatime.models';

export interface TeaTimeState {
  tea: Tea;
  teaMakers: TeaMaker[];
  history: Tea[];
}

export const initialState: TeaTimeState = {
  tea: null,
  teaMakers: [],
  history: [],
}
