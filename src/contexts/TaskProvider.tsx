import React, { createContext, ReactNode, useState } from 'react';
import { Alert } from 'react-native';

export interface Task {
    id: number;
    title: string;
    done: boolean;
}

type TaskProviderData = {
    tasks: Task[];
    handleAddTask: (newTaskTitle: string) => void;
    handleToggleTaskDone: (id: number) => void;
    handleEditTask: (id: number, newTitle: string) => void;
    handleRemoveTask: (id: number) => void;
}

export const TaskContext = createContext({} as TaskProviderData);

interface TaskProviderProps {
    children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
    const [tasks, setTasks] = useState<Task[]>([]);

    function handleAddTask(newTaskTitle: string) {
        const taskAlreadyExists = tasks.find(task => task.title === newTaskTitle);
        if (taskAlreadyExists) {
            Alert.alert('Task já cadastrada', 'Você não pode cadastrar uma task com o mesmo nome');
            return;
        }

        const task = {
            id: new Date().getTime(),
            title: newTaskTitle,
            done: false,
        }

        setTasks(oldState => [...oldState, task]);
    }

    function handleToggleTaskDone(id: number) {
        let allTasks = tasks.map(task => ({ ...task }));

        const task = allTasks.find(task => task.id === id);

        if (task) {
            allTasks = allTasks.filter(task => task.id !== id);

            const done = task.done;
            task.done = !done;

            const updatedTasks = [...allTasks, task];
            setTasks(updatedTasks);
        }
    }

    function handleEditTask(id: number, newTitle: string) {
        let allTasks = tasks.map(task => ({ ...task }));

        const task = allTasks.find(task => task.id === id);
        if (task) {
            allTasks = allTasks.filter(task => task.id !== id);

            task.title = newTitle;

            const updatedTasks = [...allTasks, task];
            setTasks(updatedTasks);
        }
    }

    function handleRemoveTask(id: number) {
        Alert.alert('Remover item', 'Tem certeza que você deseja remover esse item?', [
            {
                text: 'Não',
                onPress: () => {
                    return;
                }
            },
            {
                text: 'Sim',
                onPress: () => {
                    const updatedTasks = tasks.filter(task => task.id !== id);
                    setTasks(updatedTasks);
                }
            }
        ]);
    }

    return (
        <TaskContext.Provider value={{
            tasks,
            handleAddTask,
            handleToggleTaskDone,
            handleEditTask,
            handleRemoveTask
        }}>
            {children}
        </TaskContext.Provider>
    );
}