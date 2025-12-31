import React from 'react';
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAppSelector } from '../../store/hooks';

interface TaskFiltersProps {
  filters: {
    status?: string;
    priority?: string;
    search?: string;
    assignedToMe?: boolean;
  };
  onFilterChange: (filters: any) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filters.priority || ''}
          onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <button
          onClick={() => onFilterChange({ ...filters, assignedToMe: !filters.assignedToMe })}
          className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            filters.assignedToMe
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <UserIcon className="h-4 w-4" />
          {filters.assignedToMe ? 'My Tasks' : 'Show My Tasks'}
        </button>

        <button
          onClick={() => onFilterChange({ status: '', priority: '', search: '', assignedToMe: false })}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};