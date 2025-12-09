'use client';

import { useEffect, useRef, memo } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import styled from 'styled-components';
import { PriorityData } from '@/types/charts';

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

interface PriorityChartProps {
  data: PriorityData;
}

export const PriorityChart = memo(function PriorityChart({ data }: PriorityChartProps) {
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
        labels: ['Low', 'Medium', 'High', 'Urgent'],
        datasets: [
          {
            label: 'Tasks by Priority',
            data: [data.low, data.medium, data.high, data.urgent],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)', // Blue for low
              'rgba(245, 158, 11, 0.8)', // Orange for medium
              'rgba(239, 68, 68, 0.8)', // Red for high
              'rgba(220, 38, 38, 0.8)', // Dark red for urgent
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(239, 68, 68, 1)',
              'rgba(220, 38, 38, 1)',
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.parsed.x || 0;
                return `Tareas: ${value}`;
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
      <ChartTitle>Tasks by Priority</ChartTitle>
      <CanvasWrapper>
        <canvas ref={canvasRef}></canvas>
      </CanvasWrapper>
    </ChartContainer>
  );
});
