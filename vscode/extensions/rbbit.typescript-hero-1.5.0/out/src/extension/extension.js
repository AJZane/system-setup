"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("reflect-metadata");
const typescript_parser_1 = require("typescript-parser");
const import_grouping_1 = require("./import-grouping");
const IoC_1 = require("./IoC");
const IoCSymbols_1 = require("./IoCSymbols");
const ImportProxy_1 = require("./proxy-objects/ImportProxy");
const TypeScriptHero_1 = require("./TypeScriptHero");
let extension;
function extendGenerator(generator) {
    function simpleGenerator(generatable) {
        const group = generatable;
        if (!group.imports.length) {
            return '';
        }
        return group.sortedImports
            .map(imp => generator.generate(imp))
            .join('\n') + '\n';
    }
    typescript_parser_1.GENERATORS[import_grouping_1.KeywordImportGroup.name] = simpleGenerator;
    typescript_parser_1.GENERATORS[import_grouping_1.RegexImportGroup.name] = simpleGenerator;
    typescript_parser_1.GENERATORS[import_grouping_1.RemainImportGroup.name] = simpleGenerator;
    typescript_parser_1.GENERATORS[ImportProxy_1.ImportProxy.name] = (proxy) => {
        if (proxy.specifiers.length <= 0 && (proxy.defaultAlias || proxy.defaultPurposal)) {
            return generator.generate(new typescript_parser_1.DefaultImport(proxy.libraryName, (proxy.defaultAlias || proxy.defaultPurposal), proxy.start, proxy.end));
        }
        if (proxy.defaultAlias) {
            proxy.specifiers.push(new typescript_parser_1.SymbolSpecifier('default', proxy.defaultAlias));
        }
        const named = new typescript_parser_1.NamedImport(proxy.libraryName, proxy.start, proxy.end);
        named.specifiers = proxy.specifiers;
        return generator.generate(named);
    };
}
function activate(context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (IoC_1.Container.isBound(IoCSymbols_1.iocSymbols.extensionContext)) {
            IoC_1.Container.unbind(IoCSymbols_1.iocSymbols.extensionContext);
        }
        IoC_1.Container.bind(IoCSymbols_1.iocSymbols.extensionContext).toConstantValue(context);
        extendGenerator(IoC_1.Container.get(IoCSymbols_1.iocSymbols.generatorFactory)());
        extension = IoC_1.Container.get(TypeScriptHero_1.TypeScriptHero);
    });
}
exports.activate = activate;
function deactivate() {
    extension.dispose();
}
exports.deactivate = deactivate;