import { render } from '@testing-library/react-native';
import React from 'react';
import Index from '../app/index';

describe('Index screen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Index />);
    expect(getByText('Edit app/index.tsx to edit this screen.')).toBeTruthy();
  });
});
