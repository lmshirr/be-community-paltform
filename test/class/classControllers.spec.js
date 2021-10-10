const classController = require('../../app/controllers/classController')
const classService = require('../../app/services/classServices')

describe('Class Controller', () => {
  const mockClassService = {
    getClassInCommunity: jest.fn().mockImplementation(() => [{id: '12jkjfd-323dfs'}])
  }

  describe('GET METHOD', () => {
    it('should be return array of class if success', async () => {
      expect(await classController.getClassInCommunity({}, {}, jest.fn())).toBeDefined()
    })
  })
})