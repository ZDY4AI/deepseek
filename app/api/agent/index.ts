import request from '@/app/utils/request'
import { LoginCredentials, Pagination, updateAgentConversationType } from './type'

export const Login = (data: LoginCredentials) => {
    return request({
        url: '/console/api/login',
        method: 'post',
        data
    })
}

// http://183.201.231.29:2580/console/api/apps?page=1&limit=30&name=

export const getAgentList = () => {
    return request({
        url: '/console/api/installed-apps',
        method: 'get'
    })
}
export const getAgentListsecond = (data: Pagination) => {
    return request({
        url: `console/api/apps?page=${data.page}&limit=${data.limit}&name=`,
        method: 'get'
    })
}
// 提示词 
// http://183.201.231.29:2580/console/api/installed-apps/29198592-4782-4d09-8b8d-fd2f706d16bf/parameters
export const getAgentPrompt = (id: string) => {
    return request({
        url: `/console/api/installed-apps/${id}/parameters`,
        method: 'get'
    })
}

// 根据id获取的agent信息 
// http://183.201.231.29:2580/console/api/installed-apps/29198592-4782-4d09-8b8d-fd2f706d16bf/conversations?limit=100&pinned=false
export const getAgentConversation = (id: string) => {
    return request({
        url: `/console/api/installed-apps/${id}/conversations?limit=100&pinned=false`,
        method: 'get'
    })
}


// agent对话列表 
// http://183.201.231.29:2580/console/api/installed-apps/eccbc4f1-2a3e-4894-b294-444bb468a412/messages?conversation_id=b167a3f0-a483-4ad8-bd5d-2229dcde5c4b&limit=20&last_id=

export const getAgentMessage = (id: string, conversation_id: string) => {
    return request({
        url: `/console/api/installed-apps/${id}/messages?conversation_id=${conversation_id}&limit=20&last_id=`,
        method: 'get'
    })
}



// 创建 agent http://183.201.231.29:2580/console/api/apps
export const createAgent = (data: any) => {
    return request({
        url: '/console/api/apps',
        method: 'post',
        data
    })
}

// 修改 agent http://183.201.231.29:2580/console/api/apps/f46fc52c-db12-4555-81ff-8a10bade6f20
export const updateAgent = (id: string, data: any) => {
    return request({
        url: `/console/api/apps/${id}`,
        method: 'post',
        data
    })
}

// 修改对话名称 http://183.201.231.29:2580/console/api/installed-apps/1bec93ee-c601-49dd-8982-e749448b754d/conversations/fca64e59-a4fe-4e50-b51b-344bfef3b03d/name
export const updateAgentConversation = (data: updateAgentConversationType) => {
    return request({
        url: `/console/api/installed-apps/${data.appid}/conversations/${data.conversation_id}/name`,
        method: 'post',
        data: { name: data.name }
    })
}

// 删除 agent http://183.201.231.29:2580/console/api/apps/4aeb4304-e59e-457c-8e72-a71c6
export const dataleteAgent = (id: string) => {
    return request({
        url: `/console/api/apps/${id}`,
        method: 'delete'
    })
}


// 删除会话 http://183.201.231.29:2580/console/api/installed-apps/1bec93ee-c601-49dd-8982-e749448b754d/conversations/f07b1764-ffe0-4ee4-9713-da1b491a1481
export const deleteAgentConversation = (id: string, conversation_id: string) => {
    return request({
        url: `/console/api/installed-apps/${id}/conversations/${conversation_id}`,
        method: 'delete'
    })
}





// http://183.201.231.29:2580/console/api/apps/ca8e7fcf-1564-4fdc-8c15-2f072cb117ba/audio-to-text
// export const audioToText = (id: string, data: any) => {
export const audioToText = (data: any) => {
    return request({
        url: `/console/api/apps/ca8e7fcf-1564-4fdc-8c15-2f072cb117ba/audio-to-text`,
        // url: `/console/api/apps/${id}/audio-to-text`,
        method: 'post',
        data
    })
}



// 获取key
// http://183.201.231.29:2580/console/api/apps/ca8e7fcf-1564-4fdc-8c15-2f072cb117ba/api-keys
export const getKey = (id: string) => {
    return request({
        url: `/console/api/apps/${id}/api-keys`,
        method: 'get'
    })
}