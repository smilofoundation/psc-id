var path = require('path')
var webpack = require('webpack')
const Fiber = require('fibers');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    entry: {
        app: path.join(__dirname, 'src', 'main.jsx'),
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
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
            include: /src/
        },
            {
                test: /\.scss$/,
                use: [{
                    loader: process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader",
                    options: {
                        implementation: require("sass"),
                        fiber: Fiber
                    }
                }]
            }
        ]
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

