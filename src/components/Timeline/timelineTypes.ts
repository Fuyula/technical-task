import type { ReactNode } from 'react';

export interface TimelineItem {
  id: string;
  label: string;
  date: string;
  extra?: ReactNode;
}
export interface TimelineGroupProps {
  title: string;
  items: TimelineItem[];
  isActive: boolean;
  itemIndex: number;
  groupIndex: number;
  currentRef: React.RefObject<HTMLDivElement | null>;
  groupPeriod: 'day' | 'hour';
  onSelect: (groupIdx: number, itemIdx: number, item: TimelineItem) => void;
}

export interface TimelineItemProps {
  item: TimelineItem;
  isActive: boolean;
  itemIndex: number;
  groupIndex: number;
  currentRef: React.RefObject<HTMLDivElement | null>;
  onSelect: (groupIdx: number, itemIdx: number, item: TimelineItem) => void;
}

export interface TimelineProps {
  items: TimelineItem[];
  groupPeriod?: 'day' | 'hour';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  onSelect: (item: TimelineItem) => void;
  listboxRef?: React.RefObject<HTMLDivElement | null>;

  loading?: boolean;
}
