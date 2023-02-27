const router = require('./router/app.js');
const { port } = require('./config')
const { server, app}= require("./index.js");

router(app)

server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});