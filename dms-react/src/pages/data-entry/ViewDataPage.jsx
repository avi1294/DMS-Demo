import { useMemo } from 'react'
import DataTable from '../../components/tables/DataTable'

function ViewDataPage() {
  const data = useMemo(() => [
    { id: 1, dept: 'Health', year: '2023', area: 'North', fileNo: 'H-001' },
    { id: 2, dept: 'Education', year: '2023', area: 'South', fileNo: 'E-002' },
    { id: 3, dept: 'Finance', year: '2022', area: 'East', fileNo: 'F-003' },
  ], [])

  const columns = useMemo(() => [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Department', accessorKey: 'dept' },
    { header: 'Year', accessorKey: 'year' },
    { header: 'Area', accessorKey: 'area' },
    { header: 'File No.', accessorKey: 'fileNo' },
  ], [])

  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-start mb-4">
        <h1 className="h3 mb-0 text-gray-800">View Data</h1>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Data Records</h6>
        </div>
        <div className="card-body">
          <DataTable data={data} columns={columns} />
        </div>
      </div>
    </div>
  )
}

export default ViewDataPage
