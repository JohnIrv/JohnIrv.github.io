// webpack.config.js
// Configuration file for Webpack bundler.

// Node.js 'path' module for resolving file paths
const path = require('path');
// Webpack plugin to automatically generate an HTML file with script tags
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Webpack plugin to copy individual files or entire directories to the build directory
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  // Set the mode for Webpack (influences optimizations and environment variables)
  // 'development' provides faster builds and better debugging
  // 'production' provides optimized builds for deployment
  mode: 'development',

  // Entry point of the application (where Webpack starts bundling)
  entry: './src/index.js',

  // Configuration for the output bundle
  output: {
    // Name of the output JavaScript bundle file
    filename: 'bundle.js',
    // Absolute path to the output directory (usually 'dist')
    path: path.resolve(__dirname, 'dist'),
    // Clean the output directory before each build
    clean: true,
  },

  // Configuration for how different types of modules are treated
  module: {
    // Rules for specific file types
    rules: [
      {
        // Apply these rules to files ending in .css
        test: /\.css$/,
        // Loaders are applied in reverse order (css-loader -> style-loader)
        use: [
          'style-loader', // Injects CSS into the DOM via <style> tags
          'css-loader',   // Resolves @import and url() in CSS like JS require/import
         ],
      },
      // Add rules for other file types (e.g., Babel for JS, file-loader for images) if needed
      // Note: We are using CopyPlugin for videos, so no module rule needed here unless you want JS imports
    ],
  },

  // Configuration for Webpack plugins
  plugins: [
    // Generates an index.html file in the output directory,
    // automatically injecting a <script> tag for the output bundle.
    new HtmlWebpackPlugin({
      // Use src/index.html as the template
      template: './src/index.html',
    }),
    // Copies specified files or directories from source to the output directory.
    new CopyPlugin({
      patterns: [
        // Defines patterns for assets to copy:
        { from: "src/models", to: "models" },      // Copy src/models to dist/models
        { from: "src/fonts", to: "fonts" },        // Copy src/fonts to dist/fonts
        { from: "src/textures", to: "textures" },  // Copy src/textures to dist/textures
        { from: "src/images", to: "images" },      // Copy src/images to dist/images
        // ***** ADD THIS LINE FOR VIDEOS *****
        { from: "src/videos", to: "videos" },      // Copy src/videos to dist/videos
        // ************************************
        // Add more rules here if needed for other static assets
      ],
    }),
  ],

  // Configuration for the webpack-dev-server (for local development)
  devServer: {
    // Specify the directory to serve static files from
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    // Enable gzip compression for served files
    compress: true,
    // Port number for the development server
    port: 9000,
    // Optional: Automatically open the browser when the server starts
    // open: true,
  },

  // Optional: Configure source maps for easier debugging
  // devtool: 'inline-source-map', // Example: Good for development
};