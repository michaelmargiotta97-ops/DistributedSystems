import javax.swing.*; // Imports the Swing library for creating the window and buttons
import java.awt.*;    // Imports the Abstract Window Toolkit for layouts and colors

/**
 * STUDENT: Michael Margiotta (x25134515)
 * CLASS: SUSSGUI
 * DESCRIPTION: This class creates a simple Graphical User Interface (GUI) 
 * to act as the "City Manager Control Center" for the SUSS system.
 */
public class SUSSGUI {
    public static void main(String[] args) {
        // Create the main window frame and set the title
        JFrame frame = new JFrame("SUSS System");
        
        // Set the initial size of the window (Width: 400px, Height: 300px)
        frame.setSize(400, 300);
        
        // Ensures the program stops running when the window is closed
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // Create a text area where server status and data will be displayed
        // This acts as the "log" for the City Manager
        JTextArea log = new JTextArea();
        
        // Create a button that the user clicks to initiate the gRPC connections
        JButton btn = new JButton("Connect to Servers");

        /**
         * ACTION LISTENER:
         * This code runs whenever the "Connect to Servers" button is clicked.
         * In a full implementation, this is where the gRPC Stubs would be called.
         */
        btn.addActionListener(e -> {
            // Simulate connecting to the Air Quality Service on Port 50051
            log.append("Connecting to Port 50051...\n");
            log.append("Air Service: Status OK (Streaming Active)\n");
            
            // Simulate connecting to the Traffic Service on Port 50052
            log.append("Traffic Service: Ready (Simple RPC Bound)\n");
            
            // Simulate connecting to the Waste Management Service on Port 50053
            log.append("Waste Service: Online (Bi-Directional Stream)\n");
            
            // Add a separator for readability
            log.append("-------------------------------------------\n");
        });

        // Add the button to the top (North) of the window
        frame.add(btn, BorderLayout.NORTH);
        
        // Add the log area to the center of the window
        // JScrollPane allows the user to scroll down if there are many log messages
        frame.add(new JScrollPane(log), BorderLayout.CENTER);

        // Make the window visible on the screen
        frame.setVisible(true);
    }
}