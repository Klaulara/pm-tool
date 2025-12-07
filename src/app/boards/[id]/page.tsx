'use client';

import styled from 'styled-components';
import { useState, use, useEffect } from 'react';
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
import { ManageTagsModal } from '@/components/modals/ManageTagsModal';
import { DeleteBoardModal } from '@/components/modals/DeleteBoardModal';
import AddColumnButton from '@/components/AddColumnButton';
import CreateColumnModal from '@/components/modals/CreateColumnModal';

// Styled Components
const BoardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const BoardMain = styled.main`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  display: flex;
  overflow-x: auto;
  overflow-y: auto;
  scroll-behavior: smooth;
  
  &::-webkit-scrollbar {
    height: 12px;
    width: 12px;
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
  min-height: 100%;
`;

// Types
interface Column {
    id: string;
    title: string;
    status: 'todo' | 'inProgress' | 'review' | 'done';
    color: string;
    tasks: Task[];
    isFixed: boolean;
}

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: boardId } = use(params);

    // Get data from Zustand store - subscribe to changes
    const allTasks = useBoardStore((state) => state.tasks);
    const allColumns = useBoardStore((state) => state.columns);
    const allTags = useBoardStore((state) => state.tags);
    const moveTask = useBoardStore((state) => state.moveTask);
    const reorderColumns = useBoardStore((state) => state.reorderColumns);
    const updateColumn = useBoardStore((state) => state.updateColumn);
    const deleteColumn = useBoardStore((state) => state.deleteColumn);
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
        isFixed: col.isFixed,
    }));

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedColumnStatus, setSelectedColumnStatus] = useState<'todo' | 'inProgress' | 'review' | 'done'>('todo');
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<'medium' | 'low' | 'high' | 'urgent'>('low');
    const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<typeof allTags>([]);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [boardConfigurationModalOpen, setBoardConfigurationModalOpen] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');
    const [newBoardDescription, setNewBoardDescription] = useState('');
    const [isBoardStarred, setIsBoardStarred] = useState(false);
    const [isCreateColumnModalOpen, setIsCreateColumnModalOpen] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');
    const [newColumnColor, setNewColumnColor] = useState('#000000');
    const [isManageTagsModalOpen, setIsManageTagsModalOpen] = useState(false);
    const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Initialize board configuration when modal opens
    useEffect(() => {
        if (boardConfigurationModalOpen && board) {
            // Use setState callback pattern to avoid cascading renders
            Promise.resolve().then(() => {
                setNewBoardName(board.name);
                setNewBoardDescription(board.description || '');
                setIsBoardStarred(board.isStarred || false);
            });
        }
    }, [boardConfigurationModalOpen, board]);

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

    const handleCreateTask = (createAnother: boolean = false) => {
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

        const now = new Date().toISOString();

        useBoardStore.getState().addTask({
            boardId: boardId,
            title: newTaskName,
            description: newTaskDescription,
            status: selectedColumnStatus,
            dueDate: adjustedDueDate,
            priority: newTaskPriority,
            tags: selectedTags,
            createdAt: now,
            updatedAt: now,
            subTasks: [],
            statusHistory: [{ status: selectedColumnStatus, timestamp: now }],
        });
        
        // Reset form
        setNewTaskName('');
        setNewTaskDescription('');
        setNewTaskPriority('low');
        setNewTaskDueDate('');
        setSelectedTags([]);
        
        // Close modal only if not creating another
        if (!createAnother) {
            setIsCreateModalOpen(false);
        }
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
            isStarred: isBoardStarred,
        });
        setBoardConfigurationModalOpen(false);
        setNewBoardName('');
        setNewBoardDescription('');
        setIsBoardStarred(false);
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
        setIsCreateColumnModalOpen(false);
        setNewColumnName('');
        setNewColumnColor('');
    };

    const handleEditColumn = (columnId: string, newTitle: string) => {
        updateColumn(columnId, { title: newTitle });
    };

    const handleDeleteColumn = (columnId: string) => {
        deleteColumn(columnId);
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
                <BoardWrapper>
                    <HeaderBoards
                        board={board}
                        setIsCreateModalOpen={() => handleOpenCreateModal()}
                        setBoardConfigurationModalOpen={setBoardConfigurationModalOpen}
                        setIsManageTagsModalOpen={setIsManageTagsModalOpen}
                        setIsDeleteBoardModalOpen={setIsDeleteBoardModalOpen}
                    />

                    <BoardMain>
                        <Container $maxWidth="full">
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
                                        isFixed={column.isFixed}
                                        onAddTask={() => handleOpenCreateModal(column.status)}
                                        onEditColumn={handleEditColumn}
                                        onDeleteColumn={handleDeleteColumn}
                                    />
                                ))}
                                <AddColumnButton onAddColumn={() => setIsCreateColumnModalOpen(true)} />
                            </KanbanContainer>
                        </SortableContext>
                    </Container>
                </BoardMain>
                </BoardWrapper>

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
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    availableTags={allTags}
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
                    isStarred={isBoardStarred}
                    setIsStarred={setIsBoardStarred}
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

            {isManageTagsModalOpen && (
                <ManageTagsModal
                    isOpen={isManageTagsModalOpen}
                    onClose={() => setIsManageTagsModalOpen(false)}
                />
            )}

            {isDeleteBoardModalOpen && board && (
                <DeleteBoardModal
                    isOpen={isDeleteBoardModalOpen}
                    onClose={() => setIsDeleteBoardModalOpen(false)}
                    boardId={boardId}
                    boardName={board.name}
                />
            )}
        </>
    );
}
