import { renderHook, act } from '@testing-library/react-hooks';
import useDebounce from './useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce(10));
    expect(result.current).toBe(10);
  });

  it('should update the debounced value after the delay', () => {
    const { result, rerender } = renderHook(({ value, delay }: any) => useDebounce(value, delay), {
      initialProps: { value: 10, delay: 300 },
    });

    // Initial value should be immediately available
    expect(result.current).toBe(10);

    // Update the value
    rerender({ value: 20, delay: 300 });

    // Debounced value should not update immediately
    expect(result.current).toBe(10);

    // Fast-forward time by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Debounced value should update
    expect(result.current).toBe(20);
  });

  it('should cancel the timeout if value changes before delay', () => {
    const { result, rerender } = renderHook(({ value, delay }: any) => useDebounce(value, delay), {
      initialProps: { value: 10, delay: 300 },
    });

    // Initial value should be immediately available
    expect(result.current).toBe(10);

    // Update the value
    rerender({ value: 20, delay: 300 });

    // Debounced value should not update immediately
    expect(result.current).toBe(10);

    // Update the value before the delay ends
    rerender({ value: 30, delay: 300 });

    // Fast-forward time by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Debounced value should update to the latest value
    expect(result.current).toBe(30);
  });
});
