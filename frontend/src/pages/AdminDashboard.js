import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { FiUsers, FiFileText, FiUserCheck, FiUserX, FiPlus, FiTrash2, FiEdit, FiUpload } from 'react-icons/fi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    rollNumber: '',
    dob: '',
    name: '',
    department: '',
    batch: '',
    profileImage: ''
  });

  const [bulkData, setBulkData] = useState('');

  useEffect(() => {
    fetchStats();
    fetchStudents();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStudents();
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addStudent(formData);
      alert('Student added successfully!');
      setFormData({
        rollNumber: '',
        dob: '',
        name: '',
        department: '',
        batch: '',
        profileImage: ''
      });
      setShowAddForm(false);
      fetchStudents();
      fetchStats();
    } catch (error) {
      console.error('Error adding student:', error);
      alert(error.response?.data?.error || 'Failed to add student');
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    try {
      // Parse CSV format: rollNumber,dob,name,department,batch
      const lines = bulkData.trim().split('\n');
      const students = lines.map(line => {
        const [rollNumber, dob, name, department, batch] = line.split(',').map(s => s.trim());
        return { rollNumber, dob, name, department, batch };
      });

      const response = await adminAPI.bulkUploadStudents(students);
      alert(`${response.data.successCount} students added successfully!`);
      if (response.data.errorCount > 0) {
        console.log('Errors:', response.data.results.errors);
        alert(`${response.data.errorCount} students failed. Check console for details.`);
      }
      setBulkData('');
      setShowBulkUpload(false);
      fetchStudents();
      fetchStats();
    } catch (error) {
      console.error('Error bulk uploading:', error);
      alert('Failed to upload students');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      await adminAPI.deleteStudent(studentId);
      alert('Student deleted successfully!');
      fetchStudents();
      fetchStats();
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'stats'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'students'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Manage Students
          </button>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStudents}</p>
                </div>
                <FiUsers className="text-4xl text-primary-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold">Logged In</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.studentsLoggedIn}</p>
                </div>
                <FiUserCheck className="text-4xl text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold">Not Logged In</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{stats.studentsNotLoggedIn}</p>
                </div>
                <FiUserX className="text-4xl text-orange-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold">Total Posts</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalPosts}</p>
                </div>
                <FiFileText className="text-4xl text-blue-600" />
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div>
            {/* Action Buttons */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <FiPlus />
                <span>Add Student</span>
              </button>
              <button
                onClick={() => setShowBulkUpload(!showBulkUpload)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FiUpload />
                <span>Bulk Upload</span>
              </button>
            </div>

            {/* Add Student Form */}
            {showAddForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Student</h3>
                <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Roll Number *</label>
                    <input
                      type="text"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Date of Birth *</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Department *</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Batch *</label>
                    <input
                      type="text"
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Profile Image URL</label>
                    <input
                      type="url"
                      value={formData.profileImage}
                      onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="md:col-span-2 flex space-x-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Add Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Bulk Upload Form */}
            {showBulkUpload && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Bulk Upload Students</h3>
                <p className="text-gray-600 mb-4">
                  Enter student data in CSV format (one per line):<br />
                  <code className="bg-gray-100 px-2 py-1 rounded">rollNumber,dob,name,department,batch</code>
                </p>
                <form onSubmit={handleBulkUpload}>
                  <textarea
                    value={bulkData}
                    onChange={(e) => setBulkData(e.target.value)}
                    placeholder="23CAU001,2005-03-07,John Doe,Computer Science,2023&#10;23CAU002,2005-04-15,Jane Smith,Computer Science,2023"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    rows="8"
                    required
                  />
                  <div className="flex space-x-4 mt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Upload Students
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBulkUpload(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Students List */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Roll Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Batch
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.rollNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {student.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {student.batch}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              student.hasLoggedIn
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {student.hasLoggedIn ? 'Active' : 'Not Logged In'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDeleteStudent(student._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;



