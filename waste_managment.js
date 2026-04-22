const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the waste proto file
const PROTO_PATH = __dirname + '/../proto/wastemanagement.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase: true });
const wasteProto = grpc.loadPackageDefinition(packageDefinition).ie.ncirl.suss.waste;

/**
 * METHOD: OptimizeRoute (Bidirectional Streaming)
 * Logic: Both client and server keep the connection open to swap data.
 */
function optimizeRoute(call) {
    console.log("--- Bidirectional Route Optimization Started ---");

    // Listen for data coming FROM the truck (client)
    call.on('data', (binStatus) => {
        console.log(`Truck Report -> Bin: ${binStatus.bin_id} is ${binStatus.fill_percentage}% full.`);

        // Logic: If bin is over 70%, tell the truck to collect it
        let instruction = "Continue on current path.";
        if (binStatus.fill_percentage > 70) {
            instruction = `ALERT: Bin ${binStatus.bin_id} is full. Divert to collect immediately!`;
        }

        // Send data BACK to the truck immediately
        call.write({
            next_stop_id: binStatus.bin_id,
            navigation_instruction: instruction
        });
    });

    // Handle when the truck stops the stream
    call.on('end', () => {
        call.end();
        console.log("Route optimization stream closed.");
    });
}

function main() {
    const server = new grpc.Server();
    server.addService(wasteProto.WasteService.service, {
        OptimizeRoute: optimizeRoute
    });
    server.bindAsync("0.0.0.0:50053", grpc.ServerCredentials.createInsecure(), () => {
        server.start();
        console.log("Waste Server running on port 50053");
    });
}