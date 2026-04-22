1. PROJECT SCENARIO
-------------------
This project simulates a smart city environment (SUSS) to support 
Sustainable Cities and Communities. It consists of three 
distributed services that communicate via gRPC to manage urban 
challenges like pollution, traffic congestion, and waste efficiency.

2. PROTOBUF DEFINITIONS (.proto files)
--------------------------------------
The system is built on three service contracts that implement the four 
required gRPC invocation styles. Filenames use PascalCase:

- AirQuality.proto: 
  Implements SERVER SIDE STREAMING. Allows a client to request 
  monitoring for an area and receive a continuous stream of CO2 and 
  pollen data.

- TrafficService.proto: 
  Implements SIMPLE RPC (for emergency signal overrides) and 
  CLIENT SIDE STREAMING (for vehicles to stream speed data bursts 
  to the server for flow analysis).

- WasteManagement.proto: 
  Implements BIDIRECTIONAL STREAMING. Enables real-time coordination 
  between collection trucks and the dispatch center for route 
  optimization based on live bin fill levels.

3. SERVICE IMPLEMENTATIONS (.js files)
--------------------------------------
The services are implemented using Node.js. Each server 
includes logic for metadata handling and error management:

- AirServer.js: 
  Listens on port 50051. Simulates environmental sensors using 
  asynchronous timers to push data to the client. Includes 'cancelled' 
  event listeners for remote error handling.

- TrafficServer.js: 
  Listens on port 50052. Handles discrete emergency requests and 
  aggregates incoming streams of speed data to calculate congestion 
  levels.

- WasteServer.js: 
  Listens on port 50053. Manages a full duplex stream where it 
  processes incoming bin status and simultaneously writes navigation 
  instructions back to the client.
