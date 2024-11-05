import React from 'react';
import { BarChart3, Users, FolderKanban, DollarSign, ArrowUp, ArrowDown, Download } from 'lucide-react';
import { useStore } from '../lib/store';
import { formatCurrency } from '../lib/utils';

export default function Dashboard() {
  const { clients, projects, tasks, payments } = useStore();

  // Calculate real statistics
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const activeProjects = projects.filter(p => p.status === 'in-progress').length;
  const totalClients = clients.length;
  const pendingTasks = tasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length;

  // Calculate month-over-month changes
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthRevenue = payments
    .filter(p => {
      const paymentDate = new Date(p.date);
      return paymentDate.getMonth() === currentMonth &&
             paymentDate.getFullYear() === currentYear &&
             p.status === 'completed';
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const lastMonthRevenue = payments
    .filter(p => {
      const paymentDate = new Date(p.date);
      return paymentDate.getMonth() === (currentMonth - 1) &&
             paymentDate.getFullYear() === currentYear &&
             p.status === 'completed';
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const revenueChange = lastMonthRevenue === 0 ? 100 :
    ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      change: `${revenueChange.toFixed(1)}%`,
      trend: revenueChange >= 0 ? 'up' : 'down',
      icon: DollarSign,
    },
    {
      title: 'Active Projects',
      value: activeProjects.toString(),
      change: '+2.3%',
      trend: 'up',
      icon: FolderKanban,
    },
    {
      title: 'Total Clients',
      value: totalClients.toString(),
      change: '+8.1%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks.toString(),
      change: '-4.5%',
      trend: 'down',
      icon: BarChart3,
    },
  ];

  const generateReport = () => {
    const report = {
      revenue: {
        total: totalRevenue,
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
        change: revenueChange,
      },
      projects: {
        total: projects.length,
        active: activeProjects,
        completed: projects.filter(p => p.status === 'completed').length,
        onHold: projects.filter(p => p.status === 'on-hold').length,
      },
      tasks: {
        total: tasks.length,
        pending: pendingTasks,
        completed: tasks.filter(t => t.status === 'completed').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
      },
      clients: {
        total: totalClients,
        active: clients.length, // Add active status to clients if needed
      },
    };

    // Create CSV content
    const csvContent = `Business Report - ${new Date().toLocaleDateString()}

Revenue Summary
Total Revenue,${formatCurrency(report.revenue.total)}
This Month,${formatCurrency(report.revenue.thisMonth)}
Last Month,${formatCurrency(report.revenue.lastMonth)}
Change,${report.revenue.change.toFixed(1)}%

Project Status
Total Projects,${report.projects.total}
Active Projects,${report.projects.active}
Completed Projects,${report.projects.completed}
On Hold,${report.projects.onHold}

Task Summary
Total Tasks,${report.tasks.total}
Pending Tasks,${report.tasks.pending}
In Progress,${report.tasks.inProgress}
Completed Tasks,${report.tasks.completed}

Client Overview
Total Clients,${report.clients.total}
Active Clients,${report.clients.active}
`;

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gray-50 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        <button
          onClick={generateReport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between">
              <span className="p-2 rounded-lg bg-blue-50">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </span>
              <span className={`flex items-center gap-1 text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
                {stat.trend === 'up' ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
              </span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h2>
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600">
                    {clients.find(c => c.id === project.clientId)?.companyName}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  project.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : project.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-800'
                    : project.status === 'on-hold'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.status.replace('-', ' ').charAt(0).toUpperCase() + 
                   project.status.slice(1).replace('-', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h2>
          <div className="space-y-4">
            {tasks.slice(0, 3).map((task) => {
              const project = projects.find(p => p.id === task.projectId);
              return (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600">{project?.name}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    task.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : task.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : task.status === 'review'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status.replace('-', ' ').charAt(0).toUpperCase() + 
                     task.status.slice(1).replace('-', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}