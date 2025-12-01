// Media query helpers for responsive design
import { css, type RuleSet, type DefaultTheme, type CSSObject } from 'styled-components';

type MediaQueryFunction = (
  first: TemplateStringsArray,
  ...interpolations: Array<string | number | CSSObject>
) => RuleSet<DefaultTheme>;

export const media = {
  mobile: ((first, ...interpolations) => css`
    @media (min-width: 320px) {
      ${css(first, ...interpolations)}
    }
  `) as MediaQueryFunction,
  
  tablet: ((first, ...interpolations) => css`
    @media (min-width: 768px) {
      ${css(first, ...interpolations)}
    }
  `) as MediaQueryFunction,
  
  desktop: ((first, ...interpolations) => css`
    @media (min-width: 1024px) {
      ${css(first, ...interpolations)}
    }
  `) as MediaQueryFunction,
  
  wide: ((first, ...interpolations) => css`
    @media (min-width: 1440px) {
      ${css(first, ...interpolations)}
    }
  `) as MediaQueryFunction,
};

// Utility for flexbox centering
export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Utility for focus visible styles
export const focusVisible = css`
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;