const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        youtube: './src/js/youtube.js',
        results: './src/js/results.js',
        display: './src/js/display.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'youtube.html',
            template: './src/html/youtube.html',
            chunks: ['youtube']
        }),
        new HtmlWebpackPlugin({
            filename: 'search_results.html',
            template: './src/html/search_results.html',
            chunks: ['results']
        }),
        new HtmlWebpackPlugin({
            filename: 'display.html',
            template: './src/html/display.html',
            chunks: ['display']
        })
    ],
    mode: 'development'
};
