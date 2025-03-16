// place files you want to import through the `$lib` alias in this folder.

export interface NestedSection {
    rowid: number;
    section_name: string;
    deadline_week: number;
    section_order: number;
}

export interface Section {
    rowid: number;
    section_name: string;
    deadline: number;
    deadline_week: number;
    max_points: number;
    section_order: number;
    course_id: number;
    nested: {
        [key: string]: NestedSection;
    };
    score?: number;
}

export interface HomeToolComment {
    text: any;
    type: string;
}

export interface HomeTaskTool {
    id: number;
    status: number;
    comments: HomeToolComment[];
}

export interface HomeTask {
    id: number;
    teacher_task_id: number;
    status: number;
    task_delay: any;
    tools: HomeTaskTool[];
    date_added: string;
    type: number;
    score: any;
    comment: any;
    name: string;
    parent_id: number;
    section_id: number;
    has_theory_text: boolean;
    subject_id: number;
    language_id: number;
    date_control: string;
    isLocked: boolean;
}

export const Tools = [
    "problem",
    "method",
    "algo",
    "algo-scheme",
    "code",
    "tests",
    "report",
    "aovt_operation",
    "acmas_p1_t1",
    "acmas_p1_t2",
    "acmas_send",
    "algo2",
    "intro",
    "conclusion",
    "method2",
]

export const ToolsLang: Map<string, string> = new Map([
    ["problem", "Постановка задачи"],
    ["method","Метод решения"],
    ["algo", "Алгоритм"],
    ["algo-scheme", "Блок-схема"],
    ["code", "Исходный код"],
    ["tests", "Тестирование"],
    ["report", "Отчет"],
    ["algo2", "Алгоритм"],
    ["method2", "Метод решения"],
     // idk i'm from the 1st course so cant know for sure what this is
    ["intro", "Введение"],
    ["conclusion", "conclusion"],
    ["aovt_operation", "aovt_operation"],
    ["acmas_p1_t1", "acmas_p1_t1"],
    ["acmas_p1_t2", "acmas_p1_t2"],
    ["acmas_send", "acmas_send"],
])

export interface Algo {
    id: number;
    no: number; // id + 1
    predicate: string;
    actions: string;
    next: string;
    comment: string;
}

export interface Algo2 {
    kind: string;
    class: string;
    access: string;
    name: string;
    params: string;
    ret: string;
    func: string;
    algo: Algo[];
}

export interface Tool {
    id: number;
    status: number;
}

//idk here
export interface Method2 {
    main: object;
    classes: object[];
}

// todo: any to corresponding types 
export interface Task {
    algo2: Algo2[];
    tools: Tool[];
    _armVer: number;
    method2: Method2;
    parent_id: number;
    __lastSaved: number;
    template_id: number;
    test_passed: boolean;
    task_readiness: number;
    graph_png_array: string;
    is_code_available: boolean;
    graph_svg: string;
    id: number;
    status: number;
    date_added: string;
    type: number;
    algo_text: string;
    algo_graph: string;
    method_description: string;
    comment: string;
    date_control: string;
    subject_id: number;
    teacher_name: string;
    teacher_surname: string;
    teacher_patronymic: string;
    name: string;
    task_text: string;
    task_input: string;
    theory_text: string;
    task_output: string;
}

export class TaskFile {
    name: string | undefined;
    file: string | undefined;
}

export interface TaskTest {
    rowid: number;
    student_task_id: number;
    test_input_data: string;
    test_output_data: string;
    test_comments: string;
    test_output_result: string;
    is_success: boolean;
    test_result: string;
}

export const _taskStatusNames = [
    '',
    'Не выполнено',
    'На проверке',
    'Доработать',
    'Сдано',
    'Доработать (оценено)',
    'На проверке (оценено)',
    'У куратора',
    'Сгорела'
];

export const taskStatusColors = {
    1: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200', // Не выполнено
    2: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200', // На проверке
    3: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200', // Доработать
    4: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200', // Сдано
    5: 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200', // Доработать (оценено)
    6: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200', // На проверке (оценено)
    7: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200', // У куратора
    8: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200', // Сгорела
};

export interface News {
    title: string;
    content: string;
    date_add: string;
}