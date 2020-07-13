import { createAction, props } from '@ngrx/store';
import { Tea, TeaMaker } from '../teatime.models'

enum Actions {
  GetTeaRound = 'Get Current Tea Round',
  GetTeaRoundSuccess = 'Got Current Tea Round',
  RequestTeaRound = 'Request New Tea Round',
  RequestTeaRoundSuccess = 'Requested New Tea Round',
  VoidTeaRound = 'Void Tea Round',
  VoidTeaRoundSuccess = 'Voided Tea Round',
  GetTeaMakers = 'Get Tea Makers',
  GetTeaMakersSuccess = 'Got Tea Makers',
  CreateTeaMaker = 'Create Tea Maker',
  CreateTeaMakerSuccess = 'Created Tea Maker',
  DeleteTeaMaker = 'Delete Tea Maker',
  DeleteTeaMakerSuccess = 'Deleted Tea Maker',
  GetTeaHistory = 'Get Tea History',
  GetTeaHistorySuccess = 'Get Tea History Success',
}

const GetTeaRound = createAction(Actions.GetTeaRound);
const GetTeaRoundSuccess = createAction(Actions.GetTeaRoundSuccess, props<{ tea: Tea }>());

const RequestTeaRound = createAction(Actions.RequestTeaRound);
const RequestTeaRoundSuccess = createAction(Actions.RequestTeaRoundSuccess, props<{ tea: Tea }>());

const VoidTeaRound = createAction(Actions.VoidTeaRound);
const VoidTeaRoundSuccess = createAction(Actions.VoidTeaRoundSuccess);

const GetTeaMakers = createAction(Actions.GetTeaMakers);
const GetTeaMakersSuccess = createAction(Actions.GetTeaMakersSuccess, props<{ makers: TeaMaker[] }>());

const CreateTeaMaker = createAction(Actions.CreateTeaMaker, props<{ maker: Partial<TeaMaker> }>());
const CreateTeaMakerSuccess = createAction(Actions.CreateTeaMakerSuccess, props<{ maker: TeaMaker }>());

const DeleteTeaMaker = createAction(Actions.DeleteTeaMaker, props<{ id: string }>());
const DeleteTeaMakerSuccess = createAction(Actions.DeleteTeaMakerSuccess, props<{ id: string }>());

const GetTeaHistory = createAction(Actions.GetTeaHistory);
const GetTeaHistorySuccess = createAction(Actions.GetTeaHistorySuccess, props<{ history: Tea[] }>());

export const TeaTimeActions = {
  GetTeaRound,
  GetTeaRoundSuccess,
  RequestTeaRound,
  RequestTeaRoundSuccess,
  VoidTeaRound,
  VoidTeaRoundSuccess,
  GetTeaMakers,
  GetTeaMakersSuccess,
  CreateTeaMaker,
  CreateTeaMakerSuccess,
  DeleteTeaMaker,
  DeleteTeaMakerSuccess,
  GetTeaHistory,
  GetTeaHistorySuccess,
}
