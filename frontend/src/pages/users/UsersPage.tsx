import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../store/slices/userSlice';
import { Layout } from '../../components/layout/Layout';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { PlusIcon, PencilIcon, TrashIcon, UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User } from '../../types/user.types';

const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  role: z.enum(['admin', 'user']),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

export const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.users);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'user',
      isActive: true,
    },
  });

  useEffect(() => {
    dispatch(fetchUsers({ limit: 100 }));
  }, [dispatch]);

  const handleAddUser = async (data: UserFormData) => {
    const result = await dispatch(createUser(data));
    if (createUser.fulfilled.match(result)) {
      setIsAddModalOpen(false);
      reset();
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setValue('username', user.username);
    setValue('email', user.email);
    setValue('firstName', user.firstName);
    setValue('lastName', user.lastName);
    setValue('role', user.role);
    setValue('isActive', user.isActive);
    setValue('password', '');
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (selectedUser) {
      const updateData: any = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }
      const result = await dispatch(updateUser({ id: selectedUser._id, data: updateData }));
      if (updateUser.fulfilled.match(result)) {
        setIsEditModalOpen(false);
        reset();
        setSelectedUser(null);
      }
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      await dispatch(deleteUser(selectedUser._id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const renderUserForm = (isEdit: boolean) => (
    <form onSubmit={handleSubmit(isEdit ? handleUpdateUser : handleAddUser)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          {...register('firstName')}
          error={errors.firstName?.message}
          placeholder="John"
        />
        <Input
          label="Last Name"
          {...register('lastName')}
          error={errors.lastName?.message}
          placeholder="Doe"
        />
      </div>

      <Input
        label="Username"
        {...register('username')}
        error={errors.username?.message}
        placeholder="johndoe"
      />

      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder="john@example.com"
      />

      <Input
        label={isEdit ? "Password (leave blank to keep current)" : "Password"}
        type="password"
        {...register('password')}
        error={errors.password?.message}
        placeholder="••••••••"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          {...register('role')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('isActive')}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">
          Active Account
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            isEdit ? setIsEditModalOpen(false) : setIsAddModalOpen(false);
            reset();
            setSelectedUser(null);
          }}
        >
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {isEdit ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="mt-1 text-gray-600">Manage system users and permissions</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200 hover:scale-105"
          >
            <PlusIcon className="h-5 w-5" />
            Add New User
          </button>
        </div>

        {loading && users.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-white">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            {user._id === currentUser?._id && (
                              <span className="text-xs text-blue-600 font-medium">(You)</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {user.role === 'admin' && <ShieldCheckIcon className="h-3 w-3" />}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            user.isActive
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit user"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            disabled={user._id === currentUser?._id}
                            className={`p-2 rounded-lg transition-all ${
                              user._id === currentUser?._id
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title={user._id === currentUser?._id ? "Can't delete yourself" : "Delete user"}
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
        )}
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          reset();
        }}
        title="Add New User"
        maxWidth="2xl"
      >
        {renderUserForm(false)}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          reset();
          setSelectedUser(null);
        }}
        title="Edit User"
        maxWidth="2xl"
      >
        {renderUserForm(true)}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        title="Delete User"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-800 font-medium">
              Are you sure you want to delete user "<strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>"?
            </p>
            <p className="text-sm text-red-700 mt-2">
              This action cannot be undone. The user will lose access to the system.
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};