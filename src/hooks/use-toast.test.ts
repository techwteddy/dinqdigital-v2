import { act, renderHook } from '@testing-library/react'
import { dismissAllToasts, toast, useToast } from './use-toast'

describe('useToast', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.dismiss()
    })
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('adds a toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'Hello', description: 'World' })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].title).toBe('Hello')
    expect(result.current.toasts[0].open).toBe(true)
  })

  it('limits toasts to five', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      for (let i = 0; i < 7; i++) {
        result.current.toast({ title: `Toast ${i}` })
      }
    })

    expect(result.current.toasts).toHaveLength(5)
  })

  it('updates a toast', () => {
    const { result } = renderHook(() => useToast())
    let toastRef: ReturnType<typeof toast>

    act(() => {
      toastRef = result.current.toast({ title: 'Original' })
      toastRef.update({ title: 'Updated' })
    })

    expect(result.current.toasts[0].title).toBe('Updated')
  })

  it('dismisses a specific toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      const t = result.current.toast({ title: 'Dismiss me' })
      result.current.dismiss(t.id)
    })

    expect(result.current.toasts[0].open).toBe(false)
  })

  it('dismisses all toasts when no id provided', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'One' })
      result.current.toast({ title: 'Two' })
      result.current.dismiss()
    })

    result.current.toasts.forEach((t) => {
      expect(t.open).toBe(false)
    })
  })

  it('removes toast after delay', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      const t = result.current.toast({ title: 'Remove me' })
      result.current.dismiss(t.id)
    })

    act(() => {
      jest.advanceTimersByTime(5000)
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('removes all toasts via REMOVE_TOAST without id', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'One' })
      result.current.dismiss()
      jest.advanceTimersByTime(5000)
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('calls onOpenChange to dismiss', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'Close' })
    })

    const onOpenChange = result.current.toasts[0].onOpenChange
    act(() => {
      onOpenChange?.(false)
    })

    expect(result.current.toasts[0].open).toBe(false)
  })

  it('exposes toast function from module export', () => {
    act(() => {
      toast({ title: 'Exported' })
    })
    const { result } = renderHook(() => useToast())
    expect(result.current.toasts.some((t) => t.title === 'Exported')).toBe(true)
  })

  it('skips duplicate remove queue entries', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      const t = result.current.toast({ title: 'Once' })
      result.current.dismiss(t.id)
      result.current.dismiss(t.id)
    })

    act(() => {
      jest.advanceTimersByTime(5000)
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('clears all toasts via dismissAllToasts', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'One' })
      result.current.toast({ title: 'Two' })
      dismissAllToasts()
    })

    expect(result.current.toasts).toHaveLength(0)
  })
})
