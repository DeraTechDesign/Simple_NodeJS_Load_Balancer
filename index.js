var net = require('net');

// a simple Load Balancer that will distribute the requests to the servers in a round robin fashion

var servers = ["app1", "app2"];
console.log("Load Balancer started");
console.log(servers.length + " servers registered");
var lastConnection = 0;
const serverHttps = net.createServer((from) => {
    var connect;
    lastConnection = (lastConnection + 1) % servers.length;
    connect = lastConnection;
    
    var to = net.createConnection({
        host: servers[connect],
        port: 443
    });

    to.on('error', (err) => {
        console.log("Error connecting to " + servers[connect]);
        console.log(err);
        from.end();
    });

    from.pipe(to);
    to.pipe(from);
});

serverHttps.listen(443);
serverHttps.on('error', (err) => {
    console.log("Error: " + err);
});


const serverHttp = net.createServer((from) => {
    var connect;
    lastConnection = (lastConnection + 1) % servers.length;
    connect = lastConnection;
    
    var to = net.createConnection({
        host: servers[connect],
        port: 80
    });

    to.on('error', (err) => {
        console.log("Error connecting to " + servers[connect]);
        console.log(err);
        from.end();
    });
    
    from.pipe(to);
    to.pipe(from);
});

serverHttp.listen(80);
serverHttp.on('error', (err) => {
    console.log("Error: " + err);
});

