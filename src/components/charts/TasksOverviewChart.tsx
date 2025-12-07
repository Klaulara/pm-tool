'use client';

import { useEffect, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import styled from 'styled-components';

const ChartContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  height: 100%;
`;

const ChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CanvasWrapper = styled.div`
  position: relative;
  height: 300px;
`;

interface TasksOverviewChartProps {
  total: number;
  completed: number;
  inProgress: number;
}

export function TasksOverviewChart({ total, completed, inProgress }: TasksOverviewChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy previous chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const todo = total - completed - inProgress;

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['Por Hacer', 'En Progreso', 'Completadas'],
        datasets: [
          {
            data: [todo, inProgress, completed],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)', // Blue for todo
              'rgba(245, 158, 11, 0.8)', // Orange for in progress
              'rgba(16, 185, 129, 0.8)', // Green for completed
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(16, 185, 129, 1)',
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
      },
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [total, completed, inProgress]);

  return (
    <ChartContainer>
      <ChartTitle>Resumen de Tareas</ChartTitle>
      <CanvasWrapper>
        <canvas ref={canvasRef}></canvas>
      </CanvasWrapper>
    </ChartContainer>
  );
}
