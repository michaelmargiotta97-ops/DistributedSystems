const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the .proto file - This acts as the 'contract' between Client and Server
const PROTO_PATH = __dirname + '/../proto/air_quality.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

// Accessing the specific package defined in the proto file
const airProto = grpc.loadPackageDefinition(packageDefinition).ie.ncirl.suss.airquality;

/**
 * MONITOR AIR LEVELS: Server-side Streaming Implementation
 * Requirement: "Server-side streaming RPC"
 */
function monitorAirLevels(call) {
    // We check for the 'auth-token' mentioned in the CA report
    const metadata = call.metadata.getMap();
    console.log("Request received with Metadata Token:", metadata['auth-token']);

    console.log(`Connection established. Monitoring Area: ${call.request.area_id}`);

    let count = 0;

    // We use a timer to simulate a continuous stream of sensor data
    const interval = setInterval(() => {
        count++;
        
        // Constructing the message based on the 'AirData' message in our .proto
        const airUpdate = {
            co2_level: (Math.random() * 50 + 400).toFixed(2), // Simulating CO2 ppm
            pollen_count: Math.floor(Math.random() * 30),     // Simulating Pollen levels
            quality_status: count > 3 ? "Warning: Elevated levels" : "Healthy"
        };

        // call.write() pushes data to the client without closing the connection
        // This is what makes it a 'Stream'
        call.write(airUpdate);

        // Closing the stream after a set amount of data for the demo
        if (count >= 5) {
            clearInterval(interval);
            call.end(); // Inform the client the stream is finished
            console.log("Stream closed successfully.");
        }
    }, 2000);

    // ERROR HANDLING: If the client cancels the request or the deadline passes
    call.on('cancelled', () => {
        console.log("Client cancelled the stream or Deadline exceeded.");
        clearInterval(interval);
    });
}

/**
 * SERVER STARTUP
 */
function main() {
    const server = new grpc.Server();
    
    // Mapping the service name from the proto to our local JavaScript function
    server.addService(airProto.AirQualityService.service, {
        MonitorAirLevels: monitorAirLevels
    });

    // Binding to port 50051 (Standard gRPC port)
    const address = "0.0.0.0:50051";
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error("Server failed to bind:", err);
            return;
        }
        server.start();
        console.log(`Air Quality Server active at ${address}`);
    });
}

main();
