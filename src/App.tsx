import {
  ColumnHeader,
  EventFormModal,
  SingleEventModal,
  Tag,
  Timeline,
  type FormValues,
} from './components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import DataGrid from './components/DataGrid/DataGrid';
import { Eye, Pen, Plus, Trash } from 'lucide-react';
import type { SecurityEvent, SecurityEventStatus } from './types';
import type { TimelineItem } from './components/Timeline/timelineTypes';
import { ButtonGroup } from '@/components/ui/button-group';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { generateEvents } from './mockEvents';
import { eventsReducer } from './eventsReducer';
import {
  EventStatusColor,
  EventStatusLabel,
  NUMBER_OF_DAYS,
  NUMBER_OF_EVENTS,
  TIMELINE_MAX_EVENTS,
} from './constants';

const generatedEvents = generateEvents(NUMBER_OF_EVENTS, NUMBER_OF_DAYS);

function App() {
  const listboxRef = useRef<HTMLDivElement>(null);
  const [events, dispatch] = useReducer(eventsReducer, generatedEvents);
  const [openItem, setOpenItem] = useState<TimelineItem | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SecurityEvent>();
  const [timelineGroupBy, setTimelineGroupBy] = useState<'day' | 'hour'>('day');
  const [isLoading, setIsLoading] = useState(true);
  const [formValues, setFormValues] = useState<FormValues>();

  const closeDialog = () => {
    setOpenItem(null);
    listboxRef.current?.focus();
  };

  const closeFormModal = () => {
    setFormModalOpen(false);
    setEditingItem(undefined);
  };

  const columns: ColumnDef<SecurityEvent, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        filterFn: 'includesString',
        header: ({ column }) => {
          return (
            <ColumnHeader column={column} label='Title'>
              <Input
                placeholder='Filter by title...'
                value={(column.getFilterValue() as string) ?? ''}
                onChange={(e) => column.setFilterValue(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </ColumnHeader>
          );
        },
        cell: ({ row }) => (
          <div>
            {((row.getValue('title') as string)?.length ?? 0) > 50
              ? (row.getValue('title') as string).slice(0, 50) + '…'
              : row.getValue('title')}
          </div>
        ),
      },
      {
        accessorKey: 'date',
        filterFn: (row, columnId, filterValue) => {
          const date = new Date(row.getValue(columnId));
          const [from, to] = filterValue;
          if (from && date < new Date(from)) return false;
          if (to && date > new Date(to)) return false;
          return true;
        },
        header: ({ column }) => {
          return (
            <ColumnHeader column={column} label='Date' contentClassName='p-5'>
              <Field className='mb-4'>
                <FieldLabel htmlFor='from'>From</FieldLabel>
                <Input
                  placeholder='From'
                  type='datetime-local'
                  value={
                    (column.getFilterValue() as [string, string])?.[0] ?? ''
                  }
                  onChange={(e) =>
                    column.setFilterValue([
                      e.target.value,
                      (column.getFilterValue() as [string, string])?.[1] ?? '',
                    ])
                  }
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor='to'>To</FieldLabel>
                <Input
                  placeholder='To'
                  type='datetime-local'
                  value={
                    (column.getFilterValue() as [string, string])?.[1] ?? ''
                  }
                  onChange={(e) =>
                    column.setFilterValue([
                      (column.getFilterValue() as [string, string])?.[0] ?? '',
                      e.target.value,
                    ])
                  }
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                />{' '}
              </Field>
            </ColumnHeader>
          );
        },
        cell: ({ row }) => {
          const date = new Date(row.getValue('date'));

          return date.toLocaleString();
        },
      },
      {
        accessorKey: 'status',
        filterFn: 'includesString',
        header: ({ column }) => {
          return (
            <ColumnHeader column={column} label='Status'>
              <Input
                placeholder='Filter by status...'
                value={(column.getFilterValue() as string) ?? ''}
                onChange={(e) => column.setFilterValue(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </ColumnHeader>
          );
        },
        cell: ({ row }) => {
          const status: SecurityEventStatus = row.getValue('status');

          return (
            <Tag
              color={EventStatusColor[status]}
              label={EventStatusLabel[status]}
            />
          );
        },
      },
      {
        accessorKey: 'id',
        header: 'Actions',
        cell: ({ row }) => {
          const status: SecurityEventStatus = row.getValue('status');
          const id: string = row.getValue('id');

          return (
            <ButtonGroup>
              <Button
                variant='ghost'
                size='icon-sm'
                aria-label='View event'
                onClick={() =>
                  setOpenItem({
                    ...row.original,
                    label: row.original.title,
                    extra: (
                      <Tag
                        color={EventStatusColor[status]}
                        label={EventStatusLabel[status]}
                      />
                    ),
                  })
                }
              >
                <Eye />
              </Button>
              <Button
                variant='ghost'
                size='icon-sm'
                aria-label='Edit event'
                onClick={() => {
                  setEditingItem(row.original);
                  setFormModalOpen(true);
                }}
              >
                <Pen />
              </Button>
              <Button
                variant='ghost'
                size='icon-sm'
                aria-label='Delete event'
                onClick={() => dispatch({ type: 'remove', id })}
              >
                <Trash className='text-destructive' />
              </Button>
            </ButtonGroup>
          );
        },
      },
    ],
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      <section className='flex flex-row justify-between align-center p-4'>
        <h1 className='text-lg md:text-2xl font-bold'>Security events</h1>
        {openItem && (
          <SingleEventModal
            open={openItem !== null}
            closeDialog={closeDialog}
            item={openItem}
          />
        )}
        <Button
          onClick={() => {
            setFormModalOpen(true);
          }}
        >
          <Plus />
          Add event
        </Button>
        <EventFormModal
          open={formModalOpen}
          onClose={closeFormModal}
          onSubmitEvent={(event) =>
            dispatch(
              editingItem ? { type: 'edit', event } : { type: 'add', event },
            )
          }
          onSave={setFormValues}
          savedChanges={formValues}
          event={editingItem}
        />
      </section>
      <hr />
      <section className='flex flex-col lg:flex-row justify-center p-4 lg:p-8 gap-8 w-full'>
        <div className='flex flex-col flex-1 gap-2'>
          <h2 className='text-md md:text-xl text-secondary-foreground font-extralight'>
            Data grid
          </h2>
          <p className='text-secondary-foreground text-sm'>
            Here you can find a table with recent events. You may show/hide
            columns, sort/filter by column values, or move between pages. You
            may also view, edit or delete an event.
          </p>
          <DataGrid loading={isLoading} data={events} columns={columns} />
        </div>
        <div className='flex flex-col flex-1 gap-2'>
          <h2 className='text-md md:text-xl text-secondary-foreground font-extralight'>
            Timeline
          </h2>
          <p className='text-secondary-foreground text-sm'>
            Here you can find the {TIMELINE_MAX_EVENTS} most recent events,
            sorted chronologically from newest to oldest. Click on an event to
            view it, or navigate by using the arrow and Enter keys.
          </p>
          <ButtonGroup className='w-full flex flex-row'>
            <Button
              onClick={() => setTimelineGroupBy('day')}
              variant={timelineGroupBy === 'day' ? 'default' : 'secondary'}
            >
              Day
            </Button>
            <Button
              onClick={() => setTimelineGroupBy('hour')}
              variant={timelineGroupBy === 'hour' ? 'default' : 'secondary'}
            >
              Hour
            </Button>
          </ButtonGroup>
          <Timeline
            loading={isLoading}
            onSelect={setOpenItem}
            groupPeriod={timelineGroupBy}
            listboxRef={listboxRef}
            items={events.slice(0, TIMELINE_MAX_EVENTS).map((event) => ({
              ...event,
              label: event.title,
              extra: (
                <Tag
                  color={EventStatusColor[event.status]}
                  label={EventStatusLabel[event.status]}
                />
              ),
            }))}
          />
        </div>
      </section>
    </main>
  );
}

export default App;
