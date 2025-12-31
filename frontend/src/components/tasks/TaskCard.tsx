 import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Task } from '../../types/task.types';
import { PRIORITY_COLORS, STATUS_COLORS } from '../../utils/constants';
import { formatDate, getDueDateLabel } from '../../utils/formatDate';
import {
  CalendarIcon,
  UserIcon,
  ClockIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, status: string) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/tasks/${task._id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (onDelete) {
      await onDelete(task._id);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <Link
        to={`/tasks/${task._id}`}
        className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 relative group"
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2">
            {task.title}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border ${
                PRIORITY_COLORS[task.priority]
              }`}
            >
              {task.priority}
            </span>
            <button
              onClick={handleEditClick}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              title="Edit task"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Delete task"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{getDueDateLabel(task.dueDate)}</span>
          </div>

          {task.assignedTo && (
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              <span>
                {task.assignedTo.firstName} {task.assignedTo.lastName}
              </span>
            </div>
          )}

          <span
            className={`px-2 py-1 text-xs font-medium rounded border ${
              STATUS_COLORS[task.status]
            }`}
          >
            {task.status.replace('_', ' ')}
          </span>
        </div>
      </Link>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
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
                  Are you sure you want to delete "<strong>{task.title}</strong>"?
                </p>
                <p className="text-sm text-red-700 mt-2">
                  This action cannot be undone. All task data will be permanently removed.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete Task
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};