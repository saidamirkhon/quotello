import {
  Action,
  createAction,
} from '@ngrx/store';

export function getNgrxNoopAction(): Action {
  return createAction('[Global] No op');
}
