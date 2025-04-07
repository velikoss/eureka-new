// {"data":{"idTask":3686392,"test":{"test_input_data":"2 3","test_output_data":"4 5","test_comment":"6"}},"ser_task":"addTaskTest","arm_task_id":31,"v":174}
// response {"success":true,"data":[{"rowid":1545391}],"arm_task_id":31,"_type":"rsp"}

import type { Task } from '$lib';
import { sendMessageToWebSocketServer } from '$lib/server/ws';
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

export async function POST({ request, cookies }) {
    const session = cookies.get('sessionID')!;
    let _json = await request.text();

    const response = await new Promise((resolve, reject) => {
        sendMessageToWebSocketServer(session, `{"data":${_json},"ser_task":"editTaskTest","arm_task_id":"saveTask_${uuidv4()}","v":170}`, (data) => {
            resolve(data);
        });
    });

    return json(response);
}
