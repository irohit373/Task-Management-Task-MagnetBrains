import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { Menu } from '@headlessui/react';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-primary-600">
              TaskManager
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/tasks"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Tasks
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/users"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Users
              </Link>
            )}

            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                <UserCircleIcon className="h-8 w-8" />
                <span className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};