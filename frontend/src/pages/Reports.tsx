import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  Download
} from 'lucide-react'
import { useReports, useUpdateReportStatus } from '../hooks/useReports'
import { useAutoTranslation } from '../hooks/useAutoTranslation'

const Reports = () => {
  const { t } = useAutoTranslation()
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [filter, setFilter] = useState('all')
  
  const { data: reports = [], isLoading, error } = useReports(filter)
  const updateReportStatus = useUpdateReportStatus()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'resolved': return 'text-blue-600 bg-blue-50'
      case 'false_alarm': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'resolved': return <CheckCircle className="w-4 h-4" />
      case 'false_alarm': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const handleStatusUpdate = async (reportId: string, status: string) => {
    try {
      await updateReportStatus.mutateAsync({ reportId, status })
      setSelectedReport(null)
    } catch (error) {
      console.error('Failed to update report status:', error)
    }
  }

  const exportReportsToCSV = () => {
    const headers = ['ID', 'Title', 'Description', 'Severity', 'Status', 'Location', 'Reporter', 'Email', 'Created At']
    const csvContent = [
      headers.join(','),
      ...reports.map(report => [
        `"${report.id}"`,
        `"${report.title.replace(/"/g, '""')}"`,
        `"${report.description.replace(/"/g, '""')}"`,
        `"${report.severity}"`,
        `"${report.status}"`,
        `"${report.location?.state}, ${report.location?.district}"`,
        `"${report.user_name}"`,
        `"${report.user_email}"`,
        `"${new Date(report.created_at).toLocaleString()}"`
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jalrakshak_flood_reports_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Reports
            </h1>
            <p className="text-gray-600 mt-2 text-lg">{t('Manage flood reports and user submissions')}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('Search reports')}
                className="input pl-10 w-64"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input w-32"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="resolved">Resolved</option>
              <option value="false_alarm">False Alarm</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportReportsToCSV}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Total Reports</p>
              <p className="text-2xl font-bold text-text-primary">{reports.length}</p>
            </div>
            <FileText className="w-8 h-8 text-brand" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {reports.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Verified</p>
              <p className="text-2xl font-bold text-green-600">
                {reports.filter(r => r.status === 'verified').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Critical</p>
              <p className="text-2xl font-bold text-red-600">
                {reports.filter(r => r.severity === 'critical').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </motion.div>

      {/* Reports List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="card p-6"
      >
        <h2 className="text-xl font-semibold text-text-primary mb-6">Reports List</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading reports...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">Failed to load reports</p>
              <p className="text-gray-500 text-sm mt-1">Please check your connection</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No reports found</p>
                <p className="text-gray-400 text-sm">Reports will appear here once they are submitted</p>
              </div>
            ) : (
              reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                          {report.severity}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          <span>{report.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>📍 {report.location?.state}, {report.location?.district}</span>
                        <span>👤 {report.user_name}</span>
                        <span>📅 {new Date(report.created_at).toLocaleString()}</span>
                        {report.images && report.images.length > 0 && (
                          <span>📷 {report.images.length} image(s)</span>
                        )}
                      </div>
                    </div>
                    <Eye className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </motion.div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Report Details</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-text-muted hover:text-text-primary"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-text-primary mb-2">{selectedReport.title}</h4>
                <p className="text-text-secondary">{selectedReport.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-muted">Severity</label>
                  <p className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${getSeverityColor(selectedReport.severity)}`}>
                    {selectedReport.severity}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-muted">Status</label>
                  <p className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${getStatusColor(selectedReport.status)}`}>
                    {selectedReport.status}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-text-muted">Location</label>
                <p className="text-text-primary">{selectedReport.location}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-text-muted">Reporter</label>
                <p className="text-text-primary">{selectedReport.reporter} ({selectedReport.email})</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-text-muted">Submitted</label>
                <p className="text-text-primary">{selectedReport.createdAt}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button className="btn-secondary">Mark as False Alarm</button>
              <button className="btn-primary">Verify Report</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Reports
