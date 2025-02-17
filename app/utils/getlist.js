import { getAgentListsecond, getAgentList } from '@/app/api/agent/index';
import { LRUCache } from 'lru-cache';

// 创建一个 LRU 缓存实例
const cache = new LRUCache({
    // 最大缓存条目数
    max: 1000,
    // 缓存有效期（单位：毫秒），这里设置为 1 小时
    ttl: 60 * 60 * 1000,
    // 每次访问时更新缓存的过期时间
    updateAgeOnGet: true
});

export async function processAgentLists() {
    try {
        const cachedData = cache.get('agentList');
        if (cachedData) { 
            return cachedData; // 直接返回缓存数据
        } 
        const [secondRes, firstRes] = await Promise.all([
            getAgentListsecond({ page: 1, limit: 30 }),
            getAgentList()
        ]);

        const listMap = secondRes.data.reduce((acc, item) => {
            acc[item.id] = { ...item, appid: null };
            return acc;
        }, {});

        firstRes.installed_apps.forEach((ele) => {
            if (listMap[ele.app.id]) {
                listMap[ele.app.id].appid = ele.id;
            }
        });

        const list = Object.values(listMap); 
        // 将数据存储到缓存中   
        cache.set('agentList', list);
        return list;
    } catch (error) {
        console.error('Error in processAgentLists:', error);
    }
}