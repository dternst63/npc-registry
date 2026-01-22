import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNpcForm } from '../../hooks/useNpcForm'
import type { Npc } from '../../types/Npc'

const mockNpc: Npc = {
  id: '1',
  name: 'Thorin',
  role: 'Warrior',
  descriptor: 'Grumpy dwarf',
  race: 'Dwarf',
  agenda: 'Find gold'
}

describe('useNpcForm', () => {

  it('initializes empty form when no npc provided', () => {
    const onSubmit = vi.fn()

    const { result } = renderHook(() =>
      useNpcForm({ onSubmit })
    )

    expect(result.current.formData.name).toBe('')
    expect(result.current.formData.role).toBe('')
  })

  it('initializes form with npc when provided', () => {
    const onSubmit = vi.fn()

    const { result } = renderHook(() =>
      useNpcForm({ initialNpc: mockNpc, onSubmit })
    )

    expect(result.current.formData.name).toBe('Thorin')
    expect(result.current.formData.role).toBe('Warrior')
  })

  it('updates formData on handleChange', () => {
    const onSubmit = vi.fn()

    const { result } = renderHook(() =>
      useNpcForm({ onSubmit })
    )

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Gandalf' }
      } as any)
    })

    expect(result.current.formData.name).toBe('Gandalf')
  })

  it('sets touched and errors on handleBlur', () => {
    const onSubmit = vi.fn()

    const { result } = renderHook(() =>
      useNpcForm({ onSubmit })
    )

    act(() => {
      result.current.handleBlur('name')
    })

    expect(result.current.touched.name).toBe(true)
    expect(result.current.errors.name).toBe('This field is required')
  })

  it('does not submit when validation fails', async () => {
    const onSubmit = vi.fn()

    const { result } = renderHook(() =>
      useNpcForm({ onSubmit })
    )

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: () => {}
      } as any)
    })

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits form when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    const { result } = renderHook(() =>
      useNpcForm({ onSubmit })
    )

    // Populate valid fields
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Aragorn' }
      } as any)

      result.current.handleChange({
        target: { name: 'role', value: 'Ranger' }
      } as any)
    })

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: () => {}
      } as any)
    })

    expect(onSubmit).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Aragorn',
        role: 'Ranger'
      })
    )
  })

})
