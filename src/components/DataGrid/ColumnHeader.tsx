import type { Column } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Funnel } from 'lucide-react';

interface ColumnHeaderProps<TData> {
  column: Column<TData, unknown>;
  label: string;
  children: ReactNode;
  contentClassName?: string;
}

function ColumnHeader<TData>({
  column,
  label,
  children,
  contentClassName,
}: ColumnHeaderProps<TData>) {
  return (
    <div className='flex flex-row items-center'>
      <span className='me-2'>{label}</span>
      <Button
        size='icon-sm'
        variant='ghost'
        aria-label={`Sort by ${column.id}`}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <ArrowUpDown />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              size='icon-sm'
              variant='ghost'
              aria-label={`Filter by ${column.id}`}
            />
          }
        >
          <Funnel />
        </DropdownMenuTrigger>
        <DropdownMenuContent className={contentClassName}>
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ColumnHeader;
