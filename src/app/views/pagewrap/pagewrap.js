/* eslint-disable no-unused-vars */
import React from 'react';
import { PageWrapStyles } from './pagewrapstyles';

import Header from '../header';
import Content from '../content';
import Footer from '../footer';

export default function PageWrap() {
  return (
    <PageWrapStyles>
      <Header />
      <Content />
      <Footer />
    </PageWrapStyles>
  );
}
