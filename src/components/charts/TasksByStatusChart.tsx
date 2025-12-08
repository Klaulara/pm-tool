'use client';

import { useEffect, useRef, memo } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import styled from 'styled-components';
import { StatusData } from '@/types/charts';

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

interface TasksByStatusChartProps {
  data: StatusData[];
}

export const TasksByStatusChart = memo(function TasksByStatusChart({ data }: TasksByStatusChartProps) {
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
      type: 'pie',
      data: {
        labels: data.map((d) => d.status),
        datasets: [
          {
            data: data.map((d) => d.count),
            backgroundColor: data.map((d) => d.color + 'CC'), // Add transparency
            borderColor: data.map((d) => d.color),
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
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
  }, [data]);

  return (
    <ChartContainer>
      <ChartTitle>Tareas por Estado</ChartTitle>
      <CanvasWrapper>
        <canvas ref={canvasRef}></canvas>
      </CanvasWrapper>
    </ChartContainer>
  );
});
