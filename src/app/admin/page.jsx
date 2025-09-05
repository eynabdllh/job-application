'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { supabase } from '@/lib/supabase' 
import AdminHeader from '@/components/AdminHeader'
import StatusCards from '@/components/StatusCards' 
import toast, { Toaster } from 'react-hot-toast'
import { Eye, Trash2, Edit, Search, Download, ChevronLeft, ChevronRight, UserPlus, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'
import ApplicationFormModal from './ApplicationFormModal'

// --- Reusable Components ---
const StatusBadge = ({ status }) => {
  const display = status === 'reviewing' ? 'Reviewing' : status.charAt(0).toUpperCase() + status.slice(1);
  const statusConfig = {
    'pending': { dot: 'bg-yellow-500', bg: 'bg-yellow-100', text: 'text-yellow-800' },
    'reviewing': { dot: 'bg-blue-500', bg: 'bg-blue-100', text: 'text-blue-800' },
    'approved': { dot: 'bg-green-500', bg: 'bg-green-100', text: 'text-green-800' },
    'rejected': { dot: 'bg-red-500', bg: 'bg-red-100', text: 'text-red-800' },
  };
  const config = statusConfig[status] || { dot: 'bg-gray-500', bg: 'bg-gray-100', text: 'text-gray-800' };
  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
      {display}
    </span>
  );
};

