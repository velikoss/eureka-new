import { sendMessageToWebSocketServer } from '$lib/server/ws';
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import sha256 from 'crypto-js/sha256';
import { Md5 } from 'ts-md5';

export async function POST({ request, cookies }) {
    const {email, password, challenge} = await request.json();
    const session = cookies.get('sessionID');

    const response = await new Promise((resolve, reject) => {
        sendMessageToWebSocketServer(session, `{"data":{"user_id":"${email}","password":"${password}","key":"${sha256(Md5.hashStr(`0_${password}_${challenge}`, false)).toString()}","gen":0,"g2a":0},"ser_task":"authorize","arm_task_id":"${uuidv4()}","v":170}`, (data) => {
            resolve(data);
        });
    });

    return json(response);
}