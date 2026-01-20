import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import DataTable from '../../components/tables/DataTable'

function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Sample data - in real app, fetch from API
  const data = useMemo(() => [
    { id: 1, name: 'John Doe', mobile: '1234567890', address: '123 Main St', status: 'active' },
    { id: 2, name: 'Jane Smith', mobile: '0987654321', address: '456 Oak Ave', status: 'inactive' },
    { id: 3, name: 'Bob Johnson', mobile: '5551234567', address: '789 Pine Rd', status: 'active' },
    { id: 4, name: 'Alice Brown', mobile: '5559876543', address: '321 Elm St', status: 'active' },
    { id: 5, name: 'Charlie Wilson', mobile: '5552468135', address: '654 Maple Dr', status: 'inactive' }
  ], [])

  const columns = useMemo(() => [
    {
      header: 'ID',
      accessorKey: 'id',
      cell: ({ getValue }) => <span className="text-center d-block">{getValue()}</span>
    },
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ getValue }) => <span className="text-center d-block">{getValue()}</span>
    },
    {
      header: 'Mobile No.',
      accessorKey: 'mobile',
      cell: ({ getValue }) => <span className="text-center d-block">{getValue()}</span>
    },
    {
      header: 'Address',
      accessorKey: 'address',
      cell: ({ getValue }) => <span className="text-center d-block">{getValue()}</span>
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const status = getValue()
        return (
          <span className="text-center d-block">
            {status === 'inactive' && (
              <span className="badge bg-danger text-white">Inactive</span>
            )}
            {status === 'active' && (
              <span className="badge bg-success text-white">Active</span>
            )}
          </span>
        )
      }
    },
    {
      header: 'Action',
      cell: () => (
        <span className="text-center d-block">
          <button
            className="btn btn-success btn-sm"
            onClick={() => alert('Module to edit user, same as add member')}
          >
            Edit
          </button>
        </span>
      )
    }
  ], [])

  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-start mb-4">
        <h1 className="h3 mb-0 text-gray-800">Manage Members</h1>
      </div>

      <div className="container-fluid px-4">
        <div className="card mt-4 shadow">
          <div className="card-header">
            <div className="row align-items-center">
              <div className="col">
                <h4 className="mb-0">Members</h4>
              </div>
              <div className="col-auto">
                <Link to="/members/add" className="btn btn-primary">
                  Add Member
                </Link>
              </div>
              <div className="col-md-3">
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="card-body">
            <DataTable
              data={data.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              columns={columns}
              searchable={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MembersPage
