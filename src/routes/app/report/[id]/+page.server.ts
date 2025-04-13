import { Task } from '$lib';
import { redirect } from '@sveltejs/kit';
import { hasContext, setContext } from 'svelte';

export async function load({ cookies, params, fetch, parent }) { 
    const session = cookies.get('sessionID') as string;
    if (session) {
        await parent();
        const response = await new Promise(async (resolve, reject) => {
            const taskJSON = await fetch("/api/getTaskReport", {
                method: "POST",
                body: JSON.stringify({
                    id: params.id.toString()
                })
            })
            const json = await taskJSON.json();
            const report_pdf = json.data.report_pdf;
            
            resolve({
                report_pdf: report_pdf
            })
        });
        return response;
    } else {
        return redirect(307, "/app/login");
    }
}
