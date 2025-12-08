'use client';

import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { TaskFilters, SortOption, SortDirection } from '@/types/store';
import { useBoardStore } from '@/store/boards';
import { useTagStore } from '@/store/tags';
import { Input, Button } from '@/components/ui';
import { useDebounce } from '@/hooks/useDebounce';

const SearchContainer = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border.main};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SearchRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DateInput = styled(Input)`
  width: 100%;
`;

const TagSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  cursor: pointer;
  transition: border-color 0.2s;
  height: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

interface TaskSearchProps {
  onFiltersChange: (filters: TaskFilters) => void;
  initialFilters?: TaskFilters;
}

const TaskSearch = ({ onFiltersChange, initialFilters = {} }: TaskSearchProps) => {
  const boardsData = useBoardStore((state) => state.boards);
  const boards = useMemo(() => {
    const { byId, allIds } = boardsData;
    return allIds.map((id) => byId[id]);
  }, [boardsData]);
  const tags = useTagStore((state) => state.tags);

  const [filters, setFilters] = useState<TaskFilters>(initialFilters);
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery || '');
  
  // Debounce search query to avoid excessive filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Update filters when debounced search changes
  useEffect(() => {
    const newFilters = { ...filters, searchQuery: debouncedSearchQuery || undefined };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  }, [debouncedSearchQuery]);

  const handleFilterChange = (key: keyof TaskFilters, value: unknown) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    const newDateRange = {
      ...filters.dueDateRange,
      [type]: value || undefined,
    };
    handleFilterChange('dueDateRange', newDateRange);
  };

  const handleTagsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions);
    const selectedTagIds = selectedOptions.map((option) => option.value);
    handleFilterChange('tagIds', selectedTagIds.length > 0 ? selectedTagIds : undefined);
  };

  const handleClearFilters = () => {
    const clearedFilters: TaskFilters = {
      sortBy: 'createdAt',
      sortDirection: 'desc',
    };
    setSearchQuery('');
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <SearchContainer>
      <SearchRow>
        <FilterGroup style={{ flex: 2 }}>
          <Label>Buscar tareas</Label>
          <Input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </FilterGroup>
      </SearchRow>

      <SearchRow>
        <FilterGroup>
          <Label>Board</Label>
          <Select
            value={filters.boardId || ''}
            onChange={(e) => handleFilterChange('boardId', e.target.value || undefined)}
          >
            <option value="">Todos los boards</option>
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Prioridad</Label>
          <Select
            value={filters.priority || ''}
            onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
          >
            <option value="">Todas las prioridades</option>
            <option value="urgent">Urgente</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Ordenar por</Label>
          <Select
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value as SortOption)}
          >
            <option value="createdAt">Fecha de creación</option>
            <option value="dueDate">Fecha de vencimiento</option>
            <option value="priority">Prioridad</option>
            <option value="title">Título</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Dirección</Label>
          <Select
            value={filters.sortDirection || 'desc'}
            onChange={(e) => handleFilterChange('sortDirection', e.target.value as SortDirection)}
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </Select>
        </FilterGroup>
      </SearchRow>

      <SearchRow>
        <FilterGroup>
          <Label>Etiquetas (mantén Ctrl/Cmd para múltiple selección)</Label>
          <TagSelect
            multiple
            value={filters.tagIds || []}
            onChange={handleTagsChange}
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </TagSelect>
        </FilterGroup>

        <FilterGroup>
          <Label>Fecha desde</Label>
          <DateInput
            type="date"
            value={filters.dueDateRange?.start || ''}
            onChange={(e) => handleDateRangeChange('start', e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <Label>Fecha hasta</Label>
          <DateInput
            type="date"
            value={filters.dueDateRange?.end || ''}
            onChange={(e) => handleDateRangeChange('end', e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <Label>Asignado a</Label>
          <Select
            value={filters.assigneeId || ''}
            onChange={(e) => handleFilterChange('assigneeId', e.target.value || undefined)}
            disabled
            title="Funcionalidad preparada para multi-usuario"
          >
            <option value="">Todos los usuarios</option>
          </Select>
        </FilterGroup>
      </SearchRow>

      <ButtonGroup>
        <Button variant="secondary" onClick={handleClearFilters}>
          Limpiar filtros
        </Button>
      </ButtonGroup>
    </SearchContainer>
  );
};

export default TaskSearch;
