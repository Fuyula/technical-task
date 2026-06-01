import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SecurityEvent } from '@/types';
import type { FormValues } from '../Form/Form';
import Form from '../Form/Form';

interface EventFormModalProps {
  onSubmitEvent: (formValues: SecurityEvent) => void;
  onSave: (formValues: FormValues | undefined) => void;
  savedChanges?: FormValues;
  event?: SecurityEvent;
  open: boolean;
  onClose: () => void;
}

const EventFormModal = ({
  event,
  open,
  onClose,
  ...props
}: EventFormModalProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{event ? 'Edit event' : 'Add an event'}</DialogTitle>
          <DialogDescription>
            {event
              ? 'Update this event.'
              : 'Fill in this form to manually add a new event.'}
          </DialogDescription>
        </DialogHeader>
        <Form event={event ?? undefined} {...props} />
      </DialogContent>
    </Dialog>
  );
};

export default EventFormModal;
