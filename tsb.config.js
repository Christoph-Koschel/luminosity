const {ConfigBuilder, PLUGINS} = require("./engine/config");
let builder = new ConfigBuilder();

const {make_vfs, write_vfs} = require("./vfs");

builder.add_module("luminosity", [
    "./src/luminosity"
])
    .dependence("vfs")
    .dependence("luminosity-core")
    .add_loader("./src/luminosity/builder/state.ts")
    .add_loader("./src/luminosity/loader.ts")
    .use(PLUGINS.UTILS.MINIFIER);

builder.add_module("luminosity-core", [
    "./src/luminosity-core"
])
    .dependence("vfs")
    .dependence("luminosity")
    .use(PLUGINS.UTILS.MINIFIER);

builder.add_module("vfs", [
    "./src/vfs"
]).use(PLUGINS.UTILS.MINIFIER);

make_vfs("./stdvfs");
make_vfs("./vfs");
write_vfs();

builder.write("./tsb.config.json");

builder.create_build_queue("up")
    .done();

builder.create_build_queue("all")
    .compile_module("vfs")
    .compile_module("luminosity")
    .compile_module("luminosity-core")
    .done();

exports.default = builder.build();