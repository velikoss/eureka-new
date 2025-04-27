import { sendMessageToWebSocketServer } from '$lib/server/ws';
import { error, json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import sha256 from 'crypto-js/sha256';
import { Md5 } from 'ts-md5';
import { moduleState, signRequest } from '$lib/server/armapi';
import { BugIcon } from '@lucide/svelte';

export async function POST({ request, cookies }) {
    const {email, password, key} = await request.json();
    let newKey = key;
    const session = cookies.get('sessionID');
    // let version = await new Promise((resolve) => {
    //     sendMessageToWebSocketServer(session, `{"data":{},"ser_task":"getStudentArmVersion","arm_task_id":"newChallenge_${uuidv4()}","v":173}`, (data) => {
    //         resolve(data.data);
    //     });
    // });
    // console.log(version);
    if (!key) {
        let challenge = await new Promise((resolve) => {
            sendMessageToWebSocketServer(session, `{"data":{},"ser_task":"newChallenge","arm_task_id":"newChallenge_${uuidv4()}","v":${version}}`, (data) => {
                resolve(data.data);
            });
        });
        var hash = Md5.hashStr(`0_${password}_${challenge}`);

        if (moduleState()) {
            try {
                newKey = signRequest(
                    email != parseInt(email) ? sha256(email).words[0] : email, 
                    hash
                );
                
            } catch (e: any) {
                // console.log(e)
                error(500, {
                    "message": `Error on server side: ${e}`
                });
            }
        }
        else {
            // console.log("Fallback")
            newKey = sha256(hash).toString();
        }
    }
    const response = await new Promise((resolve, reject) => {
        sendMessageToWebSocketServer(session, `{"data":{"user_id":"${email}","password":"${password}","key":"${newKey}","gen":0,"g2a":0},"ser_task":"authorize","arm_task_id":"${(Math.random() * 10000000).toFixed(0)}","v":${196}}`, (data) => {
            resolve(data);
        });
    });
    console.log(response);
    return json(response);
}
