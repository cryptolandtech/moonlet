import common from "./common.config";
import {resolve} from "path";
/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config original webpack config.
 * @param {object} env options passed to CLI.
 * @param {WebpackConfigHelpers} helpers object with useful helpers when working with config.
 **/
export default function (config, env, helpers) {
    // apply common config
    common(config, env, helpers);    

    // customize config
    config.resolve.alias['preact-cli-entrypoint'] = resolve(process.cwd(), 'src', 'web', 'index');
}

