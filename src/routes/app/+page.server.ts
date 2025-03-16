import type { HomeTask, News, Section } from "$lib";
import { redirect } from "@sveltejs/kit";

// Utility function to fetch and parse JSON data
async function fetchData<T>(url: string, fetch: typeof globalThis.fetch): Promise<T | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.success ? data.data : null;
    } catch (error) {
        console.error(`Failed to fetch data from ${url}:`, error);
        return null;
    }
}

export async function load({ cookies, fetch, locals }) {
    const session = cookies.get('sessionID') as string;

    try {
        return {
            sessionID: session,
            units: fetchData<Section[]>("/api/getUnitsList", fetch) || [],
            tasks: fetchData<HomeTask[]>("/api/getTaskList", fetch) || [],
            news: fetchData<News[]>("/api/loadNews", fetch) || [],
            user: locals.user
        };
    } catch (error) {
        console.error("Error in load function:", error);
        return {
            sessionID: session,
            units: [],
            tasks: [],
            news: [],
            user: locals.user
        };
    }
}
