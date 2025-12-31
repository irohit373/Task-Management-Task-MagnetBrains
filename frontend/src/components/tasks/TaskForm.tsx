import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { userApi } from '../../api/userApi';
import type { Task } from '../../types/task.types';
import type { User } from '../../types/user.types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(2000),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
  assignedTo: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  loading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, loading }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate.split('T')[0],
          priority: task.priority,
          status: task.status,
          assignedTo: task.assignedTo?._id || '',
        }
      : {
          priority: 'medium',
          status: 'pending',
          assignedTo: '',
        },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await userApi.getUsers({ limit: 100 });
        setUsers(response.data?.items || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate.split('T')[0],
        priority: task.priority,
        status: task.status,
        assignedTo: task.assignedTo?._id || '',
      });
    }
  }, [task, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Title"
        {...register('title')}
        error={errors.title?.message}
        placeholder="Enter task title"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter task description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <Input
        label="Due Date"
        type="date"
        {...register('dueDate')}
        error={errors.dueDate?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          {...register('priority')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {errors.priority && (
          <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
        )}
      </div>

      {/* Assign To */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assign To
        </label>
        <select
          {...register('assignedTo')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          disabled={loadingUsers}
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.firstName} {user.lastName} ({user.email})
            </option>
          ))}
        </select>
        {loadingUsers && (
          <p className="mt-1 text-sm text-gray-500">Loading users...</p>
        )}
      </div>

      {task && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button type="submit" loading={loading}>
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};