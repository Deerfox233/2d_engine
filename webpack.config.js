module.exports = {
    entry: {
        "controller": "./src/control/controller.js",
        "renderView": './src/renderView.js',
    },
    mode: "development",
    devtool: false,
    output: {
        filename: '[name].bundle.js',
        library: "[name]",
    }
}
