import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  dir: './',
})
 

const config= {
  coverageProvider: 'v8',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
}
 

export default createJestConfig(config)