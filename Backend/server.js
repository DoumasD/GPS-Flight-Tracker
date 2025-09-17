const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const wss = new WebSocket.Server({ port: 8080 }); // WebSocket server listens on port 8080
let serialPortInstance;

wss.on('connection', ws => {
    console.log('Client connected');

    ws.on('message', message => {
        const data = JSON.parse(message);

        if (data.type === 'openSerialPort') {
            const { type, port, baudRate } = data;
            
                serialPortInstance = new SerialPort({
                    path: port,
                    baudRate:  parseInt(baudRate)
                });

                const parser = serialPortInstance.pipe(new ReadlineParser({ delimiter: '\n' }));

                serialPortInstance.on('open', () => {
                    console.log(`Serial port ${port} opened at ${baudRate} baud`);
                    ws.send(JSON.stringify({ type: 'status', message: `Serial port ${port} opened successfully.` }));
                });

                serialPortInstance.on('error', err => {
                    console.error('Serial port error:', err.message);
                    ws.send(JSON.stringify({ type: 'error', message: `Serial port error: ${err.message}` }));
                });

                parser.on('data', serialData => {
                    ws.send(JSON.stringify({ type: 'serialData', data: serialData.trim()}));
                });

        } else if(data.type === 'getSerialPorts') { 
           
           SerialPort.list()
            .then(ports => {
                const portNames = ports.map(port => port.path);
                ws.send(JSON.stringify({ type: 'serialPorts', data: portNames }));
            })
            .catch(err => {
                console.error('Error listing serial ports:', err);
                ws.send(JSON.stringify({ type: 'error', message: 'Failed to list serial ports' }));
            });
     
       } else if (data.type === 'sendToSerial' && serialPortInstance && serialPortInstance.isOpen) {
            serialPortInstance.write(data.message + '\n', (err) => {
                if (err) {
                    console.error('Error writing to serial port:', err.message);
                    ws.send(JSON.stringify({ type: 'error', message: `Error writing to serial port: ${err.message}` }));
                } else {
                    console.log(`Sent to serial: ${data.message}`);
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        
            serialPortInstance.close(() => {
                console.log('Serial port closed due to client disconnect');
            });
        
    });

    ws.on('error', error => {
        console.error('WebSocket error:', error);
    });
});

console.log('WebSocket server started on port 8080');
