import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import NpcFormModal from '../../components/modals/NpcFormModal'
import { npcService } from '../../services/npcService'

// Mock API service
vi.mock('../../services/npcService', () => ({
  npcService: {
    create: vi.fn(),
    update: vi.fn()
  }
}))

// Mock NpcForm to immediately submit valid data
vi.mock('../../components/npc/NpcForm', () => ({
  default: ({ onSubmit }: any) => {
    onSubmit({
      name: 'Bob',
      role: 'Guard',
      descriptor: '',
      race: '',
      agenda: ''
    })

    return <div>Mocked NPC Form</div>
  }
}))

describe('NpcFormModal', () => {

  it('shows success message after successful create', async () => {

    ;(npcService.create as any).mockResolvedValue({
      id: '1',
      name: 'Bob'
    })

    render(
      <NpcFormModal
        onClose={vi.fn()}
        campaignId="123"
        title="Create NPC"
        onSubmitSuccess={vi.fn()}
      />
    )

    const success = await screen.findByText('NPC saved successfully.')

    expect(success).toBeInTheDocument()
  })

})
