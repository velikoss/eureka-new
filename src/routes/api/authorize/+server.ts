import { sendMessageToWebSocketServer } from '$lib/server/ws';
import { error, json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import sha256 from 'crypto-js/sha256';
import { Md5 } from 'ts-md5';
import { moduleState, signRequest } from '$lib/server/armapi';

export async function POST({ request, cookies }) {
    const {email, password, challenge} = await request.json();
    const session = cookies.get('sessionID');
    let key: string = "";

    var hash = Md5.hashStr(`0_${password}_${challenge}`);
    if (moduleState()) {
        try {
            key = signRequest(
                email != parseInt(email) ? sha256(email).words[0] : email, 
                hash
            );
        } catch (e: any) {
            error(500, {
                "message": `Error on server side: ${e}`
            });
        }
    }
    else {
        key = sha256(hash).toString();
    }

    const response = await new Promise((resolve, reject) => {
        sendMessageToWebSocketServer(session, `{"data":{"user_id":"${email}","password":"${password}","key":"${key}","gen":0,"g2a":0},"ser_task":"authorize","arm_task_id":"${uuidv4()}","v":173}`, (data) => {
            resolve(data);
        });
    });

    return json(response);
}