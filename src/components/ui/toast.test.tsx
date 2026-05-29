import { render, screen } from '@testing-library/react'
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast'

describe('Toast components', () => {
  it('renders toast with title and description', () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Title</ToastTitle>
          <ToastDescription>Description</ToastDescription>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('renders destructive variant and action', () => {
    render(
      <ToastProvider>
        <Toast open variant="destructive">
          <ToastAction altText="Undo">Undo</ToastAction>
        </Toast>
        <ToastViewport className="custom-viewport" />
      </ToastProvider>
    )

    expect(screen.getByText('Undo')).toBeInTheDocument()
  })
})
