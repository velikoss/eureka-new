import type { Component } from 'svelte';

export type WidgetConfig = {
    component: Component;
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
};

export class NestedSection {
    rowid: number;
    section_name: string;
    deadline_week: number;
    section_order: number;

    constructor(data: Partial<NestedSection> = {}) {
        this.rowid = data.rowid ?? 0;
        this.section_name = data.section_name ?? '';
        this.deadline_week = data.deadline_week ?? 0;
        this.section_order = data.section_order ?? 0;
    }
}

export class Section {
    rowid: number;
    section_name: string;
    deadline: number;
    deadline_week: number;
    max_points: number;
    section_order: number;
    course_id: number;
    nested: Record<string, NestedSection>;
    score?: number;

    constructor(data: Partial<Section> = {}) {
        this.rowid = data.rowid ?? 0;
        this.section_name = data.section_name ?? '';
        this.deadline = data.deadline ?? 0;
        this.deadline_week = data.deadline_week ?? 0;
        this.max_points = data.max_points ?? 0;
        this.section_order = data.section_order ?? 0;
        this.course_id = data.course_id ?? 0;
        this.nested = data.nested ? Object.fromEntries(
            Object.entries(data.nested).map(([key, value]) => [key, new NestedSection(value)])
        ) : {};
        this.score = data.score;
    }
}

export class HomeToolComment {
    text: any;
    type: string;

    constructor(data: Partial<HomeToolComment> = {}) {
        this.text = data.text;
        this.type = data.type ?? '';
    }
}

export class HomeTaskTool {
    id: number;
    status: number;
    comments: HomeToolComment[];

    constructor(data: Partial<HomeTaskTool> = {}) {
        this.id = data.id ?? 0;
        this.status = data.status ?? 0;
        this.comments = (data.comments ?? []).map(c => new HomeToolComment(c));
    }
}

export class HomeTask {
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

    constructor(data: Partial<HomeTask> = {}) {
        this.id = data.id ?? 0;
        this.teacher_task_id = data.teacher_task_id ?? 0;
        this.status = data.status ?? 0;
        this.task_delay = data.task_delay;
        this.tools = (data.tools ?? []).map(t => new HomeTaskTool(t));
        this.date_added = data.date_added ?? '';
        this.type = data.type ?? 0;
        this.score = data.score;
        this.comment = data.comment;
        this.name = data.name ?? '';
        this.parent_id = data.parent_id ?? 0;
        this.section_id = data.section_id ?? 0;
        this.has_theory_text = data.has_theory_text ?? false;
        this.subject_id = data.subject_id ?? 0;
        this.language_id = data.language_id ?? 0;
        this.date_control = data.date_control ?? '';
        this.isLocked = data.isLocked ?? false;
    }
}

export class Algo {
    id: number;
    no: number;
    predicate: string;
    actions: string;
    next: string;
    comment: string;

    constructor(data: Partial<Algo> = {}) {
        this.id = data.id ?? 0;
        this.no = data.no ?? 0;
        this.predicate = data.predicate ?? '';
        this.actions = data.actions ?? '';
        this.next = data.next ?? '';
        this.comment = data.comment ?? '';
    }
}

export class Algo2 {
    kind: string;
    class: string;
    access: string;
    name: string;
    params: string;
    ret: string;
    func: string;
    algo: Algo[];

    constructor(data: Partial<Algo2> = {}) {
        this.kind = data.kind ?? '';
        this.class = data.class ?? '';
        this.access = data.access ?? '';
        this.name = data.name ?? '';
        this.params = data.params ?? '';
        this.ret = data.ret ?? '';
        this.func = data.func ?? '';
        this.algo = (data.algo ?? []).map(a => new Algo(a));
    }
}

export class Tool {
    id: number;
    status: number;

    constructor(data: Partial<Tool> = {}) {
        this.id = data.id ?? 0;
        this.status = data.status ?? 0;
    }
}

export class MethodObject {
    id: number;
    name: string;
    type: string;
    desc: string;

    constructor(data: Partial<MethodObject> = {}) {
        this.id = data.id ?? 0;
        this.name = data.name ?? '';
        this.type = data.type ?? '';
        this.desc = data.desc ?? '';
    }
}

export class MethodFunction {
    id: number;
    name: string;
    semantics: string;

    constructor(data: Partial<MethodFunction> = {}) {
        this.id = data.id ?? 0;
        this.name = data.name ?? '';
        this.semantics = data.semantics ?? '';
    }
}

