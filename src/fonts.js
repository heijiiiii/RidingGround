import SCDream3 from './font/SCDream3.otf';
import SCDream5 from './font/SCDream5.otf';
import SCDream7 from './font/SCDream7.otf';

const fontStyles = `
  @font-face {
    font-family: 'S-Core Dream';
    src: url(${SCDream3}) format('opentype');
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'S-Core Dream';
    src: url(${SCDream5}) format('opentype');
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: 'S-Core Dream';
    src: url(${SCDream7}) format('opentype');
    font-weight: 700;
    font-style: normal;
  }
`;

const injectFontStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = fontStyles;
  document.head.appendChild(style);
};

export default injectFontStyles; 