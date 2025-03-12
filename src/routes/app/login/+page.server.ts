import { decodeJWT } from '$lib/server/jwt';
import { closeWebSocketConnection, getClient, getWebSocketClient, sendMessageToWebSocketServer, updateClient, type User } from '$lib/server/ws';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { goto } from '$app/navigation';
import { moduleState } from '$lib/server/armapi';

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
            console.log(user);
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

export async function load({url, cookies, fetch}) { 
	if (url.searchParams.get("logout")) {
        closeWebSocketConnection(cookies.get("sessionID")??"0");
        cookies.delete("sessionID", {path: "/"});
        throw redirect(307, "/app");
    }
    return {
        neoscrypt: moduleState(),
    }
}