const serveStatic = require('serve-static');
const path = require('path');
const timeout = require('connect-timeout');

var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

var app = new (require('express'))()
var port = 3000

var compiler = webpack(config)

//disable powered by
app.disable('x-powered-by');


app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}))
app.use(webpackHotMiddleware(compiler))


app.use(serveStatic(path.join(__dirname, 'public')))

//set timeout for all requests 20s
app.use(timeout(20000));

app.use(function (req, res) {
    res.sendFile(__dirname + '/src/index.html')
})


app.listen(port, function (error) {
    if (error) {
        console.error(error)
    } else {
        console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
    }
})
