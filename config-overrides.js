const { rewireWorkboxInject, defaultInjectConfig } = require('react-app-rewire-workbox')
// const { rewireWorkboxGenerate, defaultGenerateConfig } = require('react-app-rewire-workbox');
const path = require('path')

module.exports = function override(config, env) {
    if (env === 'production' || true) {
        // trying for dev also
        console.log('Adding Workbox for PWAs')
        // Extend the default injection config with required swSrc
        const workboxConfig = {
            ...defaultInjectConfig,
            swSrc: path.join(__dirname, 'src', 'custom-sw.js'),
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        }
        config = rewireWorkboxInject(workboxConfig)(config, env)
    }
    config.resolve.fallback = { url: require.resolve('url/') }

    return config
}
