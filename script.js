// Global State
let transmissionState = {
    message: '',
    messageType: 'email',
    mss: 1460,
    sourceIP: '192.168.1.100',
    destIP: '203.0.113.50',
    sourceMAC: 'AA:BB:CC:DD:EE:FF',
    destMAC: '11:22:33:44:55:66',
    sourcePort: 0,
    destPort: 0,
    domain: 'www.example.com',
    segments: [],
    packets: [],
    frames: [],
    currentStep: 0,
    errorType: 'none',
    isRunning: false
};

// DOM Elements
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const messageTypeSelect = document.getElementById('messageType');
const messageInput = document.getElementById('messageInput');
const mssInput = document.getElementById('mssInput');
const sourceIPInput = document.getElementById('sourceIP');
const destIPInput = document.getElementById('destIP');
const domainInput = document.getElementById('domainName');
const errorSimulation = document.getElementById('errorSimulation');
const attachmentSection = document.getElementById('attachmentSection');
const attachmentSize = document.getElementById('attachmentSize');

// Event Listeners
startBtn.addEventListener('click', startTransmission);
resetBtn.addEventListener('click', resetSimulation);
messageTypeSelect.addEventListener('change', handleMessageTypeChange);

function handleMessageTypeChange() {
    const type = messageTypeSelect.value;
    if (type === 'email') {
        attachmentSection.style.display = 'block';
        messageInput.placeholder = 'Enter email message...';
    } else if (type === 'http') {
        attachmentSection.style.display = 'none';
        messageInput.placeholder = 'Enter HTTP request body...';
    } else if (type === 'file') {
        attachmentSection.style.display = 'block';
        messageInput.placeholder = 'File description...';
    }
}

