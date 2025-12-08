'use client';

import { useEffect, useRef, memo } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import styled from 'styled-components';
import { ActivityData } from '@/types/charts';

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

export interface ActivityChartProps {
  data: ActivityData[];
}

export const ActivityChart = memo(function ActivityChart({ data }: ActivityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: data.map((d) => d.date),
        datasets: [
          {
            label: 'Tareas Creadas',
            data: data.map((d) => d.created),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
          },
          {
            label: 'Tareas Completadas',
            data: data.map((d) => d.completed),
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
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
                const label = context.dataset.label || '';
                const value = context.parsed.y || 0;
                return `${label}: ${value}`;
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
  }, [data]);

  return (
    <ChartContainer>
      <ChartTitle>Tareas Completadas - Últimos 7 Días</ChartTitle>
      <CanvasWrapper>
        <canvas ref={canvasRef}></canvas>
      </CanvasWrapper>
    </ChartContainer>
  );
});
