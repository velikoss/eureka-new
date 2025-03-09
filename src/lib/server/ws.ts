import WebSocket from 'ws';
import { decodeJWT } from './jwt';
import { decode } from 'jsonwebtoken';

type WebSocketClientMetadata = {
    ws: WebSocket | null;
    version: number;
    user: User | null;
    lastMessageReceivedTime: number | null;
};

export interface User {
    id: number;
    group_id: number;
    group_name: string;
    student_name: string;
    student_suname: string;
    student_patronymic: string;
    email: string | null;
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
    if (clientId === "0") return;

    const re = decodeJWT(clientId);
    if (!re) {
        return;
    }

    if (wsClients.has(re)) {
        const existingConnection = wsClients.get(re);
        return {
            ws: null,
            user: existingConnection!.user,
            version: existingConnection!.version,
            lastMessageReceivedTime: existingConnection!.lastMessageReceivedTime
        };
    }
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
                // console.log(`Client ${re} already connected.`);
                resolve(existingConnection.ws);
                return;
            } else {
                wsClients.delete(re);
            }
        }

        const ws = new WebSocket(serverUrl, { headers });

        ws.on('open', () => {
            // console.log(`Connected to WebSocket server for client ${clientId}`);
            wsClients.set(re, {
                ws, lastMessageReceivedTime: null,
                version: 0,
                user: null
            });
            resolve(ws);
        });

        ws.on('error', (error) => {
            console.error(`WebSocket connection error for client ${clientId}:`, error);
            if (error.message.includes('400')) {
                console.error('Server rejected the connection with a 400 Bad Request. Check headers and URL.');
            }
            wsClients.delete(re);
            reject(error);
        });

        ws.on('close', () => {
            // console.log(`WebSocket connection closed for client ${clientId}`);
            wsClients.delete(re);

            // Clean up callbacks for this client
            callbackMap.forEach((_, key) => {
                if (key.startsWith(re)) {
                    callbackMap.delete(key);
                }
            });
        });

        ws.on('message', (message) => {
            // console.log(`Received message from client ${clientId}:`, message.toString());

            let parsedMessage;
            try {
                parsedMessage = JSON.parse(message.toString());
            } catch (error) {
                console.error('Failed to parse incoming message:', error);
                return;
            }

            const { arm_task_id } = parsedMessage;
            if (arm_task_id && callbackMap.has(arm_task_id)) {
                const callback = callbackMap.get(arm_task_id);
                if (callback) {
                    callback(parsedMessage);
                }
                callbackMap.delete(arm_task_id);
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

        const { arm_task_id } = parsedMessage;
        if (!arm_task_id) {
            console.error('No arm_task_id found in the message');
            return;
        }

        if (callback) {
            callbackMap.set(arm_task_id, callback);
        }

        ws.send(message, (error) => {
            if (error) {
                console.error(`Failed to send message to client ${clientId}:`, error);
                callbackMap.delete(arm_task_id);
            } else {
                // console.log(`Message sent to client ${clientId}:`, message);
            }
        });
    } else {
        console.error(`WebSocket connection for client ${clientId} is not open.`);
    }
}

export function getWebSocketClient(clientId: string): WebSocket | undefined {
    return wsClients.get(clientId)?.ws!;
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
        // console.log(`WebSocket connection for client ${clientId} closed.`);
    } else {
        console.error(`No WebSocket connection found for client ${clientId}.`);
    }
}