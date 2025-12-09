'use client';

import { StorageManager } from '@/components/StorageManager';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1rem;
    margin-left: 0;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const InfoBox = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 8px;
  border-left: 4px solid ${({ theme }) => theme.colors.primary.main};
`;

const InfoText = styled.p`
  margin: 0.5rem 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export default function SettingsPage() {
  return (
    <Container>
      <Header>
        <Title>Settings</Title>
        <Description>
          Manage your application settings and data storage
        </Description>
      </Header>

      <Section>
        <SectionTitle>Data Storage & Backup</SectionTitle>
        <StorageManager />
        
        <InfoBox>
          <InfoText>
            <strong>Auto-save:</strong> Your changes are automatically saved with a 1-second debounce to prevent excessive writes.
          </InfoText>
          <InfoText>
            <strong>Export:</strong> Download all your boards, tasks, columns, and tags as a JSON file for backup.
          </InfoText>
          <InfoText>
            <strong>Import:</strong> Restore your data from a previously exported JSON file. This will reload the page.
          </InfoText>
          <InfoText>
            <strong>Storage:</strong> Data is stored in your browser&apos;s localStorage. If quota is exceeded, the app will attempt to clean up temporary data.
          </InfoText>
        </InfoBox>
      </Section>
    </Container>
  );
}
