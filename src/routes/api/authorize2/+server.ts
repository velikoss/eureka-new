import { sendMessageToWebSocketServer } from '$lib/server/ws';
import { error, json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import sha256 from 'crypto-js/sha256';
import { Md5 } from 'ts-md5';
import { moduleState, signRequest } from '$lib/server/armapi';
import { BugIcon } from '@lucide/svelte';

export async function POST({ request, cookies }) {
    const {email, password, key} = await request.json();
    const session = cookies.get('sessionID');

    const response = await new Promise((resolve, reject) => {
        sendMessageToWebSocketServer(session, `{"data":{"user_id":"${email}","password":"${password}","key":"${key}","gen":0,"g2a":0},"ser_task":"authorize","arm_task_id":"authorize_${uuidv4()}","v":197}`, (data) => {
            resolve(data);
        });
    });
    return json(response);
}
