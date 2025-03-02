module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': ['babel-jest', { configFile: './.babelrc' }],
    },
    transformIgnorePatterns: ['node_modules/(?!(chai|chai-as-promised)/)'],
    testMatch: ['**/test/**/*.test.js'],
    verbose: true,
};
