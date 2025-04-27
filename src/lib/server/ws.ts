import WebSocket from 'ws';
import { decodeJWT } from './jwt';

type WebSocketClientMetadata = {
    ws: WebSocket | null;
    version: number;
    user: User | null;
    lastMessageReceivedTime: number | null;
    lastTaskId: number; // Add this field to track the last task ID
};

export interface User {
    id: number;
    group_id: number;
    group_name: string;
    student_name: string;
    student_suname: string;
    student_patronymic: string;
    email: string | null;
    st: number | undefined;
    alert: number | 0;
}

type WebSocketClientMap = Map<string, WebSocketClientMetadata>;
type CallbackFunction = (data: any) => void;

const wsClients: WebSocketClientMap = new Map();
const callbackMap: Map<string, CallbackFunction> = new Map();

export function updateClient(clientId: string, newClient: WebSocketClientMetadata) {
    const re = decodeJWT(clientId);
    if (!re) {
        return;
    }
    newClient.ws! = wsClients.get(re)?.ws!;
    wsClients.set(re, newClient);
}

export function getClient(clientId: string): WebSocketClientMetadata | undefined {
    if (clientId === "0") return undefined;

    const re = decodeJWT(clientId);
    if (!re) {
        return undefined;
    }

    if (wsClients.has(re)) {
        const existingConnection = wsClients.get(re);
        return {
            ws: null,
            user: existingConnection!.user,
            version: existingConnection!.version,
            lastMessageReceivedTime: existingConnection!.lastMessageReceivedTime,
            lastTaskId: existingConnection!.lastTaskId
        };
    }
    return undefined;
}

export function connectToWebSocketServer(
    clientId: string,
    serverUrl: string,
    headers: Record<string, string>
): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
        const re = decodeJWT(clientId);
        if (!re) {
            reject(new Error('Invalid client ID'));
            return;
        }

        if (wsClients.has(re)) {
            const existingConnection = wsClients.get(re);
            if (existingConnection && existingConnection.ws?.readyState === WebSocket.OPEN) {
                resolve(existingConnection.ws);
                return;
            } else {
                wsClients.delete(re);
            }
        }

        const ws = new WebSocket(serverUrl, { headers });

        ws.on('open', () => {
            wsClients.set(re, {
                ws, 
                lastMessageReceivedTime: null,
                version: 0,
                user: null,
                lastTaskId: -1 // Initialize task ID counter
            });
            const interval = setInterval(() => {
                if ((Date.now() - (wsClients.get(re)?.lastMessageReceivedTime??0)) <= 15 * 60 * 1000) return;
                ws.close();
                clearInterval(interval);
            }, 60000)
            setTimeout(() => {
                sendMessageToWebSocketServer(re, `{"data":{},"ser_task":"getStudentArmVersion","arm_task_id":0,"v":196}`);
                sendMessageToWebSocketServer(re, `{"data":{},"ser_task":"getAuthInstituteList","arm_task_id":1,"v":196}`);
                sendMessageToWebSocketServer(re, `{"data":{"institute_id":"1","course":"1"},"ser_task":"getAuthGroupList","arm_task_id":2,"v":196}`);
                sendMessageToWebSocketServer(re, `{"data":"","ser_task":"getAuthUserList","arm_task_id":3,"v":196}`);
            }, 1000)
            resolve(ws);
        });

        ws.on('error', (error) => {
            console.error(`WebSocket connection error for client ${clientId}:`, error);
            if (error && error.message && error.message.includes('400')) {
                console.error('Server rejected the connection with a 400 Bad Request. Check headers and URL.');
            }
            wsClients.delete(re);
            reject(error);
        });

        ws.on('close', () => {
            wsClients.delete(re);

            // Clean up callbacks for this client
            callbackMap.forEach((_, key) => {
                if (key.startsWith(re)) {
                    callbackMap.delete(key);
                }
            });
        });

        ws.on('message', (message) => {
            console.log(`Received message from client ${clientId}:`, message.toString());

            let parsedMessage;
            try {
                parsedMessage = JSON.parse(message.toString());
            } catch (error) {
                console.error('Failed to parse incoming message:', error);
                return;
            }

            const { arm_task_id, success } = parsedMessage;
            if (!success) {
                console.log(parsedMessage);
            }
            
            // The callback key now includes both client ID and task ID
            const callbackKey = `${re}_${arm_task_id}`;
            if (arm_task_id && callbackMap.has(callbackKey)) {
                const callback = callbackMap.get(callbackKey);
                if (callback) {
                    setTimeout(() => callback(parsedMessage), 0);
                }
                callbackMap.delete(callbackKey);
            }

            const clientMetadata = wsClients.get(re);
            if (clientMetadata) {
                clientMetadata.lastMessageReceivedTime = Date.now();
            }
        });
    });
}

export function sendMessageToWebSocketServer(
    clientId: string,
    message: string,
    callback?: CallbackFunction
): void {
    const id = decodeJWT(clientId);
    if (!id) {
        console.error('Invalid client ID');
        return;
    }
    const ws = getWebSocketClient(id);
    if (ws && ws.readyState === WebSocket.OPEN) {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message);
        } catch (error) {
            console.error('Failed to parse message:', error);
            return;
        }

        // Get the client metadata
        const clientMetadata = wsClients.get(id);
        if (!clientMetadata) {
            console.error('Client metadata not found');
            return;
        }

        // Increment and set the task ID
        clientMetadata.lastTaskId += 1;
        const taskId = clientMetadata.lastTaskId;
        parsedMessage.arm_task_id = taskId;

        const updatedMessage = JSON.stringify(parsedMessage);
        const callbackKey = `${id}_${taskId}`; // Unique key combining client ID and task ID

        if (callback) {
            callbackMap.set(callbackKey, callback);
        }

        ws.send(updatedMessage, (error) => {
            if (error) {
                console.error(`Failed to send message to client ${clientId}:`, error);
                callbackMap.delete(callbackKey);
            } else {
                console.log(`Message sent to client ${clientId}:`, updatedMessage);
            }
        });
    } else {
        console.error(`WebSocket connection for client ${clientId} is not open.`);
    }
}

export function getWebSocketClient(clientId: string): WebSocket | undefined {
    return wsClients.get(clientId)?.ws??undefined;
}

export function getLastMessageReceivedTime(clientId: string): number | null {
    return wsClients.get(clientId)?.lastMessageReceivedTime || null;
}

export function closeWebSocketConnection(clientId: string): void {
    if (clientId === "0") return;

    const jwt = decodeJWT(clientId);
    const clientMetadata = wsClients.get(jwt!);
    if (clientMetadata) {
        clientMetadata.ws?.close();
        wsClients.delete(clientId);
    } else {
        console.error(`No WebSocket connection found for client ${clientId}.`);
    }
}