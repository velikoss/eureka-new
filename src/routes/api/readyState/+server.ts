import { decodeJWT } from '$lib/server/jwt';
import { getWebSocketClient, sendMessageToWebSocketServer } from '$lib/server/ws';
import { json } from '@sveltejs/kit';
import { v4 } from 'uuid';

export async function GET({ cookies }) {
    const sessionID = cookies.get('sessionID');
    return json(getWebSocketClient(decodeJWT(sessionID)!)?.readyState!);
}