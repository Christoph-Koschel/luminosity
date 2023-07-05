const {ConfigBuilder, PLUGINS} = require("./engine/config");
let builder = new ConfigBuilder();

const {make_vfs, write_vfs} = require("./vfs");

builder.add_module("luminosity", [
    "./src/luminosity"
])
    .dependence("vfs")
    .add_loader("./src/luminosity/elements/core.ts")
    .add_loader("./src/luminosity/loader.ts")
    .use(PLUGINS.UTILS.MINIFIER);

builder.add_module("vfs", [
    "./src/vfs"
]).use(PLUGINS.UTILS.MINIFIER);

make_vfs("./vfs");
write_vfs();

builder.write("./tsb.config.json");

builder.create_build_queue("up")
    .done();

builder.create_build_queue("all")
    .compile_module("luminosity")
    .compile_module("vfs")
    .done();

exports.default = builder.build();