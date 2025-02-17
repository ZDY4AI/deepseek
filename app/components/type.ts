'use client'

interface MessageFile {

}

interface Input {
}

export interface ChatMessage {
    agent_thoughts?: string[];
    answer: string;
    conversation_id: string;
    created_at: number;
    error: null;
    feedback: null;
    id: string;
    inputs: Input;
    message_files: MessageFile[];
    parent_message_id: string;
    query: string;
    retriever_resources: any[];
    status: string;
}