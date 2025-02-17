export type AgentType = {
    appid: string
    created_at: number
    created_by: string
    description: string
    icon: string
    icon_background: string
    icon_type: string
    icon_url: null | string
    id: string
    max_active_requests: null | number | string
    mode: string
    model_config: Object
    name: string
    tags: Array<string | object>
    updated_at: number
    updated_by: string
    use_icon_as_answer_icon: boolean
    workflow: null | Object | string
}

export type TalkType = {
    created_at: number
    id: string;
    inputs: Object
    introduction: null
    name: string,
    status: string,
    updated_at: number
}