const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: {
        youtube: './src/js/youtube.js',
        results: './src/js/results.js',
        display: './src/js/display.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/'
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
            },
            {
                test: /\.(svg|jpe?g)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[hash].[ext]',
                            outputPath: 'images'
                        }
                    }
                ]
                /* type: 'asset/resource', // use asset module to handle SVG */
            },
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
        }),
        new Dotenv({ path: './constants.env' }),
    ],

    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
            watch: true,
        },
        compress: true,
        port: 9000,
        open: ['http://localhost:9000/youtube.html'], // Open the browser after the server starts to the default file
        hot: true, // Enable hot module replacement
        
    }, 
    mode: 'development',

    resolve: {
        fallback: {
            "fs": false,
            "path": false
        }
    }
};