// Details modal
const DetailsModal = ({ open, app, onClose, onViewResume, onUpdateStatus }) => {
  if (!open || !app) return null;
  const field = (label, value) => (
    <div className="space-y-1">
      <div className="text-xs font-semibold text-gray-500">{label}</div>
      <div className="text-sm text-[#133020] break-words">{value ?? '-'}</div>
    </div>
  );
  const formatExperience = (years) => {
    if (years === null || years === undefined) return '-';
    if (Number(years) === 0) return '0 ';
    return `${years}`;
  };
  const handleApprove = async () => {
    
    await onUpdateStatus(app.id, 'approved', true);
    onClose();
  };
  const handleReject = async () => {
    await onUpdateStatus(app.id, 'rejected', true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-bold text-[#133020]">Application Details</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('First name', app.first_name)}
          {field('Last name', app.last_name)}
          {field('Email', app.email)}
          {field('Age', app.age)}
          {field('Degree', app.degree === 'Other' ? app.degree_other : app.degree)}
          {field('Course', app.course === 'Other' ? app.course_other : app.course)}
          {field('Experience (Years)', formatExperience(app.experience_years))}
          {field('Project', app.project)}
          <div className="sm:col-span-2">
            {field('Experience details', app.experience_details)}
          </div>
          <div className="sm:col-span-2 flex items-center justify-between bg-gray-50 border rounded-lg p-3">
            <div className="text-sm text-[#133020] font-semibold">Resume</div>
            <button onClick={() => onViewResume(app)} className="px-3 py-1.5 rounded bg-[#046241] text-white hover:bg-[#133020]">View Resume</button>
          </div>
        </div>
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600"/>
          <div className="flex gap-2">
            <button onClick={handleReject} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Reject</button>
            <button onClick={handleApprove} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Approve</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple confirm modal
const ConfirmModal = ({ open, onCancel, onConfirm, title, message }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm p-5">
        <h3 className="text-lg font-semibold text-[#133020] mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-100 text-[#133020] hover:bg-gray-200">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  )
}

// --- Main Dashboard Component ---
export default function AdminDashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('submitted_at')
  const [sortDirection, setSortDirection] = useState('desc')
  const [selectedIds, setSelectedIds] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingApp, setEditingApp] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(new Set())
  const [lastToastId, setLastToastId] = useState(null)
  const [refreshPaused, setRefreshPaused] = useState(false)
  const [toastLock, setToastLock] = useState(false)

  const { admin, loading: authLoading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !admin) {
      router.push('/admin/login')
    } else if (admin) {
      fetchApplications()
      
      // Auto-refresh every 5 seconds to check for new applications (silent)
      const refreshInterval = setInterval(() => {
        if (!refreshPaused) {
          fetchApplications(false) 
        }
      }, 5000)

      return () => {
        clearInterval(refreshInterval)
      }
    }
  }, [admin, authLoading, router])

  const fetchApplications = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      setApplications(data || []); 
    } catch (error) {
      if (showLoading) {
        toast.error('Failed to fetch applications.');
      }
      console.error('Fetch error:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const showUniqueToast = (message, type = 'success') => {
    if (toastLock) {
      return;
    }
    
    setToastLock(true);
    
    toast.dismiss();
    toast.dismiss();
   
    setTimeout(() => {
      toast.dismiss();
      
      const toastId = `unique-${Date.now()}-${Math.random()}`;
      
      if (type === 'success') {
        toast.success(message, { 
          id: toastId,
          duration: 3000
        });
      } else {
        toast.error(message, { 
          id: toastId,
          duration: 3000
        });
      }
      
      setTimeout(() => {
        setToastLock(false);
      }, 1500);
    }, 150);
  };

  const updateApplicationStatus = async (id, newStatus, showToast = true) => {
    const originalApplications = [...applications];

    if (showToast) {
      showUniqueToast(`Application ${newStatus} successfully!`);
    }
    
    setApplications(prev => prev.map(app => (app.id === id ? { ...app, status: newStatus } : app)));
    
    try {
      const resp = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update');
      }
      
    } catch (error) {
      setApplications(originalApplications);
      
      if (showToast) {
        showUniqueToast('Failed to update status.', 'error');
      }
      console.error('Update error:', error);
    }
  }
  
  const handleViewResume = async (app) => {
    try {
      if (!app.resume_filename) {
        toast.error('No resume file found');
        return;
      }

      console.log('Attempting to view resume:', app.resume_filename);
      console.log('App data:', app);
      
      const { data: bucketData, error: bucketError } = await supabase.storage.listBuckets();
      console.log('Available buckets:', bucketData);
      if (bucketError) console.error('Bucket list error:', bucketError);
      
      const { data, error } = supabase.storage
        .from('resumes')
        .getPublicUrl(app.resume_filename);

      if (error) {
        console.error('Storage error:', error);
        toast.error('Failed to generate resume URL');
        return;
      }

      if (data?.publicUrl) {
        console.log('Resume URL:', data.publicUrl);
        window.open(data.publicUrl, '_blank');
      } else {
        console.error('No public URL generated');
        toast.error('Resume not publicly accessible');
      }
    } catch (e) {
      console.error('Resume viewing error:', e);
      toast.error('Failed to open resume');
    }
  };
  
  const handleDelete = async (id) => {
    setSelectedIds([id])
    setShowConfirm(true)
  };

  const confirmBulkDelete = async () => {
    const ids = [...selectedIds]
    setShowConfirm(false)
    if (ids.length === 0) return
    const original = [...applications]
    setApplications(prev => prev.filter(a => !ids.includes(a.id)))
    setSelectedIds([])
    try {
      const { error } = await supabase.from('applications').delete().in('id', ids)
      if (error) throw error
      toast.success('Deleted successfully')
    } catch (e) {
      setApplications(original)
      toast.error('Failed to delete')
      console.error(e)
    }
  }
  
  // Filtering and Pagination Logic
  const filteredApplications = useMemo(() => {
    let filtered = (applications || [])
      .filter(app => {
        if (statusFilter === 'All') return true;
        if (statusFilter === 'reviewed') return app.status === 'reviewing';
        return app.status === statusFilter;
      })
      .filter(app => {
        const fullName = `${app.first_name || ''} ${app.last_name || ''}`.toLowerCase();
        const email = (app.email || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        return fullName.includes(term) || email.includes(term);
      });

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortField) {
        case 'name':
          aValue = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase();
          bValue = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase();
          break;
        case 'email':
          aValue = (a.email || '').toLowerCase();
          bValue = (b.email || '').toLowerCase();
          break;

        case 'submitted_at':
          aValue = new Date(a.submitted_at);
          bValue = new Date(b.submitted_at);
          break;
        default:
          aValue = a[sortField] || '';
          bValue = b[sortField] || '';
      }
      if (sortDirection === 'asc') return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });
    return filtered;
  }, [applications, statusFilter, searchTerm, sortField, sortDirection]);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredApplications.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredApplications, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredApplications.length / rowsPerPage);

  const handleExport = () => {
    const dataToExport = filteredApplications.map(app => ({
      ID: app.id,
      FirstName: app.first_name,
      LastName: app.last_name,
      Email: app.email,
      Age: app.age,
      Degree: app.degree_other || app.degree,
      Course: app.course_other || app.course,
      ExperienceYears: app.experience_years,
      ExperienceDetails: app.experience_details,
      Project: app.project,
      Status: app.status,
      SubmittedAt: format(new Date(app.submitted_at), 'yyyy-MM-dd HH:mm'),
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    XLSX.writeFile(workbook, "Lifewood_Applications.xlsx");
    toast.success("Data exported to Excel!");
  };
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusCount = (status) => {
    if (status === 'reviewing') return applications.filter(app => app.status === 'reviewing').length;
    return applications.filter(app => app.status === status).length;
  };

  const statusTabs = [
    { name: 'All', count: applications.length, color: 'bg-[#046241] text-white' },
    { name: 'pending', count: getStatusCount('pending'), color: 'bg-[#FFC370] text-[#133020]' },
    { name: 'reviewing', count: getStatusCount('reviewing'), color: 'bg-blue-600 text-white' },
    { name: 'approved', count: getStatusCount('approved'), color: 'bg-[#046241] text-white' },
    { name: 'rejected', count: getStatusCount('rejected'), color: 'bg-red-600 text-white' }
  ];

  const toggleSelectAllOnPage = (checked) => {
    const pageIds = paginatedApplications.map(a => a.id)
    if (checked) {
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])))
    } else {
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)))
    }
  }

  const toggleSelectOne = (id, checked) => {
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(x => x !== id))
  }

