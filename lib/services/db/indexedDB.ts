import { openDB } from 'idb';

const DB_NAME = 'chatDB';
const STORE_NAME = 'chats'


const dbPromise = openDB(DB_NAME, 1, {upgrade(db) {
    if(!db.objectStoreNames.contains(STORE_NAME)){
        db.createObjectStore(STORE_NAME, {keyPath: 'id'})
    }
}})


export const addMessage = async(chatId: string, message: string, sender: string)=> {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);


    const existingChat = await store.get(chatId);

    if(existingChat){
        existingChat.messages.push({
            message,
            sender,
            timestamp: Date.now()
        })
        store.put(existingChat);
    }
    else {
        store.add({
            id: chatId,
            messages: [{
                message,
                sender,
                timestamp: Date.now()
            }]
        })
    }

    await tx.done;
}


export const getMessages = async(chatId: string)=> {
    const db = await dbPromise;
    const store = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME);
    return await store.get(chatId);
}

export const clearMessages = async(chatId: string)=> {
    const db = await dbPromise;
    const store = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME);
    await store.delete(chatId);
}