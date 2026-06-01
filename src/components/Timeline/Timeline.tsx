import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  TimelineGroupProps,
  TimelineItemProps,
  TimelineProps,
  TimelineItem as TimelineItemType,
} from './timelineTypes';
import {
  formatDayForReader,
  formatTimeForReader,
  groupBy,
  toLocalKey,
} from './timelineUtils';
import { Skeleton } from '@/components/ui/skeleton';

const SKELETON_ITEMS = 10;

const TimelineItem = ({
  item,
  isActive,
  currentRef,
  onSelect,
  groupIndex,
  itemIndex,
}: TimelineItemProps) => {
  return (
    <div
      id={item.id}
      role='option'
      aria-selected={isActive}
      ref={isActive ? currentRef : undefined}
      className={`flex flex-col lg:flex-row lg:items-center lg:gap-4 p-2 pb-0.5 mb-1 w-full hover:opacity-50 hover:cursor-pointer transition-all ${
        isActive ? 'border-b-3 border-zinc-600' : ''
      }`}
      aria-label={`${formatTimeForReader(item.date)}, ${item.label}`}
      onClick={() => onSelect(groupIndex, itemIndex, item)}
    >
      <div className='flex flex-row gap-4 shrink-0'>
        <span className='text-muted-foreground'>
          {new Date(item.date).toLocaleString('en-CA', {
            timeStyle: 'medium',
            hour12: false,
          })}
        </span>{' '}
        {item.extra}
      </div>
      <p
        className='font-semibold lg:font-normal truncate flex-1 min-w-0'
        title={item.label}
      >
        {item.label}
      </p>
    </div>
  );
};

const TimelineGroup = ({
  title,
  items,
  isActive,
  groupIndex,
  itemIndex,
  currentRef,
  groupPeriod,
  onSelect,
}: TimelineGroupProps) => {
  return (
    <div
      role='group'
      aria-labelledby={`group-${title}`}
      className='flex flex-row gap-2 w-full'
    >
      <div className='flex flex-col items-center' aria-hidden='true'>
        <div className='h-1.5 w-0.5 bg-olive-200' />
        <div className='rounded-full aspect-square w-3.5 border-2 border-primary' />
        <div className='h-full w-0.5 bg-olive-200' />
      </div>
      <div className='flex flex-col ps-2 pb-4 gap-1 flex-1 min-w-0'>
        <h3
          id={`group-${title}`}
          className='lg:text-lg text-primary font-bold underline underline-offset-8 decoration-3 pb-2 decoration-primary'
        >
          {groupPeriod === 'hour'
            ? formatDayForReader(title.slice(0, 10)) + `, ${title.slice(11)}:00`
            : formatDayForReader(title.slice(0, 10))}
        </h3>
        {items.map((item, index) => (
          <TimelineItem
            isActive={isActive && itemIndex === index}
            key={item.id}
            item={item}
            currentRef={currentRef}
            onSelect={onSelect}
            groupIndex={groupIndex}
            itemIndex={index}
          />
        ))}
      </div>
    </div>
  );
};

const Timeline = ({
  items,
  groupPeriod = 'day',
  size = '2xl',
  onSelect,
  listboxRef,
  loading,
}: TimelineProps) => {
  const currentRef = useRef<HTMLDivElement>(null);
  const [groupIndex, setGroupIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');

  const maxW = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  }[size];

  const groupedItems = useMemo(
    () =>
      groupBy(items, (item) => toLocalKey(item.date, groupPeriod), groupPeriod),
    [groupPeriod, items],
  );

  const flatEvents: [string, TimelineItemType[]][] = useMemo(() => {
    const sortedGroupedItems = [...groupedItems.entries()].sort(([a], [b]) =>
      b.localeCompare(a),
    );

    return sortedGroupedItems.map(([day, items]) => [
      day,
      [...items].sort((x, y) => y.date.localeCompare(x.date)),
    ]);
  }, [groupedItems]);

  const activeId: string = flatEvents[groupIndex]?.[1]?.[itemIndex]?.id;

  const handleSelect = (
    groupIdx: number,
    itemIdx: number,
    item: TimelineItemType,
  ) => {
    setGroupIndex(groupIdx);
    setItemIndex(itemIdx);
    listboxRef?.current?.focus();
    onSelect?.(item);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const currentGroup = flatEvents[groupIndex]?.[1] ?? [];

    switch (e.key) {
      case 'ArrowRight': {
        e.preventDefault();
        const next = Math.min(groupIndex + 1, groupedItems.size - 1);
        const [nextGroupDate, nextGroupItems] = flatEvents[next];
        setGroupIndex(next);
        setItemIndex(0);
        setAnnouncement(
          `${formatDayForReader(nextGroupDate)}, ${nextGroupItems.length} events`,
        );
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        const previous = Math.max(0, groupIndex - 1);
        const [previousGroupDate, previousGroupItems] = flatEvents[previous];
        setGroupIndex(previous);
        setItemIndex(0);
        setAnnouncement(
          `${formatDayForReader(previousGroupDate)}, ${previousGroupItems.length} events`,
        );
        break;
      }
      case 'ArrowDown':
        e.preventDefault();
        setItemIndex((index) => Math.min(index + 1, currentGroup.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setItemIndex((index) => Math.max(0, index - 1));
        break;
      case 'Enter':
      case ' ': {
        e.preventDefault();
        const item = flatEvents[groupIndex]?.[1]?.[itemIndex];
        if (item) onSelect?.(item);
        break;
      }

      case 'Home':
        e.preventDefault();
        setItemIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setItemIndex(currentGroup.length - 1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    currentRef.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
  }, [itemIndex, groupIndex]);

  return (
    <div className={`flex flex-row gap-2 w-full ${maxW}`}>
      <div aria-live='polite' className='sr-only'>
        {announcement}
      </div>
      {loading ? (
        <div
          aria-busy='true'
          aria-label='Loading timeline'
          className='flex flex-col w-full py-4 lg:p-4 gap-4'
        >
          {Array.from({ length: SKELETON_ITEMS }, (_, i) => (
            <div className='flex flex-row gap-2 w-full' key={`skeleton_${i}`}>
              <Skeleton className='h-6 w-1/5' />
              <Skeleton className='h-6 w-1/5' />
              <Skeleton className='h-6 w-full' />
            </div>
          ))}
        </div>
      ) : (
        <div
          role='listbox'
          ref={listboxRef}
          aria-label='Timeline'
          onKeyDown={onKeyDown}
          aria-activedescendant={activeId}
          className='py-4 lg:p-4 w-full'
          tabIndex={0}
        >
          {items.length > 0 ? (
            flatEvents.map(([key, values], groupIdx) => (
              <TimelineGroup
                isActive={groupIndex === groupIdx}
                groupIndex={groupIdx}
                itemIndex={itemIndex}
                key={key}
                title={key}
                items={values}
                currentRef={currentRef}
                groupPeriod={groupPeriod}
                onSelect={handleSelect}
              />
            ))
          ) : (
            <div>
              <p className='h-24 text-center'>No results.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Timeline;
