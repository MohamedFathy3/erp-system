'use client';

import { useRouter } from 'next/navigation'
import MainLayout from '@/components/MainLayout'
import { useEffect, useState } from 'react'
import { Search, Edit, Trash2, Plus, ArrowLeft, Check, X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Loading from './loading'

interface ManagePageProps {
  params: { id: string }
}

type Status = 'active' | 'archived' | 'deleted'

type Item = {
  id: number
  name: string
  status: Status
}

export default function ManagePage({ params }: ManagePageProps) {
  const { id } = params
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{ title: string; description: string } | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [filter, setFilter] = useState<'all' | Status>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const [modalOpen, setModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [editedName, setEditedName] = useState('')
  const [editedStatus, setEditedStatus] = useState<Status>('active')

  useEffect(() => {
    setTimeout(() => {
      setData({
        title: id,
        description: `Manage settings for ${id.replace(/-/g, ' ')}`,
      })

      setItems([
        { id: 1, name: 'First Item', status: 'active' },
        { id: 2, name: 'Second Item', status: 'archived' },
        { id: 3, name: 'Third Item', status: 'deleted' },
        { id: 4, name: 'New Item', status: 'active' },
      ])

      setLoading(false)
    }, 500)
  }, [])

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  function openEditModal(item: Item) {
    setIsEditing(true)
    setSelectedItem(item)
    setEditedName(item.name)
    setEditedStatus(item.status)
    setModalOpen(true)
  }

  function openAddModal() {
    setIsEditing(false)
    setSelectedItem(null)
    setEditedName('')
    setEditedStatus('active')
    setModalOpen(true)
  }

  function saveEdit() {
    if (editedName.trim() === '') return alert('Name cannot be empty.')

    if (isEditing && selectedItem) {
      setItems(items.map(i =>
        i.id === selectedItem.id
          ? { ...i, name: editedName.trim(), status: editedStatus }
          : i
      ))
    } else {
      const newId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1
      setItems([...items, { id: newId, name: editedName.trim(), status: editedStatus }])
    }
    setModalOpen(false)
  }

  function deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(i => i.id !== id))
    }
  }

  if (loading) return <Loading />

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <Button variant="outline" onClick={() => router.back()} className="mb-4 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {data?.title.replace(/-/g, ' ')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{data?.description}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-2 pr-4 py-2 w-full sm:w-64 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <Button variant="ghost" size="icon">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'active' | 'archived' | 'deleted' | 'all')}
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="deleted">Deleted</option>
            </select>

            <Button onClick={openAddModal} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>

            <Button
              variant="destructive"
              disabled={selectedItems.length === 0}
              onClick={() =>
                setItems(items.filter(item => !selectedItems.includes(item.id)))
              }
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(filteredItems.map(item => item.id))
                        } else {
                          setSelectedItems([])
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No items found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems([...selectedItems, item.id])
                            } else {
                              setSelectedItems(selectedItems.filter(id => id !== item.id))
                            }
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{item.name}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          item.status === 'archived' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(item)}
                          className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                          className="text-red-600 hover:text-red-800 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {isEditing ? `Edit Item #${selectedItem?.id}` : 'Add New Item'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      id="itemName"
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="itemStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      id="itemStatus"
                      value={editedStatus}
                      onChange={(e) => setEditedStatus(e.target.value as Status)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                      <option value="deleted">Deleted</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
                <Button variant="outline" onClick={() => setModalOpen(false)} className="flex items-center gap-1">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button onClick={saveEdit} className="flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  )
}
