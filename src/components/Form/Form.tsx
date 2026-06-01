import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import type { SecurityEvent, SecurityEventStatus } from '@/types';
import {
  EventStatusLabel,
  FORM_RULES,
  TEXT_MAX_LENGTH,
  TEXT_MIN_LENGTH,
  TEXTAREA_MAX_LENGTH,
} from '@/constants';

const initialValues: FormValues = {
  title: '',
  date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  status: 'active',
  description: '',
};

const options = [
  { label: 'Active', value: 'active' },
  { label: 'Acknowledged', value: 'acknowledged' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Dismissed', value: 'dismissed' },
];

export interface FormValues {
  title: string;
  date: string;
  status: SecurityEventStatus;
  description?: string;
}

const Form = ({
  onSave,
  onSubmitEvent,
  savedChanges,
  event,
}: {
  onSubmitEvent: (formValues: SecurityEvent) => void;
  onSave: (formValues: FormValues | undefined) => void;
  savedChanges?: FormValues;
  event?: SecurityEvent;
}) => {
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const [submitted, setSubmitted] = useState(false);

  // eslint-disable-next-line react-hooks/incompatible-library
  const description = watch('description') ?? '';
  const title = watch('title') ?? '';

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmitEvent?.({
      ...data,
      id: event?.id ?? crypto.randomUUID(),
      date: new Date(data.date).toISOString(),
    });
    setSubmitted(true);
    reset();
  };

  useEffect(() => {
    if (event) {
      reset({
        ...event,
        date: format(new Date(event.date), "yyyy-MM-dd'T'HH:mm"),
      });
    } else {
      reset(savedChanges ?? initialValues);
    }
  }, [event, reset, savedChanges]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col items-baseline gap-4'
      >
        <Field>
          <FieldLabel htmlFor='title'>
            Title <span className='text-destructive'>*</span>
          </FieldLabel>
          <Controller
            name='title'
            control={control}
            rules={FORM_RULES.title}
            render={({ field }) => (
              <Input
                type='text'
                placeholder='Enter a title for the event'
                {...field}
                minLength={TEXT_MIN_LENGTH}
                maxLength={TEXT_MAX_LENGTH}
              />
            )}
          />
          <FieldDescription>
            <span className='flex justify-end w-full text-muted-foreground tabular-nums'>
              {title.length}/{TEXT_MAX_LENGTH}
            </span>
          </FieldDescription>
          <FieldError errors={[errors.title]} />
        </Field>
        <Field>
          <FieldLabel htmlFor='date'>
            Date <span className='text-destructive'>*</span>
          </FieldLabel>
          <Controller
            name='date'
            control={control}
            rules={FORM_RULES.date}
            render={({ field }) => (
              <Input
                type='datetime-local'
                max={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                {...field}
              />
            )}
          />
          <FieldError errors={[errors.date]} />
        </Field>
        <Field>
          <FieldLabel htmlFor='status'>
            Status <span className='text-destructive'>*</span>
          </FieldLabel>
          <Controller
            name='status'
            control={control}
            rules={FORM_RULES.status}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Status'>
                    {EventStatusLabel[field.value]}{' '}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {options.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor='description'>Description</FieldLabel>
          <Controller
            name='description'
            control={control}
            rules={FORM_RULES.description}
            render={({ field }) => (
              <Textarea
                placeholder='Write a description for the event here...'
                rows={4}
                maxLength={TEXTAREA_MAX_LENGTH}
                {...field}
              />
            )}
          />

          <FieldDescription>
            <span className='flex justify-end w-full text-muted-foreground tabular-nums'>
              {description.length}/{TEXTAREA_MAX_LENGTH}
            </span>
          </FieldDescription>
          <FieldError errors={[errors.description]} />
        </Field>
        <div className='flex flex-row justify-end gap-2 w-full'>
          {savedChanges && (
            <Button
              type='button'
              variant='secondary'
              onClick={() => {
                onSave(undefined);
                reset(initialValues);
              }}
            >
              Clear
            </Button>
          )}
          {!event && (
            <Button
              type='button'
              variant='secondary'
              onClick={() => onSave(getValues())}
            >
              Save draft
            </Button>
          )}
          <Button type='submit'>{event ? 'Save changes' : 'Add event'}</Button>
        </div>
      </form>
      {submitted && (
        <div
          role='status'
          className='flex flex-row items-center justify-center text-sm text-green-600'
        >
          {event ? 'Event updated successfully.' : 'Event added successfully.'}
        </div>
      )}
    </>
  );
};

export default Form;
