import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskPriority,
} from '../../store/slices/taskSlice';
import { Layout } from '../../components/layout/Layout';
import { Modal } from '../../components/common/Modal';
import { TaskForm } from '../../components/tasks/TaskForm';
import { Button } from '../../components/common/Button';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { formatDateTime, getDueDateLabel } from '../../utils/formatDate';
import { PRIORITY_COLORS, STATUS_COLORS } from '../../utils/constants';

export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentTask, loading } = useAppSelector((state) => state.tasks);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    // Check if URL has edit=true parameter
    if (searchParams.get('edit') === 'true') {
      setIsEditMode(true);
      // Remove the parameter from URL
      searchParams.delete('edit');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleUpdate = async (data: any) => {
    if (id) {
      await dispatch(updateTask({ id, data }));
      setIsEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleDelete = async () => {
    if (id) {
      await dispatch(deleteTask(id));
      navigate('/tasks');
    }
  };

  const handleStatusChange = async (status: string) => {
    if (id) {
      await dispatch(updateTaskStatus({ id, status }));
    }
  };

  const handlePriorityChange = async (priority: string) => {
    if (id) {
      await dispatch(updateTaskPriority({ id, priority }));
    }
  };

  if (loading || !currentTask) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Link
          to="/tasks"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Tasks
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {isEditMode ? (
            /* Edit Mode */
            <>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-2">
                      Edit Task
                    </h1>
                    <p className="text-blue-100">Update the task details below</p>
                  </div>
                  <button
                    onClick={handleCancelEdit}
                    className="p-3 text-white hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                    title="Cancel Editing"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800">
                    <strong>Editing:</strong> {currentTask.title}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Update the fields below and click "Update Task" to save your changes.
                  </p>
                </div>
                <TaskForm task={currentTask} onSubmit={handleUpdate} loading={loading} />
              </div>
            </>
          ) : (
            /* View Mode */
            <>
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-3">
                      {currentTask.title}
                    </h1>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1.5 text-sm font-semibold rounded-lg border-2 bg-white/10 backdrop-blur-sm ${
                          currentTask.priority === 'high'
                            ? 'border-red-300 text-red-100'
                            : currentTask.priority === 'medium'
                            ? 'border-yellow-300 text-yellow-100'
                            : 'border-green-300 text-green-100'
                        }`}
                      >
                        {currentTask.priority.toUpperCase()} Priority
                      </span>
                      <span
                        className={`px-3 py-1.5 text-sm font-semibold rounded-lg border-2 bg-white/10 backdrop-blur-sm ${
                          currentTask.status === 'completed'
                            ? 'border-green-300 text-green-100'
                            : currentTask.status === 'in_progress'
                            ? 'border-blue-300 text-blue-100'
                            : 'border-gray-300 text-gray-100'
                        }`}
                      >
                        {currentTask.status === 'in_progress' ? 'IN PROGRESS' : currentTask.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="p-3 text-white hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                      title="Edit Task"
                    >
                      <PencilIcon className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="p-3 text-white hover:bg-red-500/30 rounded-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                      title="Delete Task"
                    >
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Description Section */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Description
                    </h2>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {currentTask.description}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                      <h3 className="text-sm font-semibold text-blue-900">Due Date</h3>
                    </div>
                    <p className="text-gray-900 font-medium">{getDueDateLabel(currentTask.dueDate)}</p>
                  </div>

                  {currentTask.assignedTo && (
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <UserIcon className="h-5 w-5 text-purple-600" />
                        <h3 className="text-sm font-semibold text-purple-900">Assigned To</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-white">
                            {currentTask.assignedTo.firstName[0]}{currentTask.assignedTo.lastName[0]}
                          </span>
                        </div>
                        <p className="text-gray-900 font-medium">
                          {currentTask.assignedTo.firstName} {currentTask.assignedTo.lastName}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <UserIcon className="h-5 w-5 text-green-600" />
                      <h3 className="text-sm font-semibold text-green-900">Created By</h3>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {currentTask.createdBy.firstName} {currentTask.createdBy.lastName}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <ClockIcon className="h-5 w-5 text-gray-600" />
                      <h3 className="text-sm font-semibold text-gray-900">Created At</h3>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {formatDateTime(currentTask.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Quick Actions
                    </h3>
                  </div>
                  <div className="space-y-5">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Change Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['pending', 'in_progress', 'completed'].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                              currentTask.status === status
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md border border-gray-200'
                            }`}
                          >
                            {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-5 border border-orange-100">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Change Priority
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['low', 'medium', 'high'].map((priority) => (
                          <button
                            key={priority}
                            onClick={() => handlePriorityChange(priority)}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                              currentTask.priority === priority
                                ? priority === 'high'
                                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-105'
                                  : priority === 'medium'
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg transform scale-105'
                                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-md border border-gray-200'
                            }`}
                          >
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Task"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-800 font-medium">
              Are you sure you want to delete "<strong>{currentTask.title}</strong>"?
            </p>
            <p className="text-sm text-red-700 mt-2">
              This action cannot be undone. All task data will be permanently removed.
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete Task
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};