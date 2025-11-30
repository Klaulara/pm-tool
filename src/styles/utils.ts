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
