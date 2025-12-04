'use client';

import styled from 'styled-components';
import { useState, use } from 'react';
import { useBoardStore, type Task } from '@/store/boardStore';
import { HeaderBoards } from '@/components/HeaderBoards';
import { KanbanColumn } from '@/components/KanbanColumn';
import { TaskCardOverlay } from '@/components/TaskCard';
import {
    DndContext,
    DragOverlay,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Container } from '@/components/ui';
import CreateTaskModal from '../../../components/modals/CreateTaskModal';
import BoardConfigurationModal from '../../../components/modals/BoardConfigurationModal';
import AddColumnButton from '@/components/AddColumnButton';
import CreateColumnModal from '@/components/modals/CreateColumnModal';

// Styled Components
const BoardMain = styled.main`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  min-height: calc(100vh - 120px);
  background-color: ${({ theme }) => theme.colors.background.secondary};
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    height: 12px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.tertiary};
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[400]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    
    &:hover {
      background: ${({ theme }) => theme.colors.neutral[500]};
    }
  }
`;

const KanbanContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
`;

// Types
interface Column {
    id: string;
    title: string;
    status: 'todo' | 'inProgress' | 'review' | 'done';
    color: string;
    tasks: Task[];
}

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: boardId } = use(params);

    // Get data from Zustand store - subscribe to changes
    const allTasks = useBoardStore((state) => state.tasks);
    const allColumns = useBoardStore((state) => state.columns);
    const moveTask = useBoardStore((state) => state.moveTask);
    const reorderColumns = useBoardStore((state) => state.reorderColumns);
    const board = useBoardStore((state) => state.getBoardById(boardId));

    // Filter and sort data for this board
    const tasks = allTasks.filter((task) => task.boardId === boardId);
    const storeColumns = allColumns
        .filter((col) => col.boardId === boardId)
        .sort((a, b) => a.order - b.order);

    const columns: Column[] = storeColumns.map((col) => ({
        id: col.id,
        title: col.title,
        status: col.status as 'todo' | 'inProgress' | 'review' | 'done',
        color: col.color,
        tasks: tasks.filter((task) => task.status === col.status),
    }));

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedColumnStatus, setSelectedColumnStatus] = useState<'todo' | 'inProgress' | 'review' | 'done'>('todo');
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<'medium' | 'low' | 'high' | 'urgent'>('low');
    const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [boardConfigurationModalOpen, setBoardConfigurationModalOpen] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');
    const [newBoardDescription, setNewBoardDescription] = useState('');
    const [isCreateColumnModalOpen, setIsCreateColumnModalOpen] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');
    const [newColumnColor, setNewColumnColor] = useState('#000000');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;

        // Check if dragging a task
        const task = tasks.find((t) => t.id === active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Check if we're dragging a task
        const activeTask = tasks.find((t) => t.id === activeId);

        if (activeTask) {
            // Find source column
            const activeColumn = columns.find((col) =>
                col.tasks.some((task) => task.id === activeId)
            );

            if (!activeColumn) return;

            // Check if dropping over a column or a task
            let targetColumn = columns.find((col) => col.id === overId);

            // If not dropping over a column, check if dropping over a task
            if (!targetColumn) {
                targetColumn = columns.find((col) =>
                    col.tasks.some((task) => task.id === overId)
                );
            }

            if (!targetColumn || activeColumn.id === targetColumn.id) return;

            // Use Zustand store to move task
            moveTask(activeId, targetColumn.status);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveTask(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Check if we're reordering columns
        const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
        const overColumnIndex = columns.findIndex((col) => col.id === overId);

        if (activeColumnIndex !== -1 && overColumnIndex !== -1 && activeColumnIndex !== overColumnIndex) {
            const columnIds = columns.map(col => col.id);
            const newColumnOrder = arrayMove(columnIds, activeColumnIndex, overColumnIndex);
            reorderColumns(boardId, newColumnOrder);
        }
    };

    const handleCreateTask = () => {
        if (!newTaskName.trim()) return;

        // Ajustar la fecha para evitar problemas de zona horaria
        let adjustedDueDate = newTaskDueDate;
        if (newTaskDueDate) {
            const date = new Date(newTaskDueDate);
            // Agregar el offset de zona horaria para mantener la fecha local
            const offset = date.getTimezoneOffset();
            date.setMinutes(date.getMinutes() + offset);
            adjustedDueDate = date.toISOString();
        }

        useBoardStore.getState().addTask({
            boardId: boardId,
            title: newTaskName,
            description: newTaskDescription,
            status: selectedColumnStatus,
            dueDate: adjustedDueDate,
            priority: newTaskPriority,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            subTasks: [],
        });
        setIsCreateModalOpen(false);
        setNewTaskName('');
        setNewTaskDescription('');
        setNewTaskPriority('low');
        setNewTaskDueDate('');
    };

    const handleOpenCreateModal = (columnStatus?: 'todo' | 'inProgress' | 'review' | 'done') => {
        setSelectedColumnStatus(columnStatus || 'todo');
        setIsCreateModalOpen(true);
    };

    const handleEditBoard = () => {
        if (!newBoardName.trim()) return;
        useBoardStore.getState().updateBoard(boardId, {
            name: newBoardName,
            description: newBoardDescription,
        });
        setBoardConfigurationModalOpen(false);
        setNewBoardName('');
        setNewBoardDescription('');
    };

    const handleColumnCreate = () => {
        if (!newColumnName.trim()) return;
        useBoardStore.getState().addColumn({
            boardId: boardId,
            title: newColumnName,
            color: newColumnColor,
            status: newColumnName.toLowerCase().replace(/\s+/g, '-'),
            isFixed: false,
        });
        setIsCreateModalOpen(false);
        setNewColumnName('');
        setNewColumnColor('');
    };  

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <HeaderBoards
                    board={board}
                    setIsCreateModalOpen={() => handleOpenCreateModal()}
                    setBoardConfigurationModalOpen={setBoardConfigurationModalOpen}
                />

                <BoardMain>
                    <Container maxWidth="full">
                        <SortableContext
                            items={columns.map((col) => col.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <KanbanContainer>
                                {columns.map((column) => (
                                    <KanbanColumn
                                        key={column.id}
                                        id={column.id}
                                        title={column.title}
                                        color={column.color}
                                        tasks={column.tasks}
                                        onAddTask={() => handleOpenCreateModal(column.status)}
                                    />
                                ))}
                                <AddColumnButton onAddColumn={() => setIsCreateColumnModalOpen(true)} />
                            </KanbanContainer>
                        </SortableContext>
                    </Container>
                </BoardMain>

                <DragOverlay>
                    {activeTask ? <TaskCardOverlay task={activeTask} /> : null}
                </DragOverlay>
            </DndContext>

            {isCreateModalOpen && (
                <CreateTaskModal
                    isCreateModalOpen={isCreateModalOpen}
                    setIsCreateModalOpen={setIsCreateModalOpen}
                    newTaskName={newTaskName}
                    setNewTaskName={setNewTaskName}
                    newTaskDescription={newTaskDescription}
                    setNewTaskDescription={setNewTaskDescription}
                    newTaskPriority={newTaskPriority}
                    setNewTaskPriority={(priority) => setNewTaskPriority(priority as 'medium' | 'low' | 'high' | 'urgent')}
                    newTaskDueDate={newTaskDueDate}
                    setNewTaskDueDate={setNewTaskDueDate}
                    handleCreateTask={handleCreateTask}
                />
            )}

            {boardConfigurationModalOpen && (
                <BoardConfigurationModal
                    isCreateModalOpen={boardConfigurationModalOpen}
                    setIsCreateModalOpen={setBoardConfigurationModalOpen}
                    newBoardName={newBoardName}
                    setNewBoardName={setNewBoardName}
                    newBoardDescription={newBoardDescription}
                    setNewBoardDescription={setNewBoardDescription}
                    handleEditBoard={handleEditBoard}
                />
            )}

            {isCreateColumnModalOpen && (
                <CreateColumnModal
                    isCreateModalOpen={isCreateColumnModalOpen}
                    setIsCreateModalOpen={setIsCreateColumnModalOpen}
                    newColumnName={newColumnName}
                    setNewColumnName={setNewColumnName}
                    newColumnColor={newColumnColor}
                    setNewColumnColor={setNewColumnColor}
                    handleColumnCreate={handleColumnCreate}
                />
            )}
        </>
    );
}
