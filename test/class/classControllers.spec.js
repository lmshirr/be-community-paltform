const classController = require('../../app/controllers/classController');
const classService = require('../../app/services/classService');
const uuid = require('uuid');

describe('ClassController', () => {
  const mockClassService = {
    getClassInCommunity: jest
      .fn()
      .mockImplementation(() => [{ id: '12jkjfd-323dfs' }]),
  };

  describe('GET METHOD', () => {
    it('should be return array of class if success', async () => {
      const mockRequest = () => {
        const req = {};
        req.params = jest.fn().mockReturnValue({ id: uuid.v4() });
        return req;
      };
      const mockResponse = () => {
        const res = {};
        res.json = jest.fn().mockReturnValue({});
      };

      expect(
        await classController.getClassInCommunity(
          mockRequest(),
          mockResponse(),
          jest.fn()
        )
      ).toBeDefined();

      expect(
        await mockClassService.getClassInCommunity('12jkjfd-323dfs')
      ).toHaveBeenCalled();
    });
  });
});
