# TCP/IP Model Interactive Learning Platform

A professional, educational web application that visualizes how data travels through the TCP/IP protocol stack.

## Features

### Data Flow Visualization
- **Horizontal Flow**: Segments, packets, and frames flow horizontally for better visualization
- **Animated Encapsulation**: Watch headers being added at each layer with smooth animations
- **Real-time Transformation**: See data transform from application data → segments → packets → frames → bits

### Layer-by-Layer Breakdown

#### 1. Application Layer
- HTTP, SMTP, FTP protocol simulation
- Protocol headers clearly displayed
- User data payload visualization

#### 2. Transport Layer (TCP)
- TCP 3-way handshake animation
- Data segmentation with configurable MSS
- TCP header visualization (ports, sequence numbers, flags)
- TCP 4-way teardown
- Error simulation (packet loss, corruption)

#### 3. Network Layer (IP)
- IP packet creation
- IP header details (source/dest IP, TTL, protocol)
- Router path visualization
- Network delay simulation

#### 4. Data Link Layer
- Ethernet frame creation
- MAC address handling
- Frame header and CRC visualization

#### 5. Physical Layer
- Binary bit representation
- Manchester encoding signal visualization
- Animated bit transmission

### Interactive Features
- **Editable Headers**: Click any segment/packet/frame to view and edit details
- **Configurable Parameters**: Adjust MSS, IP addresses, message types
- **Error Simulation**: Test packet loss, delays, and data corruption
- **DNS Lookup Demo**: Visual domain name resolution
- **Detailed Logging**: Step-by-step transmission log

## How to Use

1. Open `index.html` in a modern web browser
2. Configure transmission settings:
   - Select message type (Email/HTTP/File Transfer)
   - Enter your message
   - Set MSS (Maximum Segment Size)
   - Configure IP addresses
   - Optional: Enable error simulation
3. Click "Start Transmission"
4. Watch the data flow through all layers with animations
5. Click on any data unit to inspect and edit headers
6. Review the transmission log for detailed information

## Educational Value

This application is designed to help anyone - from beginners to advanced students - understand:
- How data encapsulation works in TCP/IP
- What headers are added at each layer
- How protocols like TCP ensure reliable delivery
- The relationship between different protocol layers
- Network error handling and recovery

## Technical Details

- Pure HTML, CSS, and JavaScript
- No external dependencies
- Responsive design
- Professional blue color scheme
- Smooth CSS animations for enhanced learning
- Accessible and easy to understand

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

---

**Note**: This is an educational simulation. Actual network behavior may vary based on real-world conditions.
