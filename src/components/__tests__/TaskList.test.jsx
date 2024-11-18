
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContext';
import TaskList from '../Tasks/TaskList';


global.fetch = jest.fn();

describe('TaskList Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  it('renders task list and handles filtering', async () => {
    const mockTasks = [
      {
        _id: '1',
        title: 'Task 1',
        status: 'To Do',
        dueDate: new Date().toISOString(),
        assignedTo: { username: 'user1' }
      },
      {
        _id: '2',
        title: 'Task 2',
        status: 'Done',
        dueDate: new Date().toISOString(),
        assignedTo: { username: 'user2' }
      }
    ];

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true
        json: () => Promise.resolve(mockTasks)
      })
    );

    render(
      <AuthProvider>
        <TaskList />
      </AuthProvider>
    );


    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });


    fireEvent.change(screen.getByRole('combobox', { name: /status/i }), {
      target: { value: 'Done' }
    });

    await waitFor(() => {
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  it('handles task creation', async () => {
    const newTask = {
      _id: '3',
      title: 'New Task',
      status: 'To Do',
      dueDate: new Date().toISOString(),
      assignedTo: { username: 'user1' }
    };

    fetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(newTask)
      }));

    render(
      <AuthProvider>
        <TaskList />
      </AuthProvider>
    );


    fireEvent.click(screen.getByText('New Task'));


    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'New Task' }
    });


    fireEvent.click(screen.getByText('Create Task'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});