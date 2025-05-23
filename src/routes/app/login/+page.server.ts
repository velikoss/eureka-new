import { decodeJWT } from '$lib/server/jwt';
import { closeWebSocketConnection, getClient, getWebSocketClient, sendMessageToWebSocketServer, updateClient, type User } from '$lib/server/ws';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { goto } from '$app/navigation';
import { moduleState } from '$lib/server/armapi';
import { commit, commitDate } from '$lib/server/git';
import sha256 from 'crypto-js/sha256';
import { Md5 } from 'ts-md5';
import { v4 } from 'uuid';


export const actions = {
	default: async ({ cookies, request, fetch }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
        const key = data.get('key');

        let session = cookies.get("sessionID");

        if (session && getClient(session) && getClient(session)?.user && getClient(session)?.user!.email == email?.valueOf()) {
            throw redirect(303, "/app");
        }
        const jwt = session ? decodeJWT(session)! : 0;
        if (!session || (!getWebSocketClient(jwt) || getWebSocketClient(jwt)?.readyState !== 1)) {
            // console.log(jwt, session, getWebSocketClient(jwt), getWebSocketClient(jwt)?.readyState)
            throw redirect(303, "/app/login?renewToken=true");
        }

            let user = await (await fetch("/api/authorize", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                    key,
                })
            })).json();
            
            if (!user.success) {
                //console.log(user);
                return fail(400, {error: user.error, data: {email, password}})
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
    let session = cookies.get("sessionID");

	if (url.searchParams.get("logout")) {
        closeWebSocketConnection(cookies.get("sessionID")??"0");
        cookies.delete("sessionID", {path: "/"});
        throw redirect(307, "/app");
    }
    return {
        session,
        neoscrypt: moduleState(),
        commit: commit(),
        commitDate: (await commitDate()).mtime.toDateString(),
    }
}
