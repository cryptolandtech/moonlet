import common from './common.config';
import { resolve } from 'path';

import WriteFilePlugin from 'write-file-webpack-plugin';
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
    config.output.publicPath = './';
    common(config, env, helpers);

    config.plugins.push(
        new helpers.webpack.DefinePlugin({
            'process.env.PLATFORM': JSON.stringify('EXTENSION') // same as in Platform enum
        })
    );

    // customize config
    config.resolve.alias['preact-cli-entrypoint'] = resolve(
        process.cwd(),
        'src',
        'extension',
        'index'
    );

    // add background script
    config.output.filename = '[name].js';
    config.entry['bundle.background'] = resolve(process.cwd(), 'src', 'extension', 'background');
    config.entry['bundle.content-script'] = resolve(
        process.cwd(),
        'src',
        'extension',
        'content-script'
    );
    config.entry['bundle.moonlet-web'] = resolve(process.cwd(), 'src', 'extension', 'moonlet-web');

    // overwrite manifest.json
    config.plugins.unshift(
        new CopyWebpackPlugin([
            {
                from: resolve(process.cwd(), 'src', 'extension', 'manifest.json'),
                to: 'manifest.json'
            }
        ])
    );

    //make hot reload work
    if (Array.isArray(config.entry.bundle)) {
        config.entry.bundle = config.entry.bundle.map(bundle => {
            if (bundle === 'webpack-dev-server/client') {
                const liveReloadProtocol = env.https ? 'https' : 'http';
                const liveReloadHost = env.host.replace(/^0\.0\.0\.0$/, 'localhost');

                const liveReloadUrl = `${liveReloadProtocol}://${liveReloadHost}:${env.port}`;
                return 'webpack-dev-server/client?' + liveReloadUrl;
            }

            return bundle;
        });
    }

    // disable hot reload for extension -> do a full page reload
    if (config.devServer) {
        config.devServer.hot = false;

        // change eval dev tools to make chrome happy
        config.devtool = 'inline-source-map';
    }

    // used for dev to load component in browser
    config.plugins.push(new WriteFilePlugin());
}
