import { encodeJWT, decodeJWT } from "$lib/server/jwt";
import { getWebSocketClient, connectToWebSocketServer, sendMessageToWebSocketServer, getClient } from "$lib/server/ws";
import { redirect } from "@sveltejs/kit";
import { v4 as uuidv4 } from 'uuid';

export async function load({ cookies }) {
	const session = cookies.get('sessionID') as string;
	if (session) {
		var _id = decodeJWT(session); 
	 	if (_id && getClient(session)) {
			if (getClient(session)?.user) {
				const response = await new Promise((resolve, reject) => {
					sendMessageToWebSocketServer(session, `{"data":{},"ser_task":"getStudentArmVersion","arm_task_id":"${uuidv4()}","v":165}`, (responseData) => {
						let client = getClient(session)!;
						client.version = responseData.data as number;
						resolve({
							sessionID: session,
							client: client,
						});
					});
				})
				return response;
			}
			return;
		}
	}

	var id = uuidv4();
	var sessionID = encodeJWT(id);
	cookies.set('sessionID', sessionID, { path: '/' });
	await connectToWebSocketServer(sessionID, "wss://mirea.aco-avrora.ru/student/arm/", {
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
		"Origin": "https://mirea.aco-avrora.ru"
	})
	return redirect(307, "/app/login");
}