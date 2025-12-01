'use client';

import React from 'react';
import { Container, Flex } from './ui';
import { ThemeToggle } from './ThemeToggle';
import styled from 'styled-components';

const PageHeader = styled.header`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.primary};
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

const PageDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const Header: React.FC = () => {

  return (
    <PageHeader>
      <Container>
        <div>
          <Flex justify="between" align="start">
            <div>
              <PageTitle>Sistema de Gestión de Proyectos</PageTitle>
              <PageDescription>
                Gestiona todos tus proyectos en un solo lugar
              </PageDescription>
            </div>
            <ThemeToggle />
          </Flex>
        </div>
      </Container>
    </PageHeader>
  )
}

export default Header