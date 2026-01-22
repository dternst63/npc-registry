import { describe, it, expect } from 'vitest'
import { validateNpcForm } from '../../validation/npcValidateForm'
import type { NpcFormData } from '../../types/NpcForm'

const validForm: NpcFormData = {
  name: 'Gareth',
  role: 'Blacksmith',
  descriptor: 'Gruff but kind',
  race: 'Human',
  agenda: 'Protect the village'
}

describe('validateNpcForm', () => {

  it('returns no errors for valid form data', () => {
    const result = validateNpcForm(validForm)

    expect(result).toEqual({})
  })

  it('returns error when required fields are missing', () => {
    const result = validateNpcForm({
      ...validForm,
      name: '',
      role: ''
    })

    expect(result.name).toBe('This field is required')
    expect(result.role).toBe('This field is required')
  })

  it('returns error when below minimum length', () => {
    const result = validateNpcForm({
      ...validForm,
      name: 'A',
      role: 'B'
    })

    expect(result.name).toContain('at least')
    expect(result.role).toContain('at least')
  })

  it('returns error when exceeding max length', () => {
    const result = validateNpcForm({
      ...validForm,
      name: 'A'.repeat(60),
      role: 'B'.repeat(50)
    })

    expect(result.name).toContain('50')
    expect(result.role).toContain('40')
  })

  it('does not error on optional empty fields', () => {
    const result = validateNpcForm({
      ...validForm,
      descriptor: '',
      race: '',
      agenda: ''
    })

    expect(result).toEqual({})
  })

  it('trims whitespace before validating', () => {
    const result = validateNpcForm({
      ...validForm,
      name: ' ',
      role: '   '
    })

    expect(result.name).toBe('This field is required')
    expect(result.role).toBe('This field is required')
  })

})
