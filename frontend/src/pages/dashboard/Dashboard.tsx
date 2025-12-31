import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTaskStats, fetchTasks } from '../../store/slices/taskSlice';
import { Layout } from '../../components/layout/Layout';
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { stats, tasks } = useAppSelector((state) => state.tasks);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTaskStats());
    dispatch(fetchTasks({ limit: '5', sortBy: 'dueDate', order: 'asc' }));
  }, [dispatch]);

  const statsCards = [
    {
      title: 'Total Tasks',
      value: stats?.total || 0,
      icon: ClipboardDocumentListIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Pending',
      value: stats?.pending || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
    {
      title: 'In Progress',
      value: stats?.in_progress || 0,
      icon: ClockIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Completed',
      value: stats?.completed || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="mt-2 text-gray-600">Here's what's happening with your tasks</p>
          </div>
          <button
            onClick={() => navigate('/tasks/create')}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
          >
            <PlusIcon className="h-5 w-5" />
            Add New Task
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Priority Distribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">High Priority</span>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {stats?.highPriority || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Medium Priority</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">
                {stats?.mediumPriority || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Low Priority</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {stats?.lowPriority || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
            <Link
              to="/tasks"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
            >
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="overflow-x-auto">
            {tasks.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr
                      key={task._id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4 cursor-pointer" onClick={() => navigate(`/tasks/${task._id}`)}>
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {task.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {task.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => navigate(`/tasks/${task._id}`)}>
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : task.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}
                        >
                          {task.status === 'in_progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              : 'bg-green-100 text-green-800 border border-green-200'
                          }`}
                        >
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer" onClick={() => navigate(`/tasks/${task._id}`)}>
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tasks/${task._id}?edit=true`);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Edit task"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="mt-2 text-gray-500">No upcoming tasks</p>
                <Link
                  to="/tasks/create"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Create your first task
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};