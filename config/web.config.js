import common from './common.config';
import { resolve } from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';
/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config original webpack config.
 * @param {object} env options passed to CLI.
 * @param {WebpackConfigHelpers} helpers object with useful helpers when working with config.
 **/
export default function(config, env, helpers) {
    // apply common config
    common(config, env, helpers);

    config.plugins.push(
        new helpers.webpack.DefinePlugin({
            'process.env.PLATFORM': JSON.stringify('WEB') // same as in Platform enum
        })
    );

    // customize config
    config.resolve.alias['preact-cli-entrypoint'] = resolve(process.cwd(), 'src', 'web', 'index');

    // overwrite manifest.json
    config.plugins.unshift(
        new CopyWebpackPlugin([
            {
                from: resolve(process.cwd(), 'src', 'web', 'manifest.json'),
                to: 'manifest.json'
            }
        ])
    );
}
