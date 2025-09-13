import Index from '@/app';
import { render } from '@testing-library/react-native';

describe('Index screen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Index />);
    expect(getByText('Edit app/index.tsx to edit this screen.')).toBeTruthy();
  });
});