const handleViewDetails = async (app) => {
  // If the application is currently 'pending', update its status silently.
  if (app.status === 'pending') {
    // We pass 'false' for the showToast parameter to prevent a notification.
    await updateApplicationStatus(app.id, 'reviewing', false);
  }
  
  // Now, open the modal with the (potentially updated) application data.
  setSelectedApp(prevApp => ({ ...prevApp, ...app, status: app.status === 'pending' ? 'reviewing' : app.status }));
  setShowDetailModal(true);
};

  if (authLoading || !admin) {
    return <div className="min-h-screen bg-[#f5eedb] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#046241]"></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#f5eedb]">
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
        containerStyle={{
          zIndex: 9999,
        }}
      />
      <AdminHeader />
      
      <main className="w-full mx-auto py-8 px-6 sm:px-12 lg:px-16 xl:px-24 2xl:px-32">
        <h2 className="text-3xl font-bold text-[#133020] mb-6">Admin Dashboard</h2>
        
        <StatusCards applications={applications} />
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          {/* Filter Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6 overflow-x-auto">
              {statusTabs.map(tab => (
                <button
                  key={tab.name}
                  onClick={() => { setStatusFilter(tab.name); setCurrentPage(1); }}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    statusFilter === tab.name ? 'border-[#046241] text-[#046241]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name === 'All' ? 'All Applications' : tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
                  {tab.count > 0 && (
                    <span className={`ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${tab.color}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
            <div className="w-full md:w-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" placeholder="Search by name or email..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#046241]"
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {selectedIds.length === 0 ? (
                <>
                  <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-[#133020] font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                    <Download size={18} /> <span className="hidden sm:inline">Export</span>
                  </button>
                  <button onClick={() => { setEditingApp(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#046241] text-white font-semibold rounded-lg hover:bg-[#133020] transition-colors">
                    <UserPlus size={18} /> Add Application
                  </button>
                </>
              ) : (
                <button onClick={() => setShowConfirm(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">
                  <Trash2 size={18} /> Delete
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[900px] table-auto divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>  
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={paginatedApplications.length > 0 && paginatedApplications.every(a => selectedIds.includes(a.id))}
                      onChange={(e) => toggleSelectAllOnPage(e.target.checked)}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors w-full text-left"
                    >
                      Name
                      {sortField === 'name' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-[#046241]" /> : <ArrowDown className="w-3 h-3 text-[#046241]" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('email')}
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors w-full text-left"
                    >
                      Email
                      {sortField === 'email' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-[#046241]" /> : <ArrowDown className="w-3 h-3 text-[#046241]" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 tracking-wider">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 tracking-wider">Project</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('submitted_at')}
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors w-full text-left"
                    >
                      Date Submitted
                      {sortField === 'submitted_at' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-[#046241]" /> : <ArrowDown className="w-3 h-3 text-[#046241]" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading...</td></tr>
                ) : paginatedApplications.length === 0 ? (
                  <tr><td colSpan="7" className="p-8 text-center text-gray-500">No applications match your filters.</td></tr>
                ) : (
                  paginatedApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(app.id)}
                          onChange={(e) => toggleSelectOne(app.id, e.target.checked)}
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-normal break-words">
                        <div className="text-[#133020] text-sm truncate">{app.first_name} {app.last_name}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-normal break-words text-sm text-gray-500">{app.email}</td>
                      <td className="px-4 py-4 whitespace-normal break-words text-sm text-gray-700">{app.course_other || app.course}</td>
                      <td className="px-4 py-4 whitespace-normal break-words text-sm text-gray-700">{app.project}</td>
                      <td className="px-4 py-4 whitespace-normal break-words text-sm text-gray-500">{format(new Date(app.submitted_at), 'dd MMM yyyy')}</td>
                      <td className="px-4 py-4 whitespace-normal"><StatusBadge status={app.status} /></td>
                      <td className="px-4 py-4 whitespace-normal text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleViewDetails(app)} className="text-gray-500 hover:text-[#046241] p-1 rounded-full hover:bg-gray-100" title="View Details & Resume"><Eye size={16} /></button>
                          <button onClick={() => { setEditingApp(app); setShowForm(true); }} className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100" title="Edit Application"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(app.id)} className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100" title="Delete Application"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {(() => {
              const total = filteredApplications.length;
              const start = total === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
              const end = Math.min(currentPage * rowsPerPage, total);
              const label = total === 0
                ? 'Showing 0 results'
                : `Showing ${start}–${end} of ${total} ${total === 1 ? 'result' : 'results'}`;
              return (
                <span className="text-sm text-gray-600">{label}</span>
              )
            })()}
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft size={20} /></button>
              <span className="font-semibold">Page {currentPage} of {totalPages || 1}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>
      </main>

      {/* Confirm Modal */}
      <ConfirmModal
        open={showConfirm}
        onCancel={() => { setShowConfirm(false); setSelectedIds([]); }}
        onConfirm={confirmBulkDelete} 
        title="Delete applications?"
        message={`Are you sure you want to delete ${selectedIds.length} application${selectedIds.length === 1 ? '' : 's'}? This action cannot be undone.`}
      />

      <ApplicationFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        initialData={editingApp}
        onSaved={fetchApplications}
      />

      <DetailsModal
        open={showDetailModal}
        app={selectedApp}
        onClose={() => setShowDetailModal(false)}
        onViewResume={handleViewResume}
        onUpdateStatus={updateApplicationStatus}
      />
    </div>
  )
}