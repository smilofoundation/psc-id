var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// var entry = process.env.NODE_ENV === "production" ? {app: path.join(__dirname, 'src', 'main.jsx')} : [
//     'webpack-hot-middleware/client?reload=true',
//     'webpack-dev-server/client?http://0.0.0.0:9000',
//     'webpack/hot/only-dev-server',
//     path.join(__dirname, 'src', 'main.jsx')
// ];
var entry = './test/index.js';

console.log("Webpack.config", entry);

module.exports = {
    devtool: process.env.NODE_ENV === "production" ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    entry: entry,
    output: {
        path: path.join(__dirname, 'www'),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || "development")
        }),
        // new HtmlWebpackPlugin({
        //     template: './src/index.html'
        // }),
        // new MiniCssExtractPlugin({
        //     // Options similar to the same options in webpackOptions.output
        //     // all options are optional
        //     filename: '[name].css',
        //     chunkFilename: '[id].css',
        //     ignoreOrder: false, // Enable to remove warnings about conflicting order
        // }),
        require('autoprefixer')

    ],
    module: {
        rules: [
            // {
            //     test: /\.css$/,
            //     use: [
            //         {
            //             loader: MiniCssExtractPlugin.loader,
            //             options: {
            //                 // you can specify a publicPath here
            //                 // by default it uses publicPath in webpackOptions.output
            //                 publicPath: '../',
            //                 hmr: process.env.NODE_ENV === 'development',
            //             },
            //         },
            //         'css-loader',
            //     ],
            // },
            {
                test: /\.(js|jsx)$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/,
                include: __dirname
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'url-loader?limit=10000&minetype=application/font-woff'
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'file-loader'
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "postcss-loader"]
            },
            {
                test: /\.styl$/,
                use: ["stylus-loader"]
            },
            {
                test: /\.jsx?$/,
                use: ['babel-loader', 'astroturf/loader'],
            }

        ]
    },
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all',
    //         maxSize: 3000000,
    //         minChunks: 1,
    //         maxAsyncRequests: 5,
    //         maxInitialRequests: 3,
    //         automaticNameDelimiter: '~',
    //         name: true,
    //         cacheGroups: {
    //             default: {
    //                 minChunks: 2,
    //                 priority: -20,
    //                 reuseExistingChunk: true
    //             }
    //         }
    //     }
    // },
};

