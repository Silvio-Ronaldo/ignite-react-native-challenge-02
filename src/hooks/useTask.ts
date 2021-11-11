import { useContext } from 'react';

import { TaskContext } from '../contexts/TaskProvider';

export function useTask() { 
    return useContext(TaskContext);
}