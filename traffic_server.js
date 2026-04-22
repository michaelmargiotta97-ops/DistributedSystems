

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the traffic proto file
const PROTO_PATH = __dirname + '/../proto/traffic_service.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase: true });
const trafficProto = grpc.loadPackageDefinition(packageDefinition).ie.ncirl.suss.traffic;

/**
 * METHOD 1: EmergencyOverride (Simple RPC)
 * Logic: One request in, one response out.
 */
function emergencyOverride(call, callback) {
    console.log("--- Emergency Override Request Received ---");
    
    // Check if the signal is being turned ON or OFF
    const junction = call.request.junction_id;
    const isActive = call.request.active;

    console.log(`Junction: ${junction} | Active: ${isActive}`);

    // Simple logic: If it's an emergency, we succeed.
    const response = {
        success: true,
        message: isActive ? `Emergency green light active at ${junction}` : `Normal operation resumed at ${junction}`
    };

    // callback sends the single response back to the client
    callback(null, response);
}

/**
 * METHOD 2: RecordTrafficFlow (Client-side Streaming)
 * Logic: Client sends many speed readings, server sends back ONE summary.
 */
function recordTrafficFlow(call, callback) {
    console.log("--- Starting Speed Data Stream from Client ---");
    
    let totalSpeed = 0;
    let count = 0;

    // This listener triggers every time the client sends a "chunk" of data
    call.on('data', (speedReading) => {
        console.log(`Received speed: ${speedReading.speed_kmh} km/h`);
        totalSpeed += speedReading.speed_kmh;
        count++;
    });

    // This triggers when the client says "I am finished sending data"
    call.on('end', () => {
        const average = count > 0 ? (totalSpeed / count).toFixed(2) : 0;
        
        // Send the single final response back
        callback(null, {
            average_speed: parseFloat(average),
            congestion_level: average < 30 ? "High Congestion" : "Clear"
        });
        console.log("Stream ended. Average speed calculated.");
    });
}

function main() {
    const server = new grpc.Server();
    server.addService(trafficProto.TrafficService.service, {
        EmergencyOverride: emergencyOverride,
        RecordTrafficFlow: recordTrafficFlow
    });
    server.bindAsync("0.0.0.0:50052", grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log("Traffic Server running on port 50052");
    });
}
main();