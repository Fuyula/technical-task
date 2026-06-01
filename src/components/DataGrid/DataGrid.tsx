import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { Eye } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

const DataGrid = <TData, TValue>({
  columns,
  data,
  pageSize = 10,
  loading = false,
  error,
  onRetry,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  });

  const { pageIndex } = table.getState().pagination;
  const total = data.length;
  const filtered = table.getFilteredRowModel().rows.length;
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, filtered);

  const visibleColumns = table.getVisibleLeafColumns();
  const noVisibleColumns = visibleColumns.length === 0;

  return (
    <div>
      <div className='flex items-center py-4'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant='outline' className='ml-auto'>
              <Eye /> Show/hide columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='overflow-hidden rounded-md border' aria-busy={loading}>
        <Table>
          {noVisibleColumns ? (
            <TableBody>
              <TableRow>
                <TableCell className='text-center'>
                  No results match your search.
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className='bg-primary text-olive-50'
                        >
                          {loading ? (
                            <Skeleton className='h-4 w-full opacity-20' />
                          ) : header.isPlaceholder ? null : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              {loading ? (
                <TableBody>
                  {Array.from({ length: pageSize }).map((_, index) => (
                    <TableRow
                      className='hover:bg-transparent cursor-default'
                      key={index}
                    >
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => (
                          <TableCell key={column.id}>
                            <Skeleton className='h-4 w-full' />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))}
                </TableBody>
              ) : error ? (
                <TableRow className='hover:bg-transparent'>
                  <TableCell
                    colSpan={visibleColumns.length || 1}
                    className='h-24 text-center'
                  >
                    <div
                      role='alert'
                      className='flex flex-col items-center gap-2 text-destructive'
                    >
                      <p>Something went wrong loading the data.</p>
                      <p className='text-muted-foreground'>{error.message}</p>
                      {onRetry && (
                        <Button variant='outline' onClick={onRetry}>
                          Retry
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length || 1}
                        className='h-24 text-center'
                      >
                        {total !== filtered
                          ? 'No results match your search.'
                          : 'No results.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </>
          )}
        </Table>
      </div>
      {!error && !noVisibleColumns && (
        <div className='flex flex-row items-center justify-between py-4'>
          {loading ? (
            <Skeleton className='h-4 w-xs' />
          ) : (
            <div className='flex flex-row flex-1 gap-2'>
              <span className='text-sm'>
                Page {pageIndex + 1} of {table.getPageCount()}
              </span>
              <div className='text-sm text-muted-foreground'>
                Showing {from}–{to} of {filtered}
              </div>
            </div>
          )}
          {loading ? (
            <Skeleton className='h-4 w-md' />
          ) : (
            <Pagination className='flex-2'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#'
                    onClick={() =>
                      table.getCanPreviousPage() && table.previousPage()
                    }
                    aria-disabled={!table.getCanPreviousPage()}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href='#'
                    onClick={() => table.getCanNextPage() && table.nextPage()}
                    aria-disabled={!table.getCanNextPage()}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
};

export default DataGrid;
