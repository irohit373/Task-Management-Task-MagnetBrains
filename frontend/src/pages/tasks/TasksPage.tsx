import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTasks, deleteTask } from '../../store/slices/taskSlice';
import { Layout } from '../../components/layout/Layout';
import { TaskCard } from '../../components/tasks/TaskCard';
import { TaskFilters } from '../../components/tasks/TaskFilters';
import { Button } from '../../components/common/Button';
import { 
  PlusIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
  ListBulletIcon,
  ExclamationTriangleIcon,
  MinusIcon,
  ArrowDownIcon,
  CalendarIcon,
  UserIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import type { Task } from '../../types/task.types';
import { Modal } from '../../components/common/Modal';

type ViewMode = 'grid' | 'priority' | 'list';

export const TasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tasks, pagination, loading } = useAppSelector((state) => state.tasks);
  const { user } = useAppSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
    assignedToMe: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    const params: any = {
      page: currentPage.toString(),
      limit: viewMode === 'priority' ? '100' : '12',
      ...filters,
    };
    
    // If "My Tasks" is selected, filter by assignedTo
    if (filters.assignedToMe && user) {
      params.assignedTo = user._id;
      delete params.assignedToMe;
    } else {
      delete params.assignedToMe;
    }
    
    dispatch(fetchTasks(params));
  }, [dispatch, currentPage, filters, viewMode, user]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTask = async (taskId: string) => {
    await dispatch(deleteTask(taskId));
    // Refresh the task list
    const params = {
      page: currentPage.toString(),
      limit: viewMode === 'priority' ? '100' : '12',
      ...filters,
    };
    dispatch(fetchTasks(params));
  };

  const handleDeleteClick = (task: Task, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setTaskToDelete(task);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await handleDeleteTask(taskToDelete._id);
      setTaskToDelete(null);
    }
  };

  // Group tasks by priority for priority view
  const groupedTasks = {
    high: tasks.filter((task: Task) => task.priority === 'high'),
    medium: tasks.filter((task: Task) => task.priority === 'medium'),
    low: tasks.filter((task: Task) => task.priority === 'low'),
  };

  const priorityConfig = {
    high: {
      title: 'High Priority',
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      headerBg: 'bg-red-500',
      iconColor: 'text-red-500',
      badgeColor: 'bg-red-100 text-red-800',
    },
    medium: {
      title: 'Medium Priority',
      icon: MinusIcon,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      headerBg: 'bg-yellow-500',
      iconColor: 'text-yellow-500',
      badgeColor: 'bg-yellow-100 text-yellow-800',
    },
    low: {
      title: 'Low Priority',
      icon: ArrowDownIcon,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      headerBg: 'bg-green-500',
      iconColor: 'text-green-500',
      badgeColor: 'bg-green-100 text-green-800',
    },
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="mt-2 text-gray-600">Manage and track your tasks</p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ListBulletIcon className="h-4 w-4" />
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Squares2X2Icon className="h-4 w-4" />
                Grid
              </button>
              <button
                onClick={() => setViewMode('priority')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'priority'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ViewColumnsIcon className="h-4 w-4" />
                Priority
              </button>
            </div>
            <Link to="/tasks/create">
              <Button className="flex items-center gap-2">
                <PlusIcon className="h-5 w-5" />
                Create Task
              </Button>
            </Link>
          </div>
        </div>

        <TaskFilters filters={filters} onFilterChange={setFilters} />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : tasks.length > 0 ? (
          <>
            {viewMode === 'list' ? (
              /* List View - Table format */
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Priority
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Assigned To
                        </th>
                        <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tasks.map((task: Task, index: number) => (
                        <tr
                          key={task._id}
                          className="hover:bg-gray-50 transition-colors group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap cursor-pointer" onClick={() => navigate(`/tasks/${task._id}`)}>
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900">
                                {task.title}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {task.description}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
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
                              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
                                task.priority === 'high'
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : task.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                  : 'bg-green-100 text-green-800 border border-green-200'
                              }`}
                            >
                              {task.priority === 'high' && <ExclamationTriangleIcon className="h-3 w-3" />}
                              {task.priority === 'medium' && <MinusIcon className="h-3 w-3" />}
                              {task.priority === 'low' && <ArrowDownIcon className="h-3 w-3" />}
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-gray-900">
                              <CalendarIcon className="h-4 w-4 text-gray-400" />
                              {new Date(task.dueDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {task.assignedTo ? (
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-semibold text-white">
                                    {task.assignedTo.firstName[0]}{task.assignedTo.lastName[0]}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-900">
                                  {task.assignedTo.firstName} {task.assignedTo.lastName}
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400 italic">Unassigned</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
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
                              <button
                                onClick={(e) => handleDeleteClick(task, e)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Delete task"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <TaskCard key={task._id} task={task} onDelete={handleDeleteTask} />
                ))}
              </div>
            ) : (
              /* Priority View - Kanban-style columns */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {(['high', 'medium', 'low'] as const).map((priority) => {
                  const config = priorityConfig[priority];
                  const priorityTasks = groupedTasks[priority];
                  
                  return (
                    <div
                      key={priority}
                      className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl overflow-hidden`}
                    >
                      {/* Column Header */}
                      <div className={`${config.headerBg} px-4 py-3`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <config.icon className="h-5 w-5 text-white" />
                            <h3 className="font-semibold text-white">{config.title}</h3>
                          </div>
                          <span className="bg-white/20 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            {priorityTasks.length}
                          </span>
                        </div>
                      </div>

                      {/* Tasks List */}
                      <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                        {priorityTasks.length > 0 ? (
                          priorityTasks.map((task) => (
                            <Link
                              key={task._id}
                              to={`/tasks/${task._id}`}
                              className="block bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                            >
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-900 line-clamp-2">
                                  {task.title}
                                </h4>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                  {task.description}
                                </p>
                                <div className="flex items-center justify-between pt-2">
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      task.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : task.status === 'in_progress'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {task.status.replace('_', ' ')}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                </div>
                                {task.assignedTo && (
                                  <div className="flex items-center gap-2 pt-1">
                                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-medium text-gray-600">
                                        {task.assignedTo.firstName[0]}{task.assignedTo.lastName[0]}
                                      </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {task.assignedTo.firstName} {task.assignedTo.lastName}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">No {priority} priority tasks</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination - Show in list and grid view */}
            {(viewMode === 'list' || viewMode === 'grid') && pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">
                        {(currentPage - 1) * pagination.itemsPerPage + 1}
                      </span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {Math.min(
                          currentPage * pagination.itemsPerPage,
                          pagination.totalItems
                        )}
                      </span>{' '}
                      of <span className="font-medium">{pagination.totalItems}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPreviousPage}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50"
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              page === currentPage
                                ? 'z-10 bg-primary-600 text-white focus:z-20'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50"
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No tasks found</p>
            <Link to="/tasks/create">
              <Button className="mt-4">Create your first task</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <Modal
          isOpen={!!taskToDelete}
          onClose={() => setTaskToDelete(null)}
          title="Delete Task"
        >
          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800 font-medium">
                    Are you sure you want to delete "<strong>{taskToDelete.title}</strong>"?
                  </p>
                  <p className="text-sm text-red-700 mt-2">
                    This action cannot be undone. All task data will be permanently removed.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setTaskToDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Task
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
};