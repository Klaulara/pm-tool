'use client';

import { useRouter } from 'next/navigation';
import { useBoardStore } from '@/store/boards';
import { useState, useMemo } from 'react';
import SearchBar from '@/components/SearchBar';
import { Container, Grid } from '@/components/ui';
import styled from 'styled-components';
import BoardCardComponent from '@/components/BoardCard';
import Header from '@/components/Header';
import CreateBoard from '@/components/CreateBoard';
import CreateBoardModal from '@/components/modals/CreateBoardModal';
import type { Board } from '@/types/store';

const Main = styled.main`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  min-height: calc(100vh - 200px);
`;

const BoardsPage = () => {
    const router = useRouter();
    const boardsData = useBoardStore((state) => state.boards);
    const boards = useMemo(() => {
        const { byId, allIds } = boardsData;
        return allIds.map((id) => byId[id]);
    }, [boardsData]);
    const addBoard = useBoardStore((state) => state.addBoard);

    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');
    const [newBoardDescription, setNewBoardDescription] = useState('');

    const filteredBoards = boards.filter(
        (board: Board) =>
            board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            board.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getCompletionPercentage = (board: Board) => {
        if (board.tasksCount.total === 0) return 0;
        return Math.round((board.tasksCount.completed / board.tasksCount.total) * 100);
    };

    const handleCreateBoard = () => {
        if (!newBoardName.trim()) return;

        addBoard({
            name: newBoardName,
            description: newBoardDescription,
            tasksCount: {
                total: 0,
                completed: 0,
                inProgress: 0,
            },
            isStarred: false,
        });

        setIsCreateModalOpen(false);
        setNewBoardName('');
        setNewBoardDescription('');
    };


    return (
        <>
            <Header />
            <Main>
                <Container>
                    <div>
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            setIsCreateModalOpen={setIsCreateModalOpen}
                        />

                        <Grid columns={3} responsive gap="lg">
                            {/* Create Board Card */}
                            <div>
                                <CreateBoard setIsCreateModalOpen={setIsCreateModalOpen} />
                            </div>

                            {/* Board Cards */}
                            {filteredBoards.map((board: Board) => (
                                <div key={board.id}>
                                    <BoardCardComponent
                                        board={board}
                                        handleBoardClick={(id) => router.push(`/boards/${id}`)}
                                        getCompletionPercentage={getCompletionPercentage}
                                    />
                                </div>
                            ))}
                        </Grid>

                        {filteredBoards.length === 0 && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '64px 24px',
                                    color: 'var(--text-tertiary)',
                                }}
                            >
                                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
                                <h3>No se encontraron tableros</h3>
                                <p>Intenta con otra búsqueda o crea un nuevo tablero</p>
                            </div>
                        )}
                    </div>
                </Container>
            </Main>

            {/* Create Board Modal */}
            {isCreateModalOpen && (
                <CreateBoardModal
                    isCreateModalOpen={isCreateModalOpen}
                    setIsCreateModalOpen={setIsCreateModalOpen}
                    newBoardName={newBoardName}
                    setNewBoardName={setNewBoardName}
                    newBoardDescription={newBoardDescription}
                    setNewBoardDescription={setNewBoardDescription}
                    handleCreateBoard={handleCreateBoard}
                />
            )}
        </>
    )
}

export default BoardsPage