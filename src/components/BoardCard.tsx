import React, { memo } from 'react';
import { Flex, CardHeader, CardTitle, CardDescription, CardFooter, CardContent, Card, Badge } from './ui';
import styled from 'styled-components';
import { Board } from '@/types/store';

const BoardCard = styled(Card)`
  cursor: pointer;
  transition: all ${({ theme }) => `${theme.transitions.duration.normal} ${theme.transitions.easing.smooth}`};
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
`;

const BoardStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

interface BoardCardProps {
    board: Board;
    handleBoardClick: (id: string) => void;
    getCompletionPercentage: (board: Board) => number;
}

const BoardCardComponent = memo(function BoardCardComponent({ board, handleBoardClick, getCompletionPercentage }: BoardCardProps) {

    return (
        <BoardCard
            $hoverable
            padding="md"
            onClick={() => handleBoardClick(board.id)}
        >
            <CardHeader style={{ borderBottom: 'none', padding: '0 0 12px 0' }}>
                <Flex justify="between" align="start">
                    {board.isStarred && (
                        <Badge variant="warning" size="sm">
                            ⭐ Favorito
                        </Badge>
                    )}
                </Flex>
                <CardTitle style={{ marginBottom: '4px' }}>{board.name}</CardTitle>
                <CardDescription>{board.description}</CardDescription>
            </CardHeader>

            <CardContent style={{ flex: 1, padding: 0 }}>
                <BoardStats>
                    <StatItem>
                        <StatLabel>Total</StatLabel>
                        <StatValue>{board.tasksCount.total}</StatValue>
                    </StatItem>
                    <StatItem>
                        <StatLabel>Progreso</StatLabel>
                        <StatValue>{board.tasksCount.inProgress}</StatValue>
                    </StatItem>
                    <StatItem>
                        <StatLabel>Completadas</StatLabel>
                        <StatValue style={{ color: '#10B981' }}>
                            {board.tasksCount.completed}
                        </StatValue>
                    </StatItem>
                </BoardStats>

                <div style={{ marginTop: '12px' }}>
                    <Flex justify="between" align="center" style={{ marginBottom: '6px' }}>
                        <span
                            style={{
                                fontSize: '11px',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            Progreso
                        </span>
                        <span
                            style={{
                                fontSize: '13px',
                                fontWeight: 600,
                            }}
                        >
                            {getCompletionPercentage(board)}%
                        </span>
                    </Flex>
                    <div
                        style={{
                            height: '6px',
                            borderRadius: '999px',
                            backgroundColor: 'var(--neutral-200)',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                height: '100%',
                                width: `${getCompletionPercentage(board)}%`,
                                background: 'linear-gradient(90deg, #3B82F6, #3B82F6dd)',
                                transition: 'width 0.3s ease',
                                borderRadius: '999px',
                            }}
                        />
                    </div>
                </div>
            </CardContent>

            <CardFooter style={{ padding: '12px 0 0 0' }}>
                <Flex justify="between" align="center" style={{ width: '100%' }}>
                    <Badge variant="default" size="sm">
                        📅{' '}
                        {new Date(board.lastUpdated).toLocaleDateString('es-ES', {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </Badge>
                </Flex>
            </CardFooter>
        </BoardCard>
    )
}, (prevProps, nextProps) => {
    // Only re-render if board data changed
    return (
        prevProps.board.id === nextProps.board.id &&
        prevProps.board.lastUpdated === nextProps.board.lastUpdated &&
        prevProps.board.tasksCount.total === nextProps.board.tasksCount.total &&
        prevProps.board.tasksCount.completed === nextProps.board.tasksCount.completed
    );
});

export default BoardCardComponent;