// Utility Functions
function log(message, type = 'info', layer = '') {
    const logContainer = document.getElementById('logContainer');
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    
    let layerText = layer ? `[${layer}]` : '';
    entry.innerHTML = `<span class="log-timestamp">${timestamp}</span><span class="log-layer">${layerText}</span><span class="log-message">${message}</span>`;
    
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

function updateStatus(step, segmentCount, progress) {
    document.getElementById('currentStep').textContent = step;
    document.getElementById('segmentCount').textContent = segmentCount;
    document.getElementById('progressPercent').textContent = `${progress}%`;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

function activateLayer(layerId) {
    // Remove active class from all layers
    document.querySelectorAll('.layer').forEach(layer => {
        layer.classList.remove('active', 'processing');
    });
    
    // Add active class to current layer
    const layer = document.getElementById(layerId);
    if (layer) {
        layer.classList.add('active', 'processing');
        layer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main Transmission Flow
async function startTransmission() {
    if (transmissionState.isRunning) return;
    
    transmissionState.isRunning = true;
    startBtn.disabled = true;
    
    // Read inputs
    transmissionState.message = messageInput.value;
    transmissionState.messageType = messageTypeSelect.value;
    transmissionState.mss = parseInt(mssInput.value);
    transmissionState.sourceIP = sourceIPInput.value;
    transmissionState.destIP = destIPInput.value;
    transmissionState.domain = domainInput.value;
    transmissionState.errorType = errorSimulation.value;
    
    // Set ports based on message type
    if (transmissionState.messageType === 'email') {
        transmissionState.sourcePort = Math.floor(Math.random() * 10000) + 50000;
        transmissionState.destPort = 25; // SMTP
    } else if (transmissionState.messageType === 'http') {
        transmissionState.sourcePort = Math.floor(Math.random() * 10000) + 50000;
        transmissionState.destPort = 80; // HTTP
    } else if (transmissionState.messageType === 'file') {
        transmissionState.sourcePort = Math.floor(Math.random() * 10000) + 50000;
        transmissionState.destPort = 21; // FTP
    }
    
    log('Starting TCP/IP transmission...', 'success');
    
    try {
        // Step 1: DNS Lookup
        await performDNSLookup();
        await sleep(1500);
        
        // Step 2: Application Layer
        await applicationLayer();
        await sleep(1500);
        
        // Step 3: TCP Handshake
        await tcpHandshake();
        await sleep(2000);
        
        // Step 4: Transport Layer (Segmentation)
        await transportLayer();
        await sleep(1500);
        
        // Step 5: Network Layer
        await networkLayer();
        await sleep(1500);
        
        // Step 6: Data Link Layer
        await dataLinkLayer();
        await sleep(1500);
        
        // Step 7: Physical Layer
        await physicalLayer();
        await sleep(2000);
        
        // Step 8: TCP Teardown
        await tcpTeardown();
        
        // Show summary
        await showTransmissionSummary();
        
        log('Transmission completed successfully!', 'success');
        updateStatus('Completed', transmissionState.segments.length, 100);
        
    } catch (error) {
        log(`❌ Error: ${error.message}`, 'error');
    } finally {
        transmissionState.isRunning = false;
        startBtn.disabled = false;
    }
}

// Step 1: DNS Lookup
async function performDNSLookup() {
    updateStatus('DNS Lookup', 0, 5);
    activateLayer('layer5');
    
    log(`Performing DNS lookup for ${transmissionState.domain}`, 'info', 'DNS');
    
    const dnsSection = document.getElementById('dnsSection');
    dnsSection.style.display = 'block';
    
    document.getElementById('dnsQuery').textContent = transmissionState.domain;
    
    await sleep(800);
    
    document.getElementById('dnsResponse').textContent = transmissionState.destIP;
    
    log(`DNS resolved: ${transmissionState.domain} to ${transmissionState.destIP}`, 'success', 'DNS');
}

// Step 2: Application Layer
async function applicationLayer() {
    updateStatus('Application Layer - Creating Message', 0, 10);
    activateLayer('layer5');
    
    let fullMessage = transmissionState.message;
    
    // Add attachment simulation for email
    if (transmissionState.messageType === 'email' && attachmentSection.style.display !== 'none') {
        const size = parseInt(attachmentSize.value);
        fullMessage += `\n\n[ATTACHMENT: document.pdf (${size}KB)]`;
        fullMessage += '\n' + 'A'.repeat(size * 100); // Simulate attachment data
    }
    
    let protocolHeader = '';
    if (transmissionState.messageType === 'email') {
        protocolHeader = `From: user@example.com\nTo: recipient@example.com\nSubject: Test Email\nContent-Type: text/plain`;
    } else if (transmissionState.messageType === 'http') {
        protocolHeader = `GET /index.html HTTP/1.1\nHost: ${transmissionState.domain}\nUser-Agent: TCP/IP-Simulator/1.0\nAccept: text/html`;
    } else if (transmissionState.messageType === 'file') {
        protocolHeader = `STOR filename.txt\nType: Binary\nMode: Stream`;
    }
    
    const appData = fullMessage;
    transmissionState.message = appData;
    
    const appDataElement = document.getElementById('appData');
    appDataElement.innerHTML = `
        <div class="data-transformation">
            <div class="data-box">
                <div class="data-box-header">${transmissionState.messageType.toUpperCase()} PROTOCOL</div>
                <div class="header-section">
                    <div class="header-label">Header</div>
                    <div style="color: #1e40af; font-weight: 600; font-size: 10px; line-height: 1.5;">${protocolHeader.replace(/\n/g, '<br>')}</div>
                </div>
            </div>
            
            <div class="transformation-arrow">+</div>
            
            <div class="data-box">
                <div class="data-box-header">USER DATA</div>
                <div class="data-payload">
                    <div style="margin-top: 8px; line-height: 1.6; font-size: 11px;">${appData.substring(0, 100)}${appData.length > 100 ? '...' : ''}</div>
                    <div style="margin-top: 8px; color: #64748b; font-size: 10px;">Size: ${appData.length} bytes</div>
                </div>
            </div>
            
            <div class="transformation-arrow">→</div>
            
            <div style="text-align: center; color: #2563eb; font-weight: 600; font-size: 11px; display: flex; align-items: center; padding: 0 10px;">
                Ready for Transport Layer
            </div>
        </div>
    `;
    
    log(`📝 Application layer data created: ${appData.length} bytes`, 'info', 'Layer 5');
}

// Step 3: TCP Handshake
async function tcpHandshake() {
    updateStatus('TCP 3-Way Handshake', 0, 15);
    activateLayer('layer4');
    
    log('Initiating TCP 3-way handshake...', 'info', 'Layer 4');
    
    const handshakeDiv = document.getElementById('tcpHandshake');
    handshakeDiv.style.display = 'block';
    handshakeDiv.classList.add('data-flowing');
    
    await sleep(500);
    log('SYN: Client initiating connection', 'info', 'TCP');
    await sleep(1000);
    log('SYN-ACK: Server acknowledging and requesting connection', 'info', 'TCP');
    await sleep(1000);
    log('ACK: Connection established', 'success', 'TCP');
    
    log('TCP connection established', 'success', 'Layer 4');
}

// Step 4: Transport Layer (Segmentation)
async function transportLayer() {
    updateStatus('Transport Layer - Segmentation', 0, 30);
    activateLayer('layer4');
    
    const data = transmissionState.message;
    const mss = transmissionState.mss;
    const segments = [];
    
    log(`Segmenting data into ${mss}-byte segments...`, 'info', 'Layer 4');
    
    let sequenceNumber = 1000; // Starting sequence number
    let segmentNumber = 1;
    
    for (let i = 0; i < data.length; i += mss) {
        const segmentData = data.substring(i, i + mss);
        
        const segment = {
            segmentNum: segmentNumber,
            sourcePort: transmissionState.sourcePort,
            destPort: transmissionState.destPort,
            sequenceNum: sequenceNumber,
            ackNum: 0,
            flags: 'PSH, ACK',
            windowSize: 65535,
            checksum: generateChecksum(segmentData),
            data: segmentData,
            dataLength: segmentData.length
        };
        
        segments.push(segment);
        sequenceNumber += segmentData.length;
        segmentNumber++;
    }
    
    transmissionState.segments = segments;
    
    // Display segments
    const segmentsView = document.getElementById('segmentsView');
    segmentsView.innerHTML = '';
    
    for (let i = 0; i < segments.length; i++) {
        await sleep(600);
        const segment = segments[i];
        const segmentDiv = createSegmentElement(segment, i);
        segmentsView.appendChild(segmentDiv);
        segmentDiv.classList.add('animating');
        
        // Add flow indicator between segments
        if (i < segments.length - 1) {
            const flowArrow = document.createElement('div');
            flowArrow.className = 'flow-indicator';
            flowArrow.innerHTML = '→';
            segmentsView.appendChild(flowArrow);
        }
        
        // Simulate error and retransmission with animation
        if (transmissionState.errorType === 'packetLoss' && i === 1) {
            segment.error = 'LOST';
            segmentDiv.classList.add('error');
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-indicator';
            errorSpan.textContent = 'LOST';
            segmentDiv.appendChild(errorSpan);
            log(`Segment ${i + 1} lost! Retransmitting...`, 'error', 'TCP');
            // Show retransmit badge
            await sleep(900);
            errorSpan.textContent = 'Retransmitting...';
            errorSpan.className = 'retransmit-indicator';
            await sleep(900);
            errorSpan.textContent = '✔';
            errorSpan.className = 'retransmit-indicator retransmit-success';
            segmentDiv.classList.remove('error');
            await sleep(600);
            errorSpan.remove();
            log(`Segment ${i + 1} retransmitted successfully`, 'success', 'TCP');
        } else if (transmissionState.errorType === 'corruption' && i === 2) {
            segment.error = 'CORRUPT';
            segmentDiv.classList.add('error');
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-indicator';
            errorSpan.textContent = 'CORRUPT';
            segmentDiv.appendChild(errorSpan);
            log(`Segment ${i + 1} corrupted! Checksum mismatch. Retransmitting...`, 'error', 'TCP');
            await sleep(900);
            errorSpan.textContent = 'Retransmitting...';
            errorSpan.className = 'retransmit-indicator';
            await sleep(900);
            errorSpan.textContent = '✔';
            errorSpan.className = 'retransmit-indicator retransmit-success';
            segmentDiv.classList.remove('error');
            await sleep(600);
            errorSpan.remove();
            log(`Segment ${i + 1} retransmitted successfully`, 'success', 'TCP');
        } else if (transmissionState.errorType === 'delay' && i === 1) {
            // Simulate network delay
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-indicator';
            errorSpan.textContent = 'DELAYED';
            segmentDiv.appendChild(errorSpan);
            log(`Segment ${i + 1} experiencing network delay...`, 'error', 'TCP');
            await sleep(1200);
            errorSpan.textContent = '✔';
            errorSpan.className = 'retransmit-indicator retransmit-success';
            await sleep(600);
            errorSpan.remove();
            log(`Segment ${i + 1} delivered after delay`, 'success', 'TCP');
        }
        
        log(`Segment ${i + 1}/${segments.length} created (Seq: ${segment.sequenceNum}, Size: ${segment.dataLength} bytes)`, 'info', 'Layer 4');
    }
    
    updateStatus('Transport Layer - Segmentation Complete', segments.length, 40);
}

function createSegmentElement(segment, index) {
    const div = document.createElement('div');
    div.className = 'segment';
    div.dataset.index = index;
    div.dataset.type = 'segment';
    
    const dataPreview = segment.data.substring(0, 40);
    
    div.innerHTML = `
        <div class="data-box-header">TCP SEGMENT ${segment.segmentNum}</div>
        <div style="display: flex; gap: 8px; align-items: stretch; margin-top: 8px;">
            <div class="header-section header-added" style="flex: 0 0 200px;">
                <div class="header-label">TCP Header</div>
                <div style="font-size: 10px; line-height: 1.4; margin-top: 4px;">
                    <div><strong>Src:</strong> ${segment.sourcePort}</div>
                    <div><strong>Dst:</strong> ${segment.destPort}</div>
                    <div><strong>Seq:</strong> ${segment.sequenceNum}</div>
                    <div><strong>Flags:</strong> ${segment.flags}</div>
                </div>
            </div>
            
            <div class="transformation-arrow" style="font-size: 1.2em; display: flex; align-items: center;">+</div>
            
            <div class="data-payload" style="flex: 1;">
                <div class="header-label">App Data (${segment.dataLength}B)</div>
                <div style="margin-top: 4px; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${dataPreview}...</div>
            </div>
        </div>
    `;
    
    div.addEventListener('click', () => showPacketDetails(segment, 'segment'));
    
    return div;
}

// Step 5: Network Layer
async function networkLayer() {
    updateStatus('Network Layer - Creating IP Packets', transmissionState.segments.length, 50);
    activateLayer('layer3');
    
    log('Creating IP packets and routing...', 'info', 'Layer 3');
    
    // Update routing visualization
    document.getElementById('srcIP').textContent = transmissionState.sourceIP;
    document.getElementById('dstIP').textContent = transmissionState.destIP;
    
    const packets = [];
    const packetsView = document.getElementById('packetsView');
    packetsView.innerHTML = '';
    
    for (let i = 0; i < transmissionState.segments.length; i++) {
        await sleep(600);
        
        const segment = transmissionState.segments[i];
        const packet = {
            packetNum: i + 1,
            version: 4,
            headerLength: 20,
            ttl: 64,
            protocol: 6, // TCP
            sourceIP: transmissionState.sourceIP,
            destIP: transmissionState.destIP,
            checksum: generateChecksum(`${transmissionState.sourceIP}${transmissionState.destIP}`),
            totalLength: segment.dataLength + 40, // IP header (20) + TCP header (20) + data
            identification: 54321 + i,
            flags: 'DF',
            fragmentOffset: 0,
            payload: segment
        };
        
        packets.push(packet);
        
        const packetDiv = createPacketElement(packet, i);
        packetsView.appendChild(packetDiv);
        packetDiv.classList.add('animating');
        
        // Add flow indicator between packets
        if (i < transmissionState.segments.length - 1) {
            const flowArrow = document.createElement('div');
            flowArrow.className = 'flow-indicator';
            flowArrow.innerHTML = '→';
            packetsView.appendChild(flowArrow);
        }
        
        // Simulate delay
        if (transmissionState.errorType === 'delay' && i === 1) {
            log(`Packet ${i + 1} experiencing network delay...`, 'error', 'IP');
            await sleep(1500);
        }
        
        log(`IP Packet ${i + 1} created - Routing: ${transmissionState.sourceIP} to ${transmissionState.destIP}`, 'info', 'Layer 3');
    }
    
    transmissionState.packets = packets;
    updateStatus('Network Layer - Routing Complete', packets.length, 60);
}

function createPacketElement(packet, index) {
    const div = document.createElement('div');
    div.className = 'packet';
    div.dataset.index = index;
    div.dataset.type = 'packet';
    
    div.innerHTML = `
        <div class="data-box-header">IP PACKET ${packet.packetNum}</div>
        <div style="display: flex; gap: 8px; align-items: stretch; margin-top: 8px;">
            <div class="header-section header-added" style="flex: 0 0 160px;">
                <div class="header-label">IP Header</div>
                <div style="font-size: 10px; line-height: 1.4; margin-top: 4px;">
                    <div><strong>Ver:</strong> IPv${packet.version}</div>
                    <div><strong>TTL:</strong> ${packet.ttl}</div>
                    <div><strong>Src:</strong> ${packet.sourceIP}</div>
                    <div><strong>Dst:</strong> ${packet.destIP}</div>
                </div>
            </div>
            
            <div class="transformation-arrow" style="font-size: 1.2em; display: flex; align-items: center;">+</div>
            
            <div class="header-section" style="flex: 0 0 140px; background: rgba(59, 130, 246, 0.1);">
                <div class="header-label">TCP Header</div>
                <div style="font-size: 10px; line-height: 1.4; margin-top: 4px;">
                    <div><strong>Ports:</strong> ${packet.payload.sourcePort}→${packet.payload.destPort}</div>
                    <div><strong>Seq:</strong> ${packet.payload.sequenceNum}</div>
                </div>
            </div>
            
            <div class="transformation-arrow" style="font-size: 1.2em; display: flex; align-items: center;">+</div>
            
            <div class="data-payload" style="flex: 1;">
                <div class="header-label">Data (${packet.payload.dataLength}B)</div>
                <div style="margin-top: 4px; font-size: 10px;">App payload</div>
            </div>
        </div>
    `;
    
    div.addEventListener('click', () => showPacketDetails(packet, 'packet'));
    
    return div;
}

// Step 6: Data Link Layer
async function dataLinkLayer() {
    updateStatus('Data Link Layer - Creating Frames', transmissionState.packets.length, 70);
    activateLayer('layer2');
    
    log('Creating Ethernet frames with MAC addresses...', 'info', 'Layer 2');
    
    const frames = [];
    const framesView = document.getElementById('framesView');
    framesView.innerHTML = '';
    
    for (let i = 0; i < transmissionState.packets.length; i++) {
        await sleep(600);
        
        const packet = transmissionState.packets[i];
        const frame = {
            frameNum: i + 1,
            preamble: '10101010',
            sfd: '10101011',
            destMAC: transmissionState.destMAC,
            sourceMAC: transmissionState.sourceMAC,
            etherType: '0x0800', // IPv4
            payload: packet,
            crc: generateChecksum(`${transmissionState.sourceMAC}${transmissionState.destMAC}`),
            totalLength: packet.totalLength + 18 // Ethernet header (14) + CRC (4)
        };
        
        frames.push(frame);
        
        const frameDiv = createFrameElement(frame, i);
        framesView.appendChild(frameDiv);
        frameDiv.classList.add('animating');
        
        // Add flow indicator between frames
        if (i < transmissionState.packets.length - 1) {
            const flowArrow = document.createElement('div');
            flowArrow.className = 'flow-indicator';
            flowArrow.innerHTML = '→';
            framesView.appendChild(flowArrow);
        }
        
        log(`Ethernet Frame ${i + 1} created - MAC: ${transmissionState.sourceMAC} to ${transmissionState.destMAC}`, 'info', 'Layer 2');
    }
    
    transmissionState.frames = frames;
    updateStatus('Data Link Layer - Framing Complete', frames.length, 80);
}

function createFrameElement(frame, index) {
    const div = document.createElement('div');
    div.className = 'frame';
    div.dataset.index = index;
    div.dataset.type = 'frame';
    
    div.innerHTML = `
        <div class="data-box-header">ETHERNET FRAME ${frame.frameNum}</div>
        <div style="display: flex; gap: 8px; align-items: stretch; margin-top: 8px;">
            <div class="header-section header-added" style="flex: 0 0 180px;">
                <div class="header-label">Ethernet Header</div>
                <div style="font-size: 9px; line-height: 1.4; margin-top: 4px;">
                    <div><strong>Src MAC:</strong> ${frame.sourceMAC}</div>
                    <div><strong>Dst MAC:</strong> ${frame.destMAC}</div>
                    <div><strong>Type:</strong> ${frame.etherType}</div>
                </div>
            </div>
            
            <div class="transformation-arrow" style="font-size: 1.2em; display: flex; align-items: center;">+</div>
            
            <div class="header-section" style="flex: 0 0 120px; background: rgba(37, 99, 235, 0.08);">
                <div class="header-label">IP Header</div>
                <div style="font-size: 9px; line-height: 1.4; margin-top: 4px;">
                    <div>${frame.payload.sourceIP}</div>
                    <div>→ ${frame.payload.destIP}</div>
                </div>
            </div>
            
            <div class="transformation-arrow" style="font-size: 1.2em; display: flex; align-items: center;">+</div>
            
            <div class="header-section" style="flex: 0 0 100px; background: rgba(59, 130, 246, 0.08);">
                <div class="header-label">TCP</div>
                <div style="font-size: 9px; margin-top: 4px;">
                    <div>${frame.payload.payload.sourcePort}→${frame.payload.payload.destPort}</div>
                </div>
            </div>
            
            <div class="transformation-arrow" style="font-size: 1.2em; display: flex; align-items: center;">+</div>
            
            <div class="data-payload" style="flex: 1;">
                <div class="header-label">Data</div>
                <div style="margin-top: 4px; font-size: 9px;">${frame.payload.payload.dataLength}B</div>
            </div>
            
            <div class="transformation-arrow" style="font-size: 1.2em; display: flex; align-items: center;">+</div>
            
            <div class="header-section" style="flex: 0 0 80px; background: rgba(239, 68, 68, 0.1); border-color: #ef4444;">
                <div class="header-label" style="font-size: 9px;">CRC</div>
                <div style="margin-top: 4px; font-size: 9px; color: #991b1b;">0x${frame.crc.substring(0, 6)}</div>
            </div>
        </div>
    `;
    
    div.addEventListener('click', () => showPacketDetails(frame, 'frame'));
    
    return div;
}

// Step 7: Physical Layer
async function physicalLayer() {
    updateStatus('Physical Layer - Transmitting Bits', transmissionState.frames.length, 90);
    activateLayer('layer1');
    
    log('Converting frames to binary and transmitting...', 'info', 'Layer 1');
    
    // Take first frame and convert to binary representation
    const firstFrame = transmissionState.frames[0];
    const sampleData = `${firstFrame.sourceMAC}${firstFrame.destMAC}`;
    const binaryString = textToBinary(sampleData.substring(0, 32)); // Limit for display
    
    const binaryDataDiv = document.getElementById('binaryData');
    binaryDataDiv.innerHTML = `
        <div class="data-box encapsulation-step">
            <div class="data-box-header">PHYSICAL BITS</div>
            
            <div class="header-section header-added">
                <div class="header-label">Binary Representation (Sample)</div>
                <div style="margin-top: 8px; word-break: break-all; line-height: 1.8; font-size: 14px; font-family: 'Courier New', monospace;">
                    ${binaryString.split('').map((bit, i) => 
                        `<span class="bit-flow" style="color: ${bit === '1' ? '#2563eb' : '#64748b'}; font-weight: 600; animation-delay: ${i * 0.05}s;">${bit}</span>${(i + 1) % 8 === 0 ? ' ' : ''}`
                    ).join('')}
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #64748b;">
                    Total: ${binaryString.length} bits shown (from Frame 1 MAC addresses)
                </div>
            </div>
            
            <div class="data-payload">
                <div class="header-label">Full Frame Structure</div>
                <div style="margin-top: 8px; font-size: 12px; line-height: 1.8;">
                    <div>📍 Preamble (8 bytes) + Ethernet Header (14 bytes)</div>
                    <div>📍 + IP Packet (${firstFrame.payload.totalLength} bytes)</div>
                    <div>📍 + CRC (4 bytes)</div>
                    <div style="margin-top: 8px; font-weight: 600; color: #2563eb;">
                        = Total: ${firstFrame.totalLength} bytes = ${firstFrame.totalLength * 8} bits
                    </div>
                </div>
            </div>
        </div>
    `;
    
    log(`Converting to binary: ${binaryString.length} bits (sample)`, 'info', 'Layer 1');
    
    await sleep(800);
    
    // Draw Manchester encoding
    drawManchesterEncoding(binaryString);
    
    log('Transmitting signal using Manchester encoding...', 'info', 'Layer 1');
    await sleep(1500);
    log('Physical transmission complete', 'success', 'Layer 1');
}

function textToBinary(text) {
    let binary = '';
    for (let i = 0; i < text.length; i++) {
        const bin = text.charCodeAt(i).toString(2).padStart(8, '0');
        binary += bin;
    }
    return binary.substring(0, 64); // Limit to 64 bits for visualization
}

function drawManchesterEncoding(binaryString) {
    const canvas = document.getElementById('signalCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Draw high/low labels
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('High', 5, 25);
    ctx.fillText('Low', 5, height - 15);
    
    // Manchester encoding parameters
    const bitsToShow = Math.min(binaryString.length, 32);
    const bitWidth = width / bitsToShow;
    const highLevel = height * 0.2;
    const lowLevel = height * 0.8;
    
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let currentLevel = lowLevel;
    ctx.moveTo(0, currentLevel);
    
    for (let i = 0; i < bitsToShow; i++) {
        const bit = binaryString[i];
        const x = i * bitWidth;
        const midX = x + bitWidth / 2;
        const nextX = x + bitWidth;
        
        if (bit === '1') {
            // Manchester encoding for '1': low to high transition in middle
            ctx.lineTo(midX, currentLevel);
            currentLevel = currentLevel === lowLevel ? highLevel : lowLevel;
            ctx.lineTo(midX, currentLevel);
            ctx.lineTo(nextX, currentLevel);
        } else {
            // Manchester encoding for '0': high to low transition in middle
            ctx.lineTo(midX, currentLevel);
            currentLevel = currentLevel === highLevel ? lowLevel : highLevel;
            ctx.lineTo(midX, currentLevel);
            ctx.lineTo(nextX, currentLevel);
        }
    }
    
    ctx.stroke();
    
    // Draw bit labels with colors
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < bitsToShow; i++) {
        const x = i * bitWidth + bitWidth / 2;
        ctx.fillStyle = binaryString[i] === '1' ? '#2563eb' : '#64748b';
        ctx.fillText(binaryString[i], x, height - 10);
    }
}

// Step 8: TCP Teardown
async function tcpTeardown() {
    updateStatus('TCP 4-Way Teardown', transmissionState.frames.length, 95);
    activateLayer('layer4');
    
    log('Initiating TCP 4-way teardown...', 'info', 'Layer 4');
    
    const teardownDiv = document.getElementById('tcpTeardown');
    teardownDiv.style.display = 'block';
    
    // Animate teardown arrows
    const arrows = teardownDiv.querySelectorAll('.arrow');
    for (let i = 0; i < arrows.length; i++) {
        arrows[i].style.animationDelay = `${i * 1}s`;
    }
    
    await sleep(500);
    log('FIN: Client requesting connection termination', 'info', 'TCP');
    await sleep(1000);
    log('ACK: Server acknowledging FIN', 'info', 'TCP');
    await sleep(1000);
    log('FIN: Server requesting connection termination', 'info', 'TCP');
    await sleep(1000);
    log('ACK: Connection closed', 'success', 'TCP');
    
    log('TCP connection closed gracefully', 'success', 'Layer 4');
}

// Show Transmission Summary
async function showTransmissionSummary() {
    const detailsPanel = document.getElementById('detailsPanel');
    const packetDetails = document.getElementById('packetDetails');
    
    // Calculate statistics
    const totalDataSize = transmissionState.message.length;
    const numSegments = transmissionState.segments.length;
    const numPackets = transmissionState.packets.length;
    const numFrames = transmissionState.frames.length;
    
    const avgSegmentSize = numSegments > 0 ? Math.round(totalDataSize / numSegments) : 0;
    const totalOverhead = (numSegments * 20) + (numPackets * 20) + (numFrames * 18); // TCP + IP + Ethernet headers
    const efficiency = totalDataSize > 0 ? Math.round((totalDataSize / (totalDataSize + totalOverhead)) * 100) : 0;
    
    // Get protocol info
    const protocolName = transmissionState.messageType.toUpperCase();
    const protocolPort = transmissionState.destPort;
    
    const summaryHTML = `
        <div class="summary-grid">
            <div class="summary-card">
                <h3>Data Transmission Overview</h3>
                <p><strong>Message Type:</strong> ${protocolName}</p>
                <p><strong>Original Data Size:</strong> ${totalDataSize} bytes</p>
                <p><strong>Total Overhead:</strong> ${totalOverhead} bytes</p>
                <p><strong>Efficiency:</strong> ${efficiency}%</p>
                <p><strong>Error Simulation:</strong> ${transmissionState.errorType === 'none' ? 'None' : transmissionState.errorType}</p>
            </div>
            
            <div class="summary-card">
                <h3>Transport Layer (TCP)</h3>
                <p><strong>Segments Created:</strong> ${numSegments}</p>
                <p><strong>MSS (Max Segment Size):</strong> ${transmissionState.mss} bytes</p>
                <p><strong>Average Segment Size:</strong> ${avgSegmentSize} bytes</p>
                <p><strong>Source Port:</strong> ${transmissionState.sourcePort}</p>
                <p><strong>Destination Port:</strong> ${protocolPort}</p>
                <p><strong>Connection:</strong> Established (3-way handshake) & Closed (4-way teardown)</p>
            </div>
            
            <div class="summary-card">
                <h3>Network Layer (IP)</h3>
                <p><strong>IP Packets Created:</strong> ${numPackets}</p>
                <p><strong>Source IP:</strong> ${transmissionState.sourceIP}</p>
                <p><strong>Destination IP:</strong> ${transmissionState.destIP}</p>
                <p><strong>Protocol:</strong> TCP (Protocol 6)</p>
                <p><strong>IP Header Size:</strong> 20 bytes each</p>
                <p><strong>Routing Path:</strong> Source → Router 1 → Router 2 → Destination</p>
            </div>
            
            <div class="summary-card">
                <h3>Data Link Layer (Ethernet)</h3>
                <p><strong>Frames Created:</strong> ${numFrames}</p>
                <p><strong>Source MAC:</strong> ${transmissionState.sourceMAC}</p>
                <p><strong>Destination MAC:</strong> ${transmissionState.destMAC}</p>
                <p><strong>EtherType:</strong> 0x0800 (IPv4)</p>
                <p><strong>Ethernet Header:</strong> 14 bytes</p>
                <p><strong>CRC (Error Detection):</strong> 4 bytes per frame</p>
            </div>
            
            <div class="summary-card">
                <h3>Physical Layer</h3>
                <p><strong>Encoding Method:</strong> Manchester Encoding</p>
                <p><strong>Total Bits Transmitted:</strong> ${(totalDataSize + totalOverhead) * 8} bits</p>
                <p><strong>Frame Size:</strong> ${numFrames > 0 ? transmissionState.frames[0].totalLength : 0} bytes (first frame)</p>
                <p><strong>Transmission Medium:</strong> Simulated network cable</p>
            </div>
            
            <div class="summary-card">
                <h3>Encapsulation Summary</h3>
                <p><strong>Layer 5 (Application):</strong> ${protocolName} data</p>
                <p><strong>Layer 4 (Transport):</strong> + TCP Header (20B)</p>
                <p><strong>Layer 3 (Network):</strong> + IP Header (20B)</p>
                <p><strong>Layer 2 (Data Link):</strong> + Ethernet Header (14B) + CRC (4B)</p>
                <p><strong>Layer 1 (Physical):</strong> Binary transmission</p>
                <p style="margin-top: 8px; padding-top: 8px; border-top: 2px solid var(--primary-light);"><strong>Total per frame:</strong> Data + 58 bytes overhead</p>
            </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: var(--primary-lightest); border-radius: 8px; border-left: 4px solid var(--primary-color);">
            <h3 style="color: var(--primary-color); margin-bottom: 10px; font-size: 14px;">What You Just Saw:</h3>
            <ul style="font-size: 12px; line-height: 1.8; margin-left: 20px;">
                <li><strong>DNS Lookup:</strong> Domain name "${transmissionState.domain}" was resolved to IP address "${transmissionState.destIP}"</li>
                <li><strong>TCP Handshake:</strong> Connection established using SYN, SYN-ACK, ACK sequence</li>
                <li><strong>Data Segmentation:</strong> Original message was divided into ${numSegments} segment(s) of max ${transmissionState.mss} bytes each</li>
                <li><strong>Header Addition:</strong> Each layer added its own header for addressing, routing, and error checking</li>
                <li><strong>Encapsulation:</strong> Data was wrapped at each layer (Application → TCP → IP → Ethernet → Bits)</li>
                <li><strong>Physical Transmission:</strong> Data converted to binary and transmitted using Manchester encoding</li>
                <li><strong>TCP Teardown:</strong> Connection closed gracefully using FIN-ACK sequence</li>
            </ul>
        </div>
    `;
    
    packetDetails.innerHTML = summaryHTML;
    detailsPanel.classList.add('show-summary');
    
    log('Transmission summary generated', 'success');
}

// Packet Details Display
function showPacketDetails(data, type) {
    const detailsDiv = document.getElementById('packetDetails');
    
    let html = '<h3>Edit Packet/Segment/Frame Details</h3>';
    
    if (type === 'segment') {
        html += `
            <div class="detail-field">
                <label>Segment Number:</label>
                <input type="text" value="${data.segmentNum}" class="readonly" readonly>
            </div>
            <div class="detail-field">
                <label>Source Port:</label>
                <input type="number" id="edit-sourcePort" value="${data.sourcePort}">
            </div>
            <div class="detail-field">
                <label>Destination Port:</label>
                <input type="number" id="edit-destPort" value="${data.destPort}">
            </div>
            <div class="detail-field">
                <label>Sequence Number:</label>
                <input type="number" id="edit-seqNum" value="${data.sequenceNum}">
            </div>
            <div class="detail-field">
                <label>Flags:</label>
                <input type="text" id="edit-flags" value="${data.flags}">
            </div>
            <div class="detail-field">
                <label>Window Size:</label>
                <input type="number" id="edit-windowSize" value="${data.windowSize}">
            </div>
            <div class="detail-field">
                <label>Checksum:</label>
                <input type="text" value="0x${data.checksum}" class="readonly" readonly>
            </div>
            <div class="detail-field">
                <label>Data Length:</label>
                <input type="text" value="${data.dataLength} bytes" class="readonly" readonly>
            </div>
        `;
    } else if (type === 'packet') {
        html += `
            <div class="detail-field">
                <label>Packet Number:</label>
                <input type="text" value="${data.packetNum}" class="readonly" readonly>
            </div>
            <div class="detail-field">
                <label>IP Version:</label>
                <input type="text" value="IPv${data.version}" class="readonly" readonly>
            </div>
            <div class="detail-field">
                <label>Source IP:</label>
                <input type="text" id="edit-srcIP" value="${data.sourceIP}">
            </div>
            <div class="detail-field">
                <label>Destination IP:</label>
                <input type="text" id="edit-dstIP" value="${data.destIP}">
            </div>
            <div class="detail-field">
                <label>TTL (Time To Live):</label>
                <input type="number" id="edit-ttl" value="${data.ttl}">
            </div>
            <div class="detail-field">
                <label>Protocol:</label>
                <input type="text" value="TCP (${data.protocol})" class="readonly" readonly>
            </div>
            <div class="detail-field">
                <label>Total Length:</label>
                <input type="text" value="${data.totalLength} bytes" class="readonly" readonly>
            </div>
            <div class="detail-field">
                <label>Identification:</label>
                <input type="number" id="edit-identification" value="${data.identification}">
            </div>
        `;
    } else if (type === 'frame') {
        html += `
            <div class="detail-field">
                <label>Frame Number:</label>
                <input type="text" value="${data.frameNum}" class="readonly" readonly>
            </div>
            <div class="detail-field">
                <label>Source MAC Address:</label>
                <input type="text" id="edit-srcMAC" value="${data.sourceMAC}">
            </div>
            <div class="detail-field">
                <label>Destination MAC Address:</label>
                <input type="text" id="edit-dstMAC" value="${data.destMAC}">
            </div>
            <div class="detail-field">
                <label>EtherType:</label>
                <input type="text" value="${data.etherType}" class="readonly" readonly>
            </div>
            <div class="detail-field">
                <label>CRC (Checksum):</label>
                <input type="text" value="0x${data.crc}" class="readonly" readonly>
            </div>
            <div class="detail-field">
                <label>Frame Length:</label>
                <input type="text" value="${data.totalLength} bytes" class="readonly" readonly>
            </div>
        `;
    }
    
    html += `
        <button onclick="applyPacketEdits('${type}')" class="btn-primary" style="margin-top: 20px;">
            Apply Changes
        </button>
        <p style="margin-top: 15px; color: #6c757d; font-size: 14px;">
            <strong>Note:</strong> Changes are for educational purposes and will be reflected in the visualization.
        </p>
    `;
    
    detailsDiv.innerHTML = html;
}

function applyPacketEdits(type) {
    log('✏️ Packet details updated (educational simulation)', 'success');
    alert('Changes applied! In a real network, modified packets would be transmitted with new values.');
}

// Utility: Generate Checksum
function generateChecksum(data) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        sum += data.charCodeAt(i);
    }
    return (sum % 65536).toString(16).toUpperCase().padStart(4, '0');
}

// Reset Simulation
function resetSimulation() {
    transmissionState = {
        message: '',
        messageType: 'email',
        mss: 1460,
        sourceIP: '192.168.1.100',
        destIP: '203.0.113.50',
        sourceMAC: 'AA:BB:CC:DD:EE:FF',
        destMAC: '11:22:33:44:55:66',
        sourcePort: 0,
        destPort: 0,
        domain: 'www.example.com',
        segments: [],
        packets: [],
        frames: [],
        currentStep: 0,
        errorType: 'none',
        isRunning: false
    };
    
    // Clear visualizations
    document.getElementById('dnsSection').style.display = 'none';
    document.getElementById('appData').innerHTML = '<div class="packet-content">Waiting for data...</div>';
    document.getElementById('tcpHandshake').style.display = 'none';
    document.getElementById('segmentsView').innerHTML = '';
    document.getElementById('packetsView').innerHTML = '';
    document.getElementById('framesView').innerHTML = '';
    document.getElementById('binaryData').textContent = '';
    document.getElementById('tcpTeardown').style.display = 'none';
    document.getElementById('packetDetails').innerHTML = '<p>Summary will appear here after transmission completes</p>';
    document.getElementById('logContainer').innerHTML = '';
    
    // Hide summary
    document.getElementById('detailsPanel').classList.remove('show-summary');
    
    // Clear canvas
    const canvas = document.getElementById('signalCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Remove active classes
    document.querySelectorAll('.layer').forEach(layer => {
        layer.classList.remove('active', 'processing');
    });
    
    // Reset status
    updateStatus('Idle', 0, 0);
    
    log('Simulation reset', 'info');
}

// Add flowing data effect
function addDataFlowEffect(element) {
    element.classList.add('data-flowing');
    setTimeout(() => {
        element.classList.remove('data-flowing');
    }, 2000);
}

// Initialize
log('TCP/IP Learning Platform initialized. Ready to start!', 'success');
