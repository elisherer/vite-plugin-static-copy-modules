import { createRequire } from "node:module";
import { viteStaticCopy, type Target, ViteStaticCopyOptions } from "vite-plugin-static-copy";

const _require = createRequire(import.meta.url);

export type ViteStaticCopyModuleOptions = {
    moduleName: string;
    define?: string;
    findModulePathBy?: string;
    targets: (modulePath: string, publicPath: string) => Target[];
    publicPathResolver?: (moduleName: string, modulePackage: any) => string;
};

export const defaultPublicPathResolver = (moduleName: string, modulePackage: any) => {
    return moduleName.replace("@", "").replace(/\//g, "-") + `-${modulePackage.version}`;
};

export const viteStaticCopyModulePlugin = (modules: ViteStaticCopyModuleOptions[]) => {
    const copyOptions: ViteStaticCopyOptions = { targets: [] };

    const defines: Record<string, string> = {};

    for (const m of modules) {
        const {
            moduleName,
            define,
            findModulePathBy = "package.json",
            targets,
            publicPathResolver = defaultPublicPathResolver,
        } = m;
        const modulePath = _require.resolve(moduleName + "/" + findModulePathBy).slice(0, -findModulePathBy.length);
        const modulePackage = _require(moduleName + "/package.json");
        const publicPath = publicPathResolver(moduleName, modulePackage);

        copyOptions.targets = copyOptions.targets.concat(targets(modulePath, publicPath));
        if (define) {
            defines[define] = publicPath;
        }
    }

    const plugs = viteStaticCopy(copyOptions);

    plugs.forEach(plugin => {
        const configMutator = plugin.config;
        plugin.config = (config, env) => {
            if (!config.define) {
                config.define = {};
            }
            for (const key in defines) {
                config.define[key] = JSON.stringify(defines[key]);
            }
            return typeof configMutator === "function" ? configMutator(config, env) : config;
        };
    });

    return plugs;
};
