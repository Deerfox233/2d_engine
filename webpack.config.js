const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    entry: {
        "renderView": './src/renderView.js',
    },
    output: {
        filename: '[name].bundle.js',
        library: "[name]",
        clean: true
    },
    module: {
        rules: [

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/index.html"),
        })
    ],
    devtool: "cheap-module-source-map",
    devServer: {
        port:5000,
        open: true,
        hot: true,
    },
    mode: "development",
}
