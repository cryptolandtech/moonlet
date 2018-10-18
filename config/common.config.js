import preactCliTypeScript from 'preact-cli-plugin-typescript';

/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config original webpack config.
 * @param {object} env options passed to CLI.
 * @param {WebpackConfigHelpers} helpers object with useful helpers when working with config.
 **/
export default function(config, env, helpers) {
    preactCliTypeScript(config);

    // this is needed by webextension-polyfill-ts module
    for (let loader of config.module.loaders) {
        if (loader.loader === 'babel-loader') {
            loader.options.plugins.push([
                'babel-plugin-transform-builtin-extend',
                {
                    globals: ['WeakMap']
                }
            ]);
            break;
        }
    }

    config.plugins.push(
        new helpers.webpack.DefinePlugin({
            'process.env.PUBLIC_PATH': JSON.stringify(config.output.publicPath)
        })
    );

    config.node.process = 'mock';
    config.node.Buffer = true;
}
