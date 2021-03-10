import { createGlobalStyle } from 'styled-components';
import reboot from 'styled-reboot';

const rebootCss = reboot();

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto+Condensed|Roboto+Slab:700|Roboto:400,500');
  ${rebootCss}

  html {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }

  body {
    width: 100%;
    position: relative;
    left: 0;
    -webkit-overflow-scrolling: touch;
    line-height: 1.5em;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 16px;
  }

`;