export class MethodCustom {
    id: number;
    name: string;

    constructor(data: Partial<MethodCustom> = {}) {
        this.id = data.id ?? 0;
        this.name = data.name ?? '';
    }
}

export class MainMethod {
    objects: MethodObject[];
    functions: MethodFunction[];
    custom: MethodCustom[];

    constructor(data: Partial<MainMethod> = {}) {
        this.objects = ((data.objects ?? []).length === 0 ? [{}] : data.objects ?? [{}]).map(o => new MethodObject(o));
        this.functions = ((data.functions ?? []).length === 0 ? [{}] : data.functions ?? [{}]).map(f => new MethodFunction(f));
        this.custom = ((data.custom ?? []).length === 0 ? [{}] : data.custom ?? [{}]).map(c => new MethodCustom(c));
    }
}

export class MethodBase {
    id: number;
    is_virtual: boolean;
    name: string;
    mod: string;

    constructor(data: Partial<MethodBase> = {}) {
        this.id = data.id ?? 0;
        this.is_virtual = data.is_virtual ?? false;
        this.name = data.name ?? '';
        this.mod = data.mod ?? '';
    }
}

export class MethodField {
    id: number;
    semantics: string;
    name: string;
    type: string;
    mod: string;

    constructor(data: Partial<MethodField> = {}) {
        this.id = data.id ?? 0;
        this.semantics = data.semantics ?? '';
        this.name = data.name ?? '';
        this.type = data.type ?? '';
        this.mod = data.mod ?? '';
    }
}

export class MethodMethod {
    id: number;
    semantics: string;
    name: string;

    constructor(data: Partial<MethodMethod> = {}) {
        this.id = data.id ?? 0;
        this.semantics = data.semantics ?? '';
        this.name = data.name ?? '';
    }
}

export class MethodClass {
    name: string;
    desc: string;
    bases: MethodBase[];
    fields: MethodField[];
    methods: MethodMethod[];

    constructor(data: Partial<MethodClass> = {}) {
        this.name = data.name ?? '';
        this.desc = data.desc ?? '';
        this.bases = (data.bases ?? []).map(b => new MethodBase(b));
        this.fields = (data.fields ?? []).map(f => new MethodField(f));
        this.methods = (data.methods ?? []).map(m => new MethodMethod(m));
    }
}

export class Method2 {
    main: MainMethod;
    classes: MethodClass[];

    constructor(data: Partial<Method2> = {}) {
        this.main = data.main ? new MainMethod(data.main) : new MainMethod();
        this.classes = ([...(data.classes ?? [{}])]).map(c => new MethodClass(c));
    }
}

export class TaskFile {
    name?: string;
    file?: string;
    changed: boolean;

    constructor(data: Partial<TaskFile> = {}) {
        this.name = data.name;
        this.file = data.file;
        this.changed = data.changed ?? false;
    }
}

export class TaskTest {
    rowid: number;
    student_task_id: number;
    test_input_data: string;
    test_output_data: string;
    test_comments: string;
    test_output_result: string;
    is_success: boolean;
    test_result: string;

    constructor(data: Partial<TaskTest> = {}) {
        this.rowid = data.rowid ?? 0;
        this.student_task_id = data.student_task_id ?? 0;
        this.test_input_data = data.test_input_data ?? '';
        this.test_output_data = data.test_output_data ?? '';
        this.test_comments = data.test_comments ?? '';
        this.test_output_result = data.test_output_result ?? '';
        this.is_success = data.is_success ?? false;
        this.test_result = data.test_result ?? '';
    }
}

export class Task {
    algo2: Algo2[] = [];
    tools: Tool[] = [];
    tests: TaskTest[] = [];
    _armVer: number = 174;
    method2: Method2 = new Method2(); // Гарантированная инициализация
    parent_id: number = 0;
    __lastModified: number = 0;
    __lastSaved: number = 0;
    template_id: number = 0;
    test_passed: boolean = false;
    task_readiness: number = 0;
    graph_png_array: string = '';
    is_code_available: boolean = false;
    files: TaskFile[] = [];
    graph_svg: string = '';
    id: number = 0;
    status: number = 0;
    date_added: string = '';
    type: number = 0;
    algo_text: string = '';
    algo_graph: string = '';
    method_description: string = '';
    comment: string = '';
    date_control: string = '';
    subject_id: number = 0;
    teacher_name: string = '';
    teacher_surname: string = '';
    teacher_patronymic: string = '';
    name: string = '';
    task_text: string = '';
    task_input: string = '';
    theory_text: string = '';
    task_output: string = '';

