module.exports = {
    publicPath: './',
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    devServer: {
        host: "0.0.0.0",
        proxy: {
            "/api": {
                target: "http://127.0.0.1:8800/",
                changeOrigin: true,
            },
        },
    },
    lintOnSave: false
}