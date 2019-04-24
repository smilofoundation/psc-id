const serveStatic = require('serve-static');
const path = require('path');
const timeout = require('connect-timeout');

var app = new (require('express'))()
const PORT = parseInt(process.env.PORT || "3000");
const isDEV = process.env.IS_DEV;


//disable powered by
app.disable('x-powered-by');

app.use(serveStatic(path.join(__dirname, 'public')));
app.use(serveStatic(path.join(__dirname, 'dist')));
//set timeout for all requests 20s
app.use(timeout(20000));

if(isDEV) {
    console.log("==> 🌎  Starting webpack dev middleware ... ");
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const config = require('./webpack.config');
    const compiler = webpack(config);

    app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: '/'}));
    app.use(webpackHotMiddleware(compiler));

     app.use(function (req, res) {
         res.redirect("/");
    });

} else {
    app.use(function (req, res) {
        res.sendFile(__dirname + '/dist/index.html');
    });
}

app.listen(PORT, function (error) {
    if (error) {
        console.error(error);
    } else {
        console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", PORT, PORT);
    }
});
