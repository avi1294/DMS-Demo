import { useMemo } from 'react'
import DataTable from '../../components/tables/DataTable'

function VerifyDocsPage() {
  const data = useMemo(() => [
    { id: 1, docName: 'Annual Report 2023', dept: 'Finance', uploadedBy: 'John Doe', date: '2024-01-15', status: 'Pending' },
    { id: 2, docName: 'HR Policy Update', dept: 'HR', uploadedBy: 'Jane Smith', date: '2024-01-14', status: 'Pending' },
    { id: 3, docName: 'IT Infrastructure Plan', dept: 'IT', uploadedBy: 'Bob Johnson', date: '2024-01-13', status: 'Verified' },
  ], [])

  const columns = useMemo(() => [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Document Name', accessorKey: 'docName' },
    { header: 'Department', accessorKey: 'dept' },
    { header: 'Uploaded By', accessorKey: 'uploadedBy' },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Status', accessorKey: 'status', cell: ({ getValue }) => {
      const status = getValue()
      return <span className={`badge ${status === 'Verified' ? 'bg-success' : 'bg-warning'} text-white`}>{status}</span>
    }},
    { header: 'Actions', cell: ({ row }) => (
      <>
        <button className="btn btn-sm btn-info mr-1"><i className="fas fa-eye"></i> View</button>
        {row.original.status === 'Pending' && (
          <>
            <button className="btn btn-sm btn-success mr-1" onClick={() => alert('Document Verified!')}>Verify</button>
            <button className="btn btn-sm btn-danger" onClick={() => alert('Document Rejected!')}>Reject</button>
          </>
        )}
      </>
    )}
  ], [])

  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-start mb-4">
        <h1 className="h3 mb-0 text-gray-800">Verify Documents</h1>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Documents Pending Verification</h6>
        </div>
        <div className="card-body">
          <DataTable data={data} columns={columns} />
        </div>
      </div>
    </div>
  )
}

export default VerifyDocsPage
