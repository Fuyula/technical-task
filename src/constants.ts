import type { FormValues, TagColor } from './components';
import type { SecurityEventStatus } from './types';

export const DATAGRID_MAX_EVENTS = 500;
export const TIMELINE_MAX_EVENTS = 30;

export const NUMBER_OF_EVENTS = 500;
export const NUMBER_OF_DAYS = 30;

export const EventStatusColor: Record<SecurityEventStatus, TagColor> = {
  active: 'red',
  acknowledged: 'yellow',
  in_progress: 'blue',
  resolved: 'green',
  dismissed: 'gray',
};

export const EventStatusLabel: Record<SecurityEventStatus, string> = {
  active: 'Active',
  acknowledged: 'Acknowledged',
  in_progress: 'In progress',
  resolved: 'Resolved',
  dismissed: 'Dismissed',
};

// Form

export const TEXT_MIN_LENGTH = 3;
export const TEXT_MAX_LENGTH = 100;
export const TEXTAREA_MAX_LENGTH = 500;

export const FORM_RULES: Record<keyof FormValues, Record<string, unknown>> = {
  title: {
    required: { value: true, message: 'Title is required' },
    minLength: {
      value: TEXT_MIN_LENGTH,
      message: `Title must be at least ${TEXT_MIN_LENGTH} characters`,
    },
    maxLength: {
      value: TEXT_MAX_LENGTH,
      message: `Title must be at most ${TEXT_MAX_LENGTH} characters`,
    },
  },
  date: {
    required: { value: true, message: 'Date is required' },
    validate: (v: string) =>
      new Date(v) <= new Date() || 'Date cannot be in the future',
  },
  status: { required: { value: true, message: 'Status is required' } },
  description: {
    maxLength: {
      value: TEXTAREA_MAX_LENGTH,
      message: `Description must be at most ${TEXTAREA_MAX_LENGTH} characters`,
    },
  },
};
