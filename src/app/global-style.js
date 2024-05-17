/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import * as styled from "styled-components";
import { normalize } from "styled-normalize";

export default styled.createGlobalStyle`
  ${normalize}

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
    font-family: "Raleway", sans-serif;
    font-weight: 400;
    font-size: 16px;
  }

  /* test */
  h1 {
    color: #990000;
  }

  img {
    width: 100%;
    height: auto;
  }
`;
