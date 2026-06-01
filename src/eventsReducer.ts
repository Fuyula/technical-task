import { DATAGRID_MAX_EVENTS } from './constants';
import type { SecurityEvent } from './types';

type EventAction =
  | { type: 'add'; event: SecurityEvent }
  | { type: 'edit'; event: SecurityEvent }
  | { type: 'remove'; id: string };

export function eventsReducer(
  state: SecurityEvent[],
  action: EventAction,
): SecurityEvent[] {
  switch (action.type) {
    case 'add':
      return [action.event, ...state]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, DATAGRID_MAX_EVENTS);
    case 'edit':
      return state.map((e) => (e.id === action.event.id ? action.event : e));
    case 'remove':
      return state.filter((e) => e.id !== action.id);
    default:
      return state;
  }
}
