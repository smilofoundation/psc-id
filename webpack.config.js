var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    entry: [
        'webpack-hot-middleware/client?reload=true',
        path.join(__dirname, 'src', 'main.jsx')
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        // new HtmlWebpackPlugin({
        //     template: './src/index.html'
        // })
    ],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            loaders: ['babel-loader'],
            exclude: /node_modules/,
            include: __dirname
        }]
    }
}

