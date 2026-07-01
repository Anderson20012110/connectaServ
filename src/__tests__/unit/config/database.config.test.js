import { jest } from '@jest/globals';

jest.unstable_mockModule('sequelize', () => {
  return {
    Sequelize: jest.fn().mockImplementation(() => ({
      authenticate: jest.fn(),
      sync: jest.fn()
    }))
  };
});

describe('Database Config', () => {
  it('should export a Sequelize instance', async () => {
    const { default: sequelize } = await import('../../../config/database.config.js');
    expect(sequelize).toBeDefined();
  });
});
