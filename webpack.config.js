var path = require('path')
var webpack = require('webpack')
const Fiber = require('fibers');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var entry = process.env.NODE_ENV === "production" ? {app: path.join(__dirname, 'src', 'main.jsx')} : [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'src', 'main.jsx')
]

console.log("Webpack.config", entry);

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    entry: entry,
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV||"development")
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
    ],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            loaders: ['babel-loader'],
            exclude: /node_modules/,
            include: __dirname
        }]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            maxSize: 3000000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
}

