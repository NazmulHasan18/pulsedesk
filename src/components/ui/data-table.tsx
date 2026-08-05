"use client";

import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * DataTable
 * ---------
 * A single reusable table primitive for PulseDesk admin/agent surfaces,
 * built on shadcn's <Table> so it stays visually and structurally
 * consistent with the rest of the component library.
 *
 * - Renders shadcn's <Table> on md+ screens.
 * - Automatically collapses into a stacked card list below md, so nothing
 *   is ever squeezed into unreadable columns on a phone.
 * - Column visibility on the table itself can still be tuned per-breakpoint
 *   via each column's `className` (e.g. "hidden lg:table-cell") for columns
 *   that are nice-to-have on desktop but not essential on a 768px tablet.
 * - Ships with loading skeletons, an empty state, row actions, and pagination
 *   so every table in the app looks and behaves the same way.
 *
 * Usage: see agents-table.tsx for a full example.
 */

export interface DataTableColumn<T> {
  /** Unique key, also used as the mobile card label unless `label` is set. */
  key: string;
  /** Column header shown in the desktop table. */
  header: ReactNode;
  /** Optional override for the label shown in the mobile card view. */
  label?: ReactNode;
  /** Cell renderer. */
  cell: (row: T) => ReactNode;
  /** Extra classes on the <TableHead>/<TableCell>, e.g. "hidden lg:table-cell text-right". */
  className?: string;
  /** Header alignment / cell alignment shorthand. */
  align?: "left" | "right" | "center";
  /**
   * Hide this field entirely in the mobile card view — useful for columns
   * that are purely decorative on desktop (e.g. a trailing chevron).
   */
  hideOnMobile?: boolean;
  /** Marks this as the card's title row on mobile (skips the label:value grid). */
  isPrimary?: boolean;
}

export interface DataTablePagination {
  page: number;
  totalPages: number;
  total?: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

export interface DataTableEmptyState {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  isLoading?: boolean;
  isFetching?: boolean;
  skeletonRows?: number;
  emptyState?: DataTableEmptyState;
  /** Renders a per-row action menu/button, pinned to the top-right on mobile cards. */
  rowActions?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  pagination?: DataTablePagination;
  className?: string;
}

const alignClass: Record<NonNullable<DataTableColumn<unknown>["align"]>, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

const MotionTableRow = motion(TableRow);
const MotionDiv = motion.div;

export function DataTable<T>({
  columns,
  data,
  getRowId,
  isLoading,
  skeletonRows = 5,
  emptyState,
  rowActions,
  isFetching,
  onRowClick,
  pagination,
  className,
}: DataTableProps<T>) {
  const isEmpty = !isLoading && data.length === 0;
  const colSpan = columns.length + (rowActions ? 1 : 0);

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-line bg-surface", className)}>
      {/* ---------- Desktop / tablet table ---------- */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead key={col.key} className={cn(col.align && alignClass[col.align], col.className)}>
                  {col.header}
                </TableHead>
              ))}
              {rowActions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {(isLoading || isFetching) &&
              Array.from({ length: skeletonRows }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell colSpan={colSpan}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {isEmpty && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={colSpan} className="py-16">
                  <EmptyState emptyState={emptyState} />
                </TableCell>
              </TableRow>
            )}

            {!isLoading && (
              <AnimatePresence initial={false}>
                {data.map((row, i) => (
                  <MotionTableRow
                    key={getRowId(row)}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, delay: Math.min(i, 8) * 0.02 }}
                    className={cn(onRowClick && "cursor-pointer")}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cn(col.align && alignClass[col.align], col.className)}
                      >
                        {col.cell(row)}
                      </TableCell>
                    ))}
                    {rowActions && (
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        {rowActions(row)}
                      </TableCell>
                    )}
                  </MotionTableRow>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ---------- Mobile card list ---------- */}
      <div className="divide-y divide-line md:hidden">
        {isLoading &&
          Array.from({ length: skeletonRows }).map((_, i) => (
            <div key={i} className="p-4">
              <Skeleton className="h-14 w-full" />
            </div>
          ))}

        {isEmpty && (
          <div className="px-4 py-16">
            <EmptyState emptyState={emptyState} />
          </div>
        )}

        {!isLoading && (
          <AnimatePresence initial={false}>
            {data.map((row, i) => {
              const primary = columns.find((c) => c.isPrimary);
              const rest = columns.filter((c) => c !== primary && !c.hideOnMobile);
              return (
                <MotionDiv
                  key={getRowId(row)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, delay: Math.min(i, 8) * 0.02 }}
                  className={cn("p-4", onRowClick && "cursor-pointer active:bg-paper/50")}
                  onClick={() => onRowClick?.(row)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">{primary?.cell(row)}</div>
                    {rowActions && (
                      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                        {rowActions(row)}
                      </div>
                    )}
                  </div>
                  {rest.length > 0 && (
                    <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                      {rest.map((col) => (
                        <div key={col.key} className="min-w-0">
                          <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                            {col.label ?? col.header}
                          </dt>
                          <dd className="mt-0.5 truncate text-ink">{col.cell(row)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </MotionDiv>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* ---------- Pagination ---------- */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-line px-4 py-3 text-sm text-muted-foreground">
          <span>
            Page {pagination.page} of {pagination.totalPages}
            {typeof pagination.total === "number" && (
              <span className="hidden sm:inline"> · {pagination.total} total</span>
            )}
            {pagination.isFetching && " · updating…"}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              <ChevronRight className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">Next</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ emptyState }: { emptyState?: DataTableEmptyState }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper text-muted-foreground">
        {emptyState?.icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <p className="text-sm font-medium text-ink">{emptyState?.title ?? "Nothing here yet"}</p>
      {emptyState?.description && (
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">{emptyState.description}</p>
      )}
      {emptyState?.action && <div className="mt-4 flex justify-center">{emptyState.action}</div>}
    </div>
  );
}
