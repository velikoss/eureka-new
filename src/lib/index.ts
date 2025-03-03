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