import React from 'react';
import { AlertTriangleIcon, BookOpenIcon, ClockIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { mockReportedIssues } from '../utils/mockData';
export function SupportHub() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-950/50 text-green-400 border-green-800';
      case 'in_progress':
        return 'bg-yellow-950/50 text-yellow-400 border-yellow-800';
      case 'pending':
        return 'bg-red-950/50 text-red-400 border-red-800';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-cyan-400';
      default:
        return 'text-slate-400';
    }
  };
  const getIssueTypeLabel = (type: string) => {
    switch (type) {
      case 'malfunction':
        return 'Device Malfunction';
      case 'false_alarm':
        return 'False Alarm';
      case 'maintenance':
        return 'Maintenance Request';
      case 'technical':
        return 'Technical Issue';
      default:
        return type;
    }
  };
  return <div className="p-4 sm:p-6">
      <div className="mb-6 animate-slide-up">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Community <span className="text-gradient-cyan">Support Hub</span>
        </h1>
        <p className="text-slate-400">
          Fire safety resources and issue reporting
        </p>
      </div>

      {/* Emergency Hotlines */}
      <div className="glass rounded-2xl border-2 border-red-500/50 p-4 sm:p-6 mb-6 glow-red">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center flex-shrink-0 glow-red">
            <AlertTriangleIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Emergency Hotlines
            </h2>
            <div className="space-y-2">
              <p className="text-white font-semibold text-sm sm:text-base">
                BFP Emergency:{' '}
                <span className="text-red-400">(02) 8426-0219</span>
              </p>
              <p className="text-white font-semibold text-sm sm:text-base">
                National Emergency: <span className="text-red-400">911</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Summary */}
      <div className="glass rounded-2xl p-4 sm:p-6 border border-slate-700 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl flex items-center justify-center glow-yellow">
            <AlertCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Issue Summary
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center sm:text-left">
            <p className="text-2xl sm:text-3xl font-bold text-white">
              {mockReportedIssues.length}
            </p>
            <p className="text-xs sm:text-sm text-slate-400">Total Issues</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-2xl sm:text-3xl font-bold text-red-400">
              {mockReportedIssues.filter(i => i.status === 'pending').length}
            </p>
            <p className="text-xs sm:text-sm text-slate-400">Pending</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-2xl sm:text-3xl font-bold text-yellow-400">
              {mockReportedIssues.filter(i => i.status === 'in_progress').length}
            </p>
            <p className="text-xs sm:text-sm text-slate-400">In Progress</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-2xl sm:text-3xl font-bold text-green-400">
              {mockReportedIssues.filter(i => i.status === 'resolved').length}
            </p>
            <p className="text-xs sm:text-sm text-slate-400">Resolved</p>
          </div>
        </div>
      </div>

      {/* Reported Issues */}
      <div className="glass rounded-2xl border border-slate-700 mb-6">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <AlertCircleIcon className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Reported Issues
            </h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {mockReportedIssues.map(issue => <div key={issue.id} className="glass rounded-xl p-4 sm:p-5 border border-slate-700 hover:border-cyan-500/50 transition-all">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-3">
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-slate-500">
                        {issue.id}
                      </span>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(issue.status)}`}>
                        {issue.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`text-xs font-semibold uppercase ${getPriorityColor(issue.priority)}`}>
                        {issue.priority} Priority
                      </span>
                    </div>
                    <h4 className="font-bold text-white mb-1 text-sm sm:text-base">
                      {getIssueTypeLabel(issue.issueType)}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 mb-2">
                      {issue.description}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Device & Owner
                    </p>
                    <p className="text-xs sm:text-sm text-cyan-400 font-mono">
                      {issue.deviceId}
                    </p>
                    <p className="text-xs sm:text-sm text-white font-semibold">
                      {issue.ownerName}
                    </p>
                    <p className="text-xs text-slate-400">{issue.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Timeline</p>
                    <div className="flex items-center gap-2 mb-1">
                      <ClockIcon className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <p className="text-xs text-slate-400">
                        Reported: {issue.reportedDate.toLocaleDateString()}{' '}
                        {issue.reportedDate.toLocaleTimeString()}
                      </p>
                    </div>
                    {issue.resolvedDate && <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <p className="text-xs text-green-400">
                          Resolved: {issue.resolvedDate.toLocaleDateString()}{' '}
                          {issue.resolvedDate.toLocaleTimeString()}
                        </p>
                      </div>}
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>

      {/* Fire Safety Advisories */}
      <div className="glass rounded-2xl border border-slate-700">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <BookOpenIcon className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Fire Safety Advisories
            </h2>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="glass rounded-xl border-l-4 border-cyan-500 pl-4 py-3 hover:border-cyan-400 transition-colors">
              <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">
                Monthly Fire Drill Reminder
              </h4>
              <p className="text-xs sm:text-sm text-slate-400">
                Conduct monthly fire drills with your household. Ensure everyone
                knows evacuation routes and meeting points.
              </p>
            </div>
            <div className="glass rounded-xl border-l-4 border-yellow-500 pl-4 py-3 hover:border-yellow-400 transition-colors">
              <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">
                Device Maintenance
              </h4>
              <p className="text-xs sm:text-sm text-slate-400">
                Test your FIREGUARD3 device weekly. Check battery levels and
                sensor functionality regularly.
              </p>
            </div>
            <div className="glass rounded-xl border-l-4 border-red-500 pl-4 py-3 hover:border-red-400 transition-colors">
              <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">
                Summer Fire Prevention
              </h4>
              <p className="text-xs sm:text-sm text-slate-400">
                During dry season, be extra vigilant. Avoid leaving cooking
                unattended and check electrical connections.
              </p>
            </div>
            <div className="glass rounded-xl border-l-4 border-green-500 pl-4 py-3 hover:border-green-400 transition-colors">
              <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">
                Fire Extinguisher Training
              </h4>
              <p className="text-xs sm:text-sm text-slate-400">
                Free fire extinguisher training available at your local BFP
                station. Contact us to schedule.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
}