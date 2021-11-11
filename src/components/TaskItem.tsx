import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { Task } from '../contexts/TaskProvider';
import { useTask } from '../hooks/useTask';

import trashIcon from '../assets/icons/trash/trash.png'

interface TaskItemProps {
    item: Task;
    index: number;
}

export function TaskItem({ item, index }: TaskItemProps) {
    const { 
        handleEditTask, 
        handleToggleTaskDone, 
        handleRemoveTask 
    } = useTask();

    const [isTaskEditing, setIsTaskEditing] = useState(false);
    const [taskEditedTitle, setTaskEditedTitle] = useState(item.title);

    const textInputRef = useRef<TextInput>(null);

    function handleStartEditing() {
        setIsTaskEditing(true);
    }

    function handleCancelEditing() {
        setTaskEditedTitle(item.title);
        setIsTaskEditing(false);
    }

    function handleSubmitEditing() {
        handleEditTask(item.id, taskEditedTitle);
        setIsTaskEditing(false);
    }

    useEffect(() => {
        if (isTaskEditing) {
            textInputRef.current?.focus();
        } else {
            textInputRef.current?.blur();
        }
    }, [isTaskEditing]);

    return (
        <>
            <View>
                <TouchableOpacity
                    testID={`button-${index}`}
                    activeOpacity={0.7}
                    style={styles.taskButton}
                    onPress={() => handleToggleTaskDone(item.id)}
                >
                    <View
                        testID={`marker-${index}`}
                        style={item.done ? styles.taskMarkerDone : styles.taskMarker}
                    >
                        {item.done && (
                            <Icon
                                name="check"
                                size={12}
                                color="#FFF"
                            />
                        )}
                    </View>

                    <TextInput
                        style={item.done ? styles.taskTextDone : styles.taskText}
                        value={taskEditedTitle}
                        onChangeText={setTaskEditedTitle}
                        editable={isTaskEditing}
                        onSubmitEditing={handleSubmitEditing}
                        ref={textInputRef}
                    />
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row' }}>
                {isTaskEditing ? (
                    <TouchableOpacity style={styles.taskEditButton} onPress={handleCancelEditing}>
                        <Icon name="x" size={16} color="#B2B2B2" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.taskEditButton} onPress={handleStartEditing}>
                        <Icon name="edit-3" size={16} color="#B2B2B2" />
                    </TouchableOpacity>
                )}

                <View style={{ 
                    width: 1,
                    height: 24,
                    backgroundColor: 'rgba(196, 196, 196, 0.24)'
                }} />

                <TouchableOpacity
                    testID={`trash-${index}`}
                    style={isTaskEditing ? styles.taskTrashButtonDisabled : styles.taskTrashButton}
                    onPress={() => handleRemoveTask(item.id)}
                    disabled={isTaskEditing}
                >
                    <Image source={trashIcon} />
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    taskButton: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 15,
        marginBottom: 4,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center'
    },
    taskMarker: {
        height: 16,
        width: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#B2B2B2',
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    taskText: {
        color: '#666',
        fontFamily: 'Inter-Medium'
    },
    taskMarkerDone: {
        height: 16,
        width: 16,
        borderRadius: 4,
        backgroundColor: '#1DB863',
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    taskTextDone: {
        color: '#1DB863',
        textDecorationLine: 'line-through',
        fontFamily: 'Inter-Medium'
    },
    taskEditButton: {
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    taskTrashButton: {
        paddingHorizontal: 24, 
        opacity: 1
    },
    taskTrashButtonDisabled: {
        paddingHorizontal: 24, 
        opacity: 0.2
    }
})