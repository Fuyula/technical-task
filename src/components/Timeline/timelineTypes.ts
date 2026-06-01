export interface TimelineItem {
  id: string;
  label: string;
  date: string;
}
export interface TimelineGroupProps {
  title: string;
  items: TimelineItem[];
  isActive: boolean;
  itemIndex: number;
  groupIndex: number;
  groupPeriod: 'day' | 'hour';
}

export interface TimelineItemProps {
  item: TimelineItem;
  isActive: boolean;
}

export interface TimelineProps {
  items: TimelineItem[];
  groupPeriod?: 'day' | 'hour';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  loading?: boolean;
}
