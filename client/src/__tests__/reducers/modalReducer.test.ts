import { describe, it, expect } from 'vitest'
import { modalReducer, initialModalState } from '../../reducers/modalReducer'
import type { ModalState } from '../../types/ModalState'
import type { Npc } from '../../types/Npc'

// Mock NPC object for testing
const mockNpc: Npc = {
  id: 'npc-1',
  name: 'Test NPC',
  race: 'Human',
  class: 'Fighter',
  level: 3,
  description: 'Test description'
}

describe('modalReducer', () => {

  it('should return initial state on CLOSE action', () => {
    const state: ModalState = {
      mode: 'edit',
      npc: mockNpc
    }

    const result = modalReducer(state, { type: 'CLOSE' })

    expect(result).toEqual(initialModalState)
  })

  it('should open create modal', () => {
    const result = modalReducer(initialModalState, { type: 'OPEN_CREATE' })

    expect(result.mode).toBe('create')
    expect(result.npc).toBeNull()
  })

  it('should open edit modal with npc', () => {
    const result = modalReducer(initialModalState, {
      type: 'OPEN_EDIT',
      npc: mockNpc
    })

    expect(result.mode).toBe('edit')
    expect(result.npc).toEqual(mockNpc)
  })

  it('should open delete confirmation modal with npc', () => {
    const result = modalReducer(initialModalState, {
      type: 'OPEN_DELETE',
      npc: mockNpc
    })

    expect(result.mode).toBe('confirmDelete')
    expect(result.npc).toEqual(mockNpc)
  })

  it('should open gm secrets modal with npc', () => {
    const result = modalReducer(initialModalState, {
      type: 'OPEN_GM_SECRETS',
      npc: mockNpc
    })

    expect(result.mode).toBe('gmSecrets')
    expect(result.npc).toEqual(mockNpc)
  })

  it('should return same state for unknown action', () => {
    const state: ModalState = {
      mode: 'edit',
      npc: mockNpc
    }

    // Force invalid action to test default branch
    const result = modalReducer(state, { type: 'UNKNOWN_ACTION' } as any)

    expect(result).toBe(state)
  })

})
