import type { HomeTask, News, Section } from "$lib";
import { encodeJWT, decodeJWT } from "$lib/server/jwt";
import { getWebSocketClient, connectToWebSocketServer, sendMessageToWebSocketServer, getClient } from "$lib/server/ws";
import { redirect } from "@sveltejs/kit";
import { v4 as uuidv4 } from 'uuid';

export async function load({ cookies, fetch }) {
    const session = cookies.get('sessionID') as string;
    if (session) {
        var _id = decodeJWT(session); 
        if (_id && getClient(session)) {
            if (getClient(session)?.user) {
                const response = await new Promise(async (resolve, reject) => {
                    let _client;
                    sendMessageToWebSocketServer(session, `{"data":{},"ser_task":"getStudentArmVersion","arm_task_id":"${uuidv4()}","v":165}`, (responseData) => {
                        let client = getClient(session)!;
                        client.version = responseData.data as number;
                        _client = client;	
                    });

					let _news = (await fetch("/api/loadNews"));
					let newsJSON = (await _news.json())
					let news = newsJSON.success ? (newsJSON.data as News[]) : [];

                    let _units = (await fetch("/api/getUnitsList"));
                    let unitsJSON = (await _units.json());
                    let units = unitsJSON.success ? (unitsJSON.data as Section[]) : [];

                    let _tasks = (await fetch("/api/getTaskList"));
                    let tasksJSON = (await _tasks.json());
                    let tasks = tasksJSON.success ? (tasksJSON.data as HomeTask[]) : [];

                    // Combine tasks with their respective units and nested sections
                    const combinedData = units.map(unit => {
                        // Map tasks to the main unit
                        let unitTasks = tasks.filter(task => task.section_id === unit.rowid);

                        // Map tasks to nested sections
                        const nestedWithTasks = Object.entries(unit.nested).map(([nestedId, nestedSection]) => {
                            const nestedTasks = tasks.filter(task => task.section_id === parseInt(nestedId));
                            unitTasks = [...unitTasks, ...nestedTasks]
							return {
								...nestedSection
							}
                        });

                        return {
                            ...unit,
                            tasks: unitTasks,
							nested: nestedWithTasks
                        };
                    });

                    resolve({
                        sessionID: session,
                        client: _client,
                        units: combinedData,
						news: news
                    });
                });
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
    });
    return redirect(307, "/app/login");
}