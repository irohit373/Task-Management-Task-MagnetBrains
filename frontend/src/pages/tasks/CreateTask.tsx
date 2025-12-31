import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { createTask } from '../../store/slices/taskSlice';
import { Layout } from '../../components/layout/Layout';
import { TaskForm } from '../../components/tasks/TaskForm';
import { ArrowLeftIcon, ClipboardDocumentListIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export const CreateTask: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(createTask(data));
      if (createTask.fulfilled.match(result)) {
        navigate('/tasks');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Tasks
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <ClipboardDocumentListIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create New Task</h1>
                <p className="text-blue-100 mt-1">Fill in the details below to create a new task</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">

            <TaskForm onSubmit={handleSubmit} loading={isSubmitting} />
          </div>
        </div>
      </div>
    </Layout>
  );
};