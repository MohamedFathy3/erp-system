
'use client'
import MainLayout from "@/components/MainLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchEmployees, updateEmployee, deleteEmployee, addEmployee } from "@/services/employeeService";
import { Employee } from "@/types/employee";
import { useState } from "react";
import { FiEdit, FiTrash2, FiSearch, FiPlus, FiChevronDown,  FiUser, FiLoader,FiX  } from "react-icons/fi";
import { FaLaptop, FaMobileAlt, FaServer ,} from "react-icons/fa";

export default function EmployeesPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'> & { password: string }>({
    name: '',
    email: '',
    password: '',
    company: '',
    branch: '',
    country: 'Egypt',
    role: 'Employee',
    device: 'Laptop',
    issues: 0
  });
  
  // Fetch employees data
  const { data: employees, isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees
  });

  // Update employee mutation
  const updateEmployeeMutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
queryClient.invalidateQueries({ queryKey: ['employees'] });
      setEditModalOpen(false);
    }
  });

  // Add employee mutation
  const addEmployeeMutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
queryClient.invalidateQueries({ queryKey: ['employees'] });
      setAddModalOpen(false);
      setNewEmployee({
        name: '',
        email: '',
        password: '',
        company: '',
        branch: '',
        country: 'Egypt',
        role: 'Employee',
        device: 'Laptop',
        issues: 0
      });
    }
  });

  // Delete employee mutation
  const deleteEmployeeMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  // Filter employees based on search term
  const filteredEmployees = employees?.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Handle edit submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentEmployee) {
      updateEmployeeMutation.mutate(currentEmployee);
    }
  };

  // Handle add submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployeeMutation.mutate(newEmployee);
  };

  if (isLoading) return (
    <MainLayout>
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </MainLayout>
  );
  
  if (error) return (
    <MainLayout>
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>Error loading employees. Please try again later.</p>
        </div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Employee Management</h1>
            <p className="text-gray-600 mt-1">Manage your organizations employees</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                style={{borderRadius:12}}
                placeholder="Search employees..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
            style={{borderRadius:12}}
              onClick={() => setAddModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all"
            >
              <FiPlus className="mr-2" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Device</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {employee.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{employee.name}</div>
                          <div className="text-xs text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{employee.company}</div>
                      <div className="text-xs text-gray-500">{employee.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.branch}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${employee.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                          employee.role === 'Manager' ? 'bg-green-100 text-green-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {employee.device === 'Laptop' ? (
                          <FaLaptop className="text-blue-500 mr-2" />
                        ) : employee.device === 'Mobile' ? (
                          <FaMobileAlt className="text-green-500 mr-2" />
                        ) : (
                          <FaServer className="text-purple-500 mr-2" />
                        )}
                        <span className="text-sm text-gray-600">{employee.device}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${employee.issues > 5 ? 'bg-red-100 text-red-800' : 
                          employee.issues > 0 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {employee.issues > 5 ? 'Critical' : 
                         employee.issues > 0 ? 'Warning' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setCurrentEmployee(employee);
                            setEditModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => deleteEmployeeMutation.mutate(employee.id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Employee Modal */}
        {editModalOpen && currentEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-bold text-gray-800">Edit Employee</h2>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
                >
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={currentEmployee.name}
                        onChange={(e) => setCurrentEmployee({...currentEmployee, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={currentEmployee.email}
                        onChange={(e) => setCurrentEmployee({...currentEmployee, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={currentEmployee.company}
                        onChange={(e) => setCurrentEmployee({...currentEmployee, company: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={currentEmployee.branch}
                        onChange={(e) => setCurrentEmployee({...currentEmployee, branch: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <div className="relative">
                        <select
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                          value={currentEmployee.country}
                          onChange={(e) => setCurrentEmployee({...currentEmployee, country: e.target.value})}
                          required
                        >
                          <option value="Egypt">Egypt</option>
                          <option value="USA">USA</option>
                          <option value="UK">UK</option>
                          <option value="UAE">UAE</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <div className="relative">
                        <select
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                          value={currentEmployee.role}
                          onChange={(e) => setCurrentEmployee({...currentEmployee, role: e.target.value})}
                          required
                        >
                          <option value="Admin">Admin</option>
                          <option value="Manager">Manager</option>
                          <option value="Employee">Employee</option>
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Device</label>
                      <div className="relative">
                        <select
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                          value={currentEmployee.device}
                          onChange={(e) => setCurrentEmployee({ ...currentEmployee, device: "Laptop" })
}
                          required
                        >
                          <option value="Laptop">Laptop</option>
                          
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Active Issues</label>
                      <input
                        type="number"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={currentEmployee.issues}
                        onChange={(e) => setCurrentEmployee({...currentEmployee, issues: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all"
                    disabled={updateEmployeeMutation.isLoading}
                  >
                    {updateEmployeeMutation.isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Employee Modal */}
       {addModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden">
      <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800">Add New Employee</h2>
        <button
          onClick={() => setAddModalOpen(false)}
          className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
        >
          <FiX size={24} />
        </button>
      </div>
      
      <form onSubmit={handleAddSubmit}>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 border-b pb-2">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {newEmployee.photo ? (
                      <img src={newEmployee.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <FiUser className="text-gray-400 text-xl" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                    onChange={(e) => handlePhotoUpload(e)}
                  />
                  <label htmlFor="photo-upload" className="text-sm text-blue-500 hover:underline cursor-pointer">
                    Upload Photo
                  </label>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 border-b pb-2">Company Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company*</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newEmployee.company}
                  onChange={(e) => setNewEmployee({...newEmployee, company: e.target.value})}
                  required
                >
                  <option value="">Select Company</option>
                  <option value="ISG">ISG</option>
                  <option value="TechSolutions">TechSolutions</option>
                  <option value="GlobalSoft">GlobalSoft</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch*</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newEmployee.branch}
                  onChange={(e) => setNewEmployee({...newEmployee, branch: e.target.value})}
                  required
                >
                  <option value="">Select Branch</option>
                  <option value="Cairo">Cairo</option>
                  <option value="Alexandria">Alexandria</option>
                  <option value="Giza">Giza</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position*</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID*</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newEmployee.employeeId}
                  onChange={(e) => setNewEmployee({...newEmployee, employeeId: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 border-b pb-2">Additional Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newEmployee.country}
                  onChange={(e) => setNewEmployee({...newEmployee, country: e.target.value})}
                  required
                >
                  <option value="">Select Country</option>
                  <option value="Egypt">Egypt</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="UAE">UAE</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Governorate*</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newEmployee.governorate}
                  onChange={(e) => setNewEmployee({...newEmployee, governorate: e.target.value})}
                  required
                >
                  <option value="">Select Governorate</option>
                  <option value="Cairo">Cairo</option>
                  <option value="Giza">Giza</option>
                  <option value="Alexandria">Alexandria</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newEmployee.city}
                  onChange={(e) => setNewEmployee({...newEmployee, city: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newEmployee.address}
                  onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})}
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newEmployee.postalCode}
                  onChange={(e) => setNewEmployee({...newEmployee, postalCode: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setAddModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all"
            disabled={addEmployeeMutation.isLoading}
          >
            {addEmployeeMutation.isLoading ? (
              <span className="flex items-center gap-2">
                <FiLoader className="animate-spin" />
                Adding...
              </span>
            ) : (
              'Add Employee'
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      </div>
    </MainLayout>
  );
}