import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import HelloWorld from '../src/HelloWorld';

storiesOf('Twitter', module)
  .add('Direct Message', () => (
    <HelloWorld socialType='twitter' postType='directMessage' responseCount={10000} showCount />
  ))
  .add('Tweet', () => (
    <HelloWorld socialType='twitter' postType='tweet' responseCount={140} showCount />
  ))

storiesOf('Facebook', module)
  .add('Private Message', () => (
    <HelloWorld socialType='facebook' postType='privateMessage' responseCount={600} showCount />
  ))
  .add('Post', () => (
    <HelloWorld socialType='facebook' postType='post' />
  ))
