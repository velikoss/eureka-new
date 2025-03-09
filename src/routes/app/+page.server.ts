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

// Combine tasks with their respective units and nested sections
function combineTasksWithUnits(units: Section[], tasks: HomeTask[]): Section[] {
    return units.map(unit => {
        // Map tasks to the main unit
        let unitTasks = tasks.filter(task => task.section_id === unit.rowid);

        // Map tasks to nested sections
        const nestedWithTasks = Object.entries(unit.nested).map(([nestedId, nestedSection]) => {
            const nestedTasks = tasks.filter(task => task.section_id === parseInt(nestedId));
            unitTasks = [...unitTasks, ...nestedTasks];
            return {
                ...nestedSection,
                tasks: nestedTasks
            };
        });

        return {
            ...unit,
            tasks: unitTasks,
            nested: nestedWithTasks
        };
    });
}

export async function load({ cookies, fetch, locals }) {
    const session = cookies.get('sessionID') as string;

    try {
        // Fetch all data in parallel
        const [news, units, tasks] = await Promise.all([
            fetchData<News[]>("/api/loadNews", fetch),
            fetchData<Section[]>("/api/getUnitsList", fetch),
            fetchData<HomeTask[]>("/api/getTaskList", fetch)
        ]);

        // Combine tasks with units and nested sections
        const combinedData = combineTasksWithUnits(units || [], tasks || []);

        return {
            sessionID: session,
            units: combinedData,
            news: news || [],
            user: locals.user
        };
    } catch (error) {
        console.error("Error in load function:", error);
        return {
            sessionID: session,
            units: [],
            news: [],
            user: locals.user
        };
    }
}