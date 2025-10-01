import { render } from '@testing-library/react-native';
import React from 'react';

import Index from '@/app/(tabs)';

describe('Index screen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Index />);
    expect(getByText('This is the home screen')).toBeTruthy();
  });
});
