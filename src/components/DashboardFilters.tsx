'use client';

import { memo } from 'react';
import styled from 'styled-components';
import { Input, Button } from './ui';
import { Board } from '@/types/store';

const FiltersContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FiltersTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  align-items: end;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.main}20;
  }
`;

interface DashboardFiltersProps {
  boards: Board[];
  selectedBoard: string;
  onBoardChange: (boardId: string) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onReset: () => void;
}

export const DashboardFilters = memo(function DashboardFilters({
  boards,
  selectedBoard,
  onBoardChange,
  dateRange,
  onDateRangeChange,
  onReset,
}: DashboardFiltersProps) {
  return (
    <FiltersContainer>
      <FiltersTitle>Filters</FiltersTitle>
      <FiltersGrid>
        <FilterGroup>
          <Label>Board</Label>
          <Select value={selectedBoard} onChange={(e) => onBoardChange(e.target.value)}>
            <option value="all">All Boards</option>
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))}
          </Select>
        </FilterGroup>
        <FilterGroup>
          <Label>Start Date</Label>
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, start: e.target.value })
            }
          />
        </FilterGroup>
        <FilterGroup>
          <Label>End Date</Label>
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, end: e.target.value })
            }
          />
        </FilterGroup>
        <FilterGroup>
          <Button variant="secondary" onClick={onReset}>
            Clear Filters
          </Button>
        </FilterGroup>
      </FiltersGrid>
    </FiltersContainer>
  );
});
