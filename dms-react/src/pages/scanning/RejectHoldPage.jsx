import { useMemo } from 'react'
import DataTable from '../../components/tables/DataTable'

function RejectHoldPage() {
  const data = useMemo(() => [
    { id: 1, docName: 'Report Q1', reason: 'Incomplete data', status: 'Rejected', date: '2024-01-15' },
    { id: 2, docName: 'Invoice #234', reason: 'Pending approval', status: 'On Hold', date: '2024-01-14' },
    { id: 3, docName: 'Contract Draft', reason: 'Signature missing', status: 'Rejected', date: '2024-01-13' },
  ], [])

  const columns = useMemo(() => [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Document Name', accessorKey: 'docName' },
    { header: 'Reason', accessorKey: 'reason' },
    { header: 'Status', accessorKey: 'status', cell: ({ getValue }) => {
      const status = getValue()
      return <span className={`badge ${status === 'Rejected' ? 'bg-danger' : 'bg-warning'} text-white`}>{status}</span>
    }},
    { header: 'Date', accessorKey: 'date' },
    { header: 'Actions', cell: () => (
      <>
        <button className="btn btn-sm btn-success mr-1">Restore</button>
        <button className="btn btn-sm btn-danger">Delete</button>
      </>
    )}
  ], [])

  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-start mb-4">
        <h1 className="h3 mb-0 text-gray-800">Rejected / On Hold Documents</h1>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Documents List</h6>
        </div>
        <div className="card-body">
          <DataTable data={data} columns={columns} />
        </div>
      </div>
    </div>
  )
}

export default RejectHoldPage
