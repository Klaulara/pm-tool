'use client';

import React from 'react';
import { Container, Flex } from './ui';
import { ThemeToggle } from './ThemeToggle';
import styled from 'styled-components';

const PageHeader = styled.header`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.primary};
  padding: 0 0 0 0;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.display1};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary.main},
    ${({ theme }) => theme.colors.secondary.main}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
`;

const Header: React.FC = () => {

  return (
    <PageHeader>
      <Container>
        <div>
          <Flex justify="between" align="center">
            <PageTitle>Task Manager System</PageTitle>
            <ThemeToggle />
          </Flex>
        </div>
      </Container>
    </PageHeader>
  )
}

export default Header