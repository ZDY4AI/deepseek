export interface LoginCredentials {
    email: string;
    language: string;
    password: string;
    remember_me: boolean;
}

export interface Pagination {
    page: number;        
    limit: number;      
}

export interface Appagent {
    icon: string
    icon_background: string | null
    icon_type: string
    icon_url: string
    id: string,
    mode: string
    name: string,
    use_icon_as_answer_icon: false
}

export interface InstalledApp {
    app: Appagent,
    app_owner_tenant_id: string,
    editable: boolean,
    id: string,
    is_pinned: boolean,
    last_used_at: number,
    uninstallable: boolean
}
export interface AgentListResponse {
    installed_apps: InstalledApp;
}

export interface updateAgentConversationType {
    conversation_id: string,
    appid: string,
    name: string
}

