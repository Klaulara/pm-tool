'use client';

import styled from 'styled-components';

const MetricsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const MetricsTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const MetricItem = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const MetricValue = styled.div<{ $color?: string }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ $color, theme }) => $color || theme.colors.primary.main};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MetricLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

interface ProductivityMetricsProps {
  completedToday: number;
  completedThisWeek: number;
  averagePerDay: number;
  overdueTasks: number;
  velocity?: number; // Tasks completed per week
}

export function ProductivityMetrics({
  completedToday,
  completedThisWeek,
  averagePerDay,
  overdueTasks,
  velocity,
}: ProductivityMetricsProps) {
  return (
    <MetricsContainer>
      <MetricsTitle>Métricas de Productividad</MetricsTitle>
      <MetricsGrid>
        <MetricItem>
          <MetricValue $color="#10B981">{completedToday}</MetricValue>
          <MetricLabel>Completadas Hoy</MetricLabel>
        </MetricItem>
        <MetricItem>
          <MetricValue $color="#3B82F6">{completedThisWeek}</MetricValue>
          <MetricLabel>Esta Semana</MetricLabel>
        </MetricItem>
        <MetricItem>
          <MetricValue $color="#8B5CF6">{averagePerDay.toFixed(1)}</MetricValue>
          <MetricLabel>Promedio/Día</MetricLabel>
        </MetricItem>
        <MetricItem>
          <MetricValue $color="#EF4444">{overdueTasks}</MetricValue>
          <MetricLabel>Vencidas</MetricLabel>
        </MetricItem>
        {velocity !== undefined && (
          <MetricItem>
            <MetricValue $color="#F59E0B">{velocity.toFixed(1)}</MetricValue>
            <MetricLabel>Velocidad/Semana</MetricLabel>
          </MetricItem>
        )}
      </MetricsGrid>
    </MetricsContainer>
  );
}