    constructor(data: Partial<Task> = {}) {
        // Инициализация массива объектов
        this.algo2 = ([...data.algo2??[]]).map(a => new Algo2(a));
        this.tools = ([...data.tools??[]]).map(t => new Tool(t));
        this.files = ([...data.files??[]]).map(f => new TaskFile(f));
        this.tests = ([...data.tests??[]]).map(f => new TaskTest(f));

        // Инициализация method2 с проверкой на наличие данных
        this.method2 = data.method2 ? new Method2(data.method2) : new Method2();

        // Простые свойства
        this._armVer = data._armVer ?? this._armVer;
        this.parent_id = data.parent_id ?? this.parent_id;
        this.__lastModified = data.__lastModified ?? this.__lastModified;
        this.__lastSaved = data.__lastSaved ?? this.__lastSaved;
        this.template_id = data.template_id ?? this.template_id;
        this.test_passed = data.test_passed ?? this.test_passed;
        this.task_readiness = data.task_readiness ?? this.task_readiness;
        this.graph_png_array = data.graph_png_array ?? this.graph_png_array;
        this.is_code_available = data.is_code_available ?? this.is_code_available;
        this.graph_svg = data.graph_svg ?? this.graph_svg;
        this.id = data.id ?? this.id;
        this.status = data.status ?? this.status;
        this.date_added = data.date_added ?? this.date_added;
        this.type = data.type ?? this.type;
        this.algo_text = data.algo_text ?? this.algo_text;
        this.algo_graph = data.algo_graph ?? this.algo_graph;
        this.method_description = data.method_description ?? this.method_description;
        this.comment = data.comment ?? this.comment;
        this.date_control = data.date_control ?? this.date_control;
        this.subject_id = data.subject_id ?? this.subject_id;
        this.teacher_name = data.teacher_name ?? this.teacher_name;
        this.teacher_surname = data.teacher_surname ?? this.teacher_surname;
        this.teacher_patronymic = data.teacher_patronymic ?? this.teacher_patronymic;
        this.name = data.name ?? this.name;
        this.task_text = data.task_text ?? this.task_text;
        this.task_input = data.task_input ?? this.task_input;
        this.theory_text = data.theory_text ?? this.theory_text;
        this.task_output = data.task_output ?? this.task_output;
    }
}

export class News {
    title: string;
    content: string;
    date_add: string;

    constructor(data: Partial<News> = {}) {
        this.title = data.title ?? '';
        this.content = data.content ?? '';
        this.date_add = data.date_add ?? '';
    }
}

// Constants remain the same
export const Tools = [
    "problem", "method", "algo", "algo-scheme", "code", "tests", "report",
    "aovt_operation", "acmas_p1_t1", "acmas_p1_t2", "acmas_send", "algo2",
    "intro", "conclusion", "method2"
];

export const ToolsLang = new Map([
    ["problem", "Постановка задачи"],
    ["method", "Метод решения"],
    ["algo", "Алгоритм"],
    ["algo-scheme", "Блок-схема"],
    ["code", "Исходный код"],
    ["tests", "Тестирование"],
    ["report", "Отчет"],
    ["algo2", "Алгоритм"],
    ["method2", "Метод решения"],
    ["intro", "Введение"],
    ["conclusion", "conclusion"],
    ["aovt_operation", "aovt_operation"],
    ["acmas_p1_t1", "acmas_p1_t1"],
    ["acmas_p1_t2", "acmas_p1_t2"],
    ["acmas_send", "acmas_send"],
]);

export const _taskStatusNames = [
    '', 'Не выполнено', 'На проверке', 'Доработать', 'Сдано',
    'Доработать (оценено)', 'На проверке (оценено)', 'У куратора', 'Сгорела'
];

export const taskStatusColors = {
    1: 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-white',
    2: 'bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white',
    3: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-white',
    4: 'bg-green-100 text-green-800 dark:bg-green-600 dark:text-white',
    5: 'bg-orange-100 text-orange-800 dark:bg-orange-600 dark:text-white',
    6: 'bg-purple-100 text-purple-800 dark:bg-purple-600 dark:text-white',
    7: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-600 dark:text-white',
    8: 'bg-red-100 text-red-800 dark:bg-red-600 dark:text-white bg-[url(Magma.png)] dark:bg-none',
};