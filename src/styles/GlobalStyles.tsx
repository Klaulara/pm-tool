'use client';

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fonts.primary};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.primary};
    overflow-x: hidden;
  }
`;