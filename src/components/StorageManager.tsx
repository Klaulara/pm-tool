'use client';

import { useEffect, useState } from 'react';
import { storageManager, exportAllData, importAllData } from '@/utils/storage';
import { Button } from './ui/Button';
import styled from 'styled-components';

const StorageInfoContainer = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const StorageBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.background.tertiary};
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
`;

const StorageFill = styled.div<{ percent: number; $warning?: boolean }>`
  height: 100%;
  width: ${({ percent }) => percent}%;
  background: ${({ $warning, theme }) =>
    $warning ? '#F59E0B' : theme.colors.primary.main};
  transition: width 0.3s ease;
`;

const StorageText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0.25rem 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const Toast = styled.div<{ show: boolean }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  background: #EF4444;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(${({ show }) => (show ? '0' : '100px')});
  opacity: ${({ show }) => (show ? '1' : '0')};
  transition: all 0.3s ease;
  z-index: 10000;
  max-width: 400px;
`;

interface StorageInfo {
  quota: number;
  usage: number;
  available: number;
  percentUsed: number;
}

export const StorageManager = () => {
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [showQuotaWarning, setShowQuotaWarning] = useState(false);

  const updateStorageInfo = async () => {
    const info = await storageManager.getStorageInfo();
    if (info) {
      setStorageInfo(info);
    }
  };

  useEffect(() => {
    // Schedule initial update to avoid cascading renders
    const timer = setTimeout(updateStorageInfo, 0);

    // Update every 30 seconds
    const interval = setInterval(updateStorageInfo, 30000);

    // Listen for quota exceeded events
    const handleQuotaExceeded = () => {
      setShowQuotaWarning(true);
      updateStorageInfo();
      setTimeout(() => setShowQuotaWarning(false), 5000);
    };

    window.addEventListener('storage-quota-exceeded', handleQuotaExceeded);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      window.removeEventListener('storage-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleExport = () => {
    exportAllData();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const success = await importAllData(file);
        if (!success) {
          alert('Failed to import data. Please check the file format.');
        }
      }
    };
    input.click();
  };

  const handleClearStorage = () => {
    if (
      confirm(
        'Are you sure you want to clear all storage? This action cannot be undone.'
      )
    ) {
      storageManager.clear();
      window.location.reload();
    }
  };

  return (
    <>
      <StorageInfoContainer>
        <h3 style={{ margin: '0 0 1rem 0' }}>Storage Information</h3>
        
        {storageInfo && (
          <>
            <StorageBar>
              <StorageFill
                percent={storageInfo.percentUsed}
                $warning={storageInfo.percentUsed > 80}
              />
            </StorageBar>
            <StorageText>
              Used: {formatBytes(storageInfo.usage)} / {formatBytes(storageInfo.quota)}
              ({storageInfo.percentUsed.toFixed(1)}%)
            </StorageText>
            <StorageText>
              Available: {formatBytes(storageInfo.available)}
            </StorageText>
          </>
        )}

        <ButtonGroup>
          <Button onClick={handleExport} variant="secondary" size="sm">
            Export Data
          </Button>
          <Button onClick={handleImport} variant="secondary" size="sm">
            Import Data
          </Button>
          <Button onClick={handleClearStorage} variant="outline" size="sm">
            Clear Storage
          </Button>
        </ButtonGroup>
      </StorageInfoContainer>

      <Toast show={showQuotaWarning}>
        ⚠️ Storage quota exceeded! Some data may not be saved. Consider exporting
        your data and clearing old boards.
      </Toast>
    </>
  );
};
