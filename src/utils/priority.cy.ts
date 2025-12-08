import { getPriorityColor, getPriorityLabel } from './priority'

describe('Priority Utilities', () => {
  describe('getPriorityColor', () => {
    it('returns "urgent" for urgent priority', () => {
      expect(getPriorityColor('urgent')).to.equal('urgent')
    })

    it('returns "error" for high priority', () => {
      expect(getPriorityColor('high')).to.equal('error')
    })

    it('returns "warning" for medium priority', () => {
      expect(getPriorityColor('medium')).to.equal('warning')
    })

    it('returns "info" for low priority', () => {
      expect(getPriorityColor('low')).to.equal('info')
    })

    it('returns "default" for unknown priority', () => {
      expect(getPriorityColor('unknown')).to.equal('default')
      expect(getPriorityColor('')).to.equal('default')
      expect(getPriorityColor('random')).to.equal('default')
    })

    it('handles case sensitivity', () => {
      expect(getPriorityColor('URGENT')).to.equal('default')
      expect(getPriorityColor('High')).to.equal('default')
    })
  })

  describe('getPriorityLabel', () => {
    it('returns "Urgente" for urgent priority', () => {
      expect(getPriorityLabel('urgent')).to.equal('Urgente')
    })

    it('returns "Alta" for high priority', () => {
      expect(getPriorityLabel('high')).to.equal('Alta')
    })

    it('returns "Media" for medium priority', () => {
      expect(getPriorityLabel('medium')).to.equal('Media')
    })

    it('returns "Baja" for low priority', () => {
      expect(getPriorityLabel('low')).to.equal('Baja')
    })

    it('returns the original value for unknown priority', () => {
      expect(getPriorityLabel('unknown')).to.equal('unknown')
      expect(getPriorityLabel('custom')).to.equal('custom')
      expect(getPriorityLabel('')).to.equal('')
    })

    it('handles case sensitivity by returning original value', () => {
      expect(getPriorityLabel('URGENT')).to.equal('URGENT')
      expect(getPriorityLabel('High')).to.equal('High')
    })

    it('returns correct Spanish translations for all valid priorities', () => {
      const priorities = [
        { input: 'urgent', expected: 'Urgente' },
        { input: 'high', expected: 'Alta' },
        { input: 'medium', expected: 'Media' },
        { input: 'low', expected: 'Baja' }
      ]

      priorities.forEach(({ input, expected }) => {
        expect(getPriorityLabel(input)).to.equal(expected)
      })
    })
  })

  describe('Integration tests', () => {
    it('returns matching color and label for the same priority', () => {
      const testPriorities = ['urgent', 'high', 'medium', 'low']

      testPriorities.forEach(priority => {
        const color = getPriorityColor(priority)
        const label = getPriorityLabel(priority)
        
        expect(color).to.be.a('string')
        expect(label).to.be.a('string')
        expect(label.length).to.be.greaterThan(0)
      })
    })

    it('handles all priorities consistently', () => {
      const priorities = ['urgent', 'high', 'medium', 'low']
      const colors = priorities.map(p => getPriorityColor(p))
      const labels = priorities.map(p => getPriorityLabel(p))

      // All should return values
      expect(colors).to.have.length(4)
      expect(labels).to.have.length(4)

      // All should be unique
      expect(new Set(colors).size).to.equal(4)
      expect(new Set(labels).size).to.equal(4)
    })
  })
})
