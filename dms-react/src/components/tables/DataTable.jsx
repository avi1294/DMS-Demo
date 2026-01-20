import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table'

function DataTable({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Search...',
  pageSize = 10
}) {
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize
      }
    }
  })

  return (
    <div>
      {searchable && (
        <div className="row mb-3">
          <div className="col-sm-12 col-md-6">
            <div className="dataTables_length">
              <label>
                Show{' '}
                <select
                  className="custom-select custom-select-sm form-control form-control-sm"
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                >
                  {[10, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>{' '}
                entries
              </label>
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <div className="dataTables_filter float-right">
              <label>
                Search:{' '}
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder={searchPlaceholder}
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered" width="100%" cellSpacing="0">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' ↑',
                      desc: ' ↓'
                    }[header.column.getIsSorted()] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  No records found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>

      {/* Pagination */}
      <div className="row">
        <div className="col-sm-12 col-md-5">
          <div className="dataTables_info">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}{' '}
            to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} entries
          </div>
        </div>
        <div className="col-sm-12 col-md-7">
          <div className="dataTables_paginate paging_simple_numbers float-right">
            <ul className="pagination">
              <li className={`paginate_button page-item previous ${!table.getCanPreviousPage() ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                  Previous
                </button>
              </li>
              {Array.from({ length: table.getPageCount() }, (_, i) => (
                <li
                  key={i}
                  className={`paginate_button page-item ${table.getState().pagination.pageIndex === i ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => table.setPageIndex(i)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`paginate_button page-item next ${!table.getCanNextPage() ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  Next
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataTable
