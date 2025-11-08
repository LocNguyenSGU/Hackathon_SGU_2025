import React, { useState, useEffect } from 'react'
import {
  MapPin,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Destination {
  destination_id: number
  destination_name: string
  destination_type: string
  tags: string[]
  latitude: string
  longitude: string
  location_address: string
  price: number
  opening_hours: string
  visit_time: number
  facilities: string[]
  is_active: boolean
  created_date: string
  updated_date: string
  extra_info?: {
    rating?: number
    reviews?: number
    [key: string]: any
  }
  images?: string[]
}

interface ApiResponse {
  items: Destination[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null)

  const [formData, setFormData] = useState({
    destination_name: '',
    destination_type: 'Cultural',
    tags: '',
    latitude: '',
    longitude: '',
    location_address: '',
    price: '',
    opening_hours: '',
    visit_time: '',
    facilities: ''
  })

  const destinationTypes = ['Cultural', 'Adventure', 'Relaxation', 'Entertainment', 'Nature', 'Budget', 'Family']

  useEffect(() => {
    fetchDestinations()
  }, [currentPage, searchTerm, filterType])

  const fetchDestinations = async () => {
    setLoading(true)
    try {
      let url = `http://localhost:8000/api/v1/destinations/?page=${currentPage}&page_size=10`

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`
      }

      if (filterType) {
        url += `&destination_type=${filterType}`
      }

      const response = await fetch(url)
      const data: ApiResponse = await response.json()
      setDestinations(data || [])
      setTotalPages(data.total_pages || 1)
      setTotalItems(data.total || 0)
    } catch (error) {
      console.error('Error fetching destinations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchDestinations()
  }

  const handleCreate = () => {
    setEditingDestination(null)
    setFormData({
      destination_name: '',
      destination_type: 'Cultural',
      tags: '',
      latitude: '',
      longitude: '',
      location_address: '',
      price: '',
      opening_hours: '',
      visit_time: '',
      facilities: ''
    })
    setShowModal(true)
  }

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination)
    setFormData({
      destination_name: destination.destination_name,
      destination_type: destination.destination_type,
      tags: destination.tags.join(', '),
      latitude: destination.latitude,
      longitude: destination.longitude,
      location_address: destination.location_address,
      price: destination.price.toString(),
      opening_hours: destination.opening_hours,
      visit_time: destination.visit_time.toString(),
      facilities: destination.facilities.join(', ')
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      destination_name: formData.destination_name,
      destination_type: formData.destination_type,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      latitude: formData.latitude,
      longitude: formData.longitude,
      location_address: formData.location_address,
      price: parseFloat(formData.price) || 0,
      opening_hours: formData.opening_hours,
      visit_time: parseInt(formData.visit_time) || 0,
      facilities: formData.facilities.split(',').map(f => f.trim()).filter(f => f)
    }

    try {
      const url = editingDestination
        ? `http://localhost:8000/api/v1/destinations/${editingDestination.destination_id}`
        : 'http://localhost:8000/api/v1/destinations'

      const method = editingDestination ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setShowModal(false)
        fetchDestinations()
      } else {
        const error = await response.json()
        alert(`Error: ${JSON.stringify(error)}`)
      }
    } catch (error) {
      console.error('Error saving destination:', error)
      alert('Failed to save destination')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this destination?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/destinations/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchDestinations()
      } else {
        alert('Failed to delete destination')
      }
    } catch (error) {
      console.error('Error deleting destination:', error)
      alert('Failed to delete destination')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Destinations Management</h1>
          <p className="text-slate-600 mt-1 text-sm">Manage all destinations and locations</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Destination
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          >
            <option value="">All Types</option>
            {destinationTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Showing {destinations.length} of {totalItems} destinations</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {/* Destinations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center p-12 text-slate-500">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No destinations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {destinations.map((destination) => (
                  <tr key={destination.destination_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{destination.destination_name}</p>
                          {destination.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {destination.tags.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                              {destination.tags.length > 2 && (
                                <span className="text-xs text-slate-400">+{destination.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {destination.destination_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 text-sm">
                      <div className="max-w-xs truncate">{destination.location_address}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-900 font-semibold text-sm">
                      {destination.price === 0 ? 'Free' : formatCurrency(destination.price)}
                    </td>
                    <td className="px-4 py-3">
                      {destination.extra_info?.rating && (
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-slate-900">⭐ {destination.extra_info.rating}</span>
                          <span className="text-xs text-slate-500">({destination.extra_info.reviews})</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {destination.is_active ? (
                        <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold w-fit">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold w-fit">
                          <AlertCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(destination)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(destination.destination_id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Next
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-slate-900">
                {editingDestination ? 'Edit Destination' : 'Create Destination'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.destination_name}
                    onChange={(e) => setFormData({ ...formData, destination_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Type *
                  </label>
                  <select
                    required
                    value={formData.destination_type}
                    onChange={(e) => setFormData({ ...formData, destination_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  >
                    {destinationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price (VND) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Location Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location_address}
                    onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Latitude *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="10.77970000"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Longitude *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="106.69900000"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Opening Hours *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="09:00-18:00"
                    value={formData.opening_hours}
                    onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Visit Time (minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.visit_time}
                    onChange={(e) => setFormData({ ...formData, visit_time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tags (comma separated) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="history, culture, architecture"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Facilities (comma separated) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="parking, restroom, wifi"
                    value={formData.facilities}
                    onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
                >
                  {editingDestination ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}