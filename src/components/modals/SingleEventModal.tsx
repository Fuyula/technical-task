import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { TimelineItem } from '../Timeline/timelineTypes';

interface SingleEventModalProps {
  open: boolean;
  closeDialog: () => void;
  item: (TimelineItem & { description?: string }) | null;
}

const SingleEventModal = ({
  open,
  closeDialog,
  item,
}: SingleEventModalProps) => (
  <Dialog
    open={open}
    onOpenChange={(isOpen) => {
      if (!isOpen) closeDialog();
    }}
  >
    <DialogContent className='flex flex-col sm:max-w-md p-10 gap-4'>
      <DialogHeader className='min-w-0'>
        {item && new Date(item.date).toLocaleString('en-CA')}
        <DialogTitle className={'min-w-0 wrap-break-word line-clamp-3'}>
          {item?.label}
        </DialogTitle>
      </DialogHeader>
      {item?.extra}
      <DialogDescription>{item?.description}</DialogDescription>
    </DialogContent>
  </Dialog>
);

export default SingleEventModal;
