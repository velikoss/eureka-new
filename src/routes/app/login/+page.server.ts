import { decodeJWT } from '$lib/server/jwt';
import { getClient, getWebSocketClient, sendMessageToWebSocketServer, updateClient, type User } from '$lib/server/ws';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { goto } from '$app/navigation';

export const actions = {
	default: async ({ cookies, request, fetch }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
    
        let session = cookies.get("sessionID");

        if (!session || (getClient(session)?.user && getClient(session)?.user!.email == email?.valueOf() as string && getWebSocketClient(session)?.readyState === 1)) {
            throw redirect(303, "/app");
        }

        let challenge = (await (await fetch("/api/newChallenge")).json()).response;
        let user = await (await fetch("/api/authorize", {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
                challenge
            })
        })).json();
        if (!user.success) {
            // console.log(user);
            return fail(400, {error: user.error})
        } else {
            let client = getClient(session!);
            // console.log(user);
            client!.user = user.student as User;
            client!.user!.email = email?.valueOf() as string;
            updateClient(session!, client!);
            throw redirect(303, "/app");
        }
	},
} satisfies Actions;

export async function load({ cookies }) { 
	const session = cookies.get('sessionID') as string;
    if (session) {
		var _id = decodeJWT(session); 
	 	if (_id && getClient(session)) {
            return;
        }
    }
    return redirect(307, "/app");
}