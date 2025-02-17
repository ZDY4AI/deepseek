import request from '@/app/utils/requestKey'
import { LikemessageType } from './type'
// 获取会话列表
// curl -X GET 'http://183.201.231.29:2580/v1/conversations?user=abc-123&last_id=&limit=20'\
// --header 'Authorization: Bearer {api_key}'
/**
 * 
 * @param user 用户标识，由开发者定义规则，需保证用户标识在应用内唯一
 * @param last_id （选填）当前页最后面一条记录的 ID，默认 null
 * @param limit （选填）一次请求返回多少条记录，默认 20 条，最大 100 条，最小 1 条。
 * @param {string} key 请求key
 */
export const getConversation = (user: string, last_id: string, limit: number, key: string) => {
    return request.get(`conversations?user=${user}&last_id=${last_id}&limit=${limit}`, { token: key })
}

// 会话重命名
// curl -X POST 'http://183.201.231.29:2580/v1/conversations/:conversation_id/name' \
// --header 'Authorization: Bearer {api_key}' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//  "name": "",
//  "auto_generate": true,
//  "user": "abc-123"
// }'
/**
 * 
 * @param {string} conversation_id conversation_id (string) 会话 ID
 * @param data 请求数据
 * @param {string} data.name （选填）名称，若 auto_generate 为 true 时，该参数可不传。
 * @param {bollean} data.auto_generate （选填）自动生成标题，默认 false。
 * @param {string} data.user 用户标识，由开发者定义规则，需保证用户标识在应用内唯一。
 * @param {string} key 请求key
 * @returns 
 */
export const updateConversations = (conversation_id: string, data: any, key: string) => {
    return request.post(`conversations/${conversation_id}/name`, data, { token: key })
}


// 删除会话
// curl -X DELETE 'http://183.201.231.29:2580/v1/conversations/:conversation_id' \
// --header 'Authorization: Bearer {api_key}' \
// --header 'Content-Type: application/json' \
// --data-raw '{ 
//  "user": "abc-123"
// }'
/**
 * 
 * @param {string} conversation_id conversation_id (string) 会话 ID
 * @param data  请求体
 * @param {string} data.user  用户标识，由开发者定义规则，需保证用户标识在应用内唯一。
 * @param {string} key 请求key 
 */
export const DeleteConversations = (conversation_id: string, data: any, key: string) => {
    const config = {
        data,
        headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
        }
    };
    return request.delete(`conversations/${conversation_id}`, config)
}

// 获取会话历史记录
// curl -X GET 'http://183.201.231.29:2580/v1/messages?user=abc-123&conversation_id=' \
// --header 'Authorization: Bearer {api_key}'
/**
 * 
 * @param {string} user 用户唯一标识
 * @param {string} conversation_id conversation_id (string) 会话 ID
 * @param {string} key 请求key 
 */
export const GetMessages = (user: string, conversation_id: string, key: string) => {
    return request.get(`messages?user=${user}&conversation_id=${conversation_id}`, { token: key })
}

// 终止响应
// curl -X POST 'http://183.201.231.29:2580/v1/chat-messages/:task_id/stop' \
// -H 'Authorization: Bearer {api_key}' \
// -H 'Content-Type: application/json' \
// --data-raw '{ "user": "abc-123"}'
/**
 * 
 * @param {string} task_id  (string) 任务 ID，可在流式返回 Chunk 中获取
 * @param {string} data (string) Required 用户标识，用于定义终端用户的身份，必须和发送消息接口传入 user 保持一致。
 * @param {string} key  请求key
 * @returns 
 */
export const Stopmessage = (task_id: string, data: any, key: string) => {
    return request.post(`chat-messages/${task_id}/stop`, data, { token: key })
}


// 消息点赞
// curl -X POST 'http://183.201.231.29:2580/v1/messages/:message_id/feedbacks \
// --header 'Authorization: Bearer {api_key}' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//     "rating": "like",
//     "user": "abc-123",
//     "content": "message feedback information"
// }'
/**
 * 
 * @param {string} message_id 消息id
 * @param data 请求数据
 * @param {string} key  请求key
 * @returns 
 */
export const Likemessage = (message_id: string, data: LikemessageType, key: string) => {
    return request.post(`messages/${message_id}/feedbacks`, data, { token: key })
}



// 获取下一轮建议问题列表
// curl --location --request GET 'http://183.201.231.29:2580/v1/messages/{message_id}/suggested?user=abc-123 \
// --header 'Authorization: Bearer ENTER-YOUR-SECRET-KEY' \
// --header 'Content-Type: application/json'
/**
 * 
 * @param {string} message_id 消息id
 * @param {string} user 用户唯一标识
 * @param {string} key  请求key
 * @returns 
 */
export const Getsuggested = (message_id: string, user: string, key: string) => {
    return request.get(`messages/${message_id}/suggested?user=${user}`, { token: key })
}

// 获取开场白
// curl - X GET 'http://183.201.231.29:2580/v1/parameters'\
// --header 'Authorization: Bearer {api_key}'
export const Getparameters = (key: string) => {
    return request.get(`parameters`, { token: key })
}