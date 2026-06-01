export type SecurityEventStatus =
  | 'active'
  | 'acknowledged'
  | 'in_progress'
  | 'resolved'
  | 'dismissed';

export interface SecurityEvent {
  id: string;
  title: string;
  date: string;
  status: SecurityEventStatus;
  description?: string;
}
