export async function formatMessage(message) {
    console.log(`Message received: ${message}`);
    const receiver = await getReceiver(message);
    console.log('Receiver:', receiver);
    await saveMessage({chat_id: message.chat_id, user_id: message.user_id, content: message.message});
    return {
        sender_id: message.sender_id,
        receiver_id: receiver.id,
        message: message.message,
        timestamp: message.timestamp,
        receiver_username: receiver.username
    }
}

async function getReceiver(message) {
    console.log('Getting chat_id');
    console.log('Message:', message.chat_id);
    const chat = await (await fetch('http://nginx:80/backend/chats/' + message.chat_id)).json();
    
    console.log('Chat:', chat);
    if (chat.user_1 == message.sender_id) {
        return {id : chat.user_2, username: await getReceiverUsername(chat.user_2)};
    } else {
        return {id : chat.user_1, username: await getReceiverUsername(chat.user_1)};
    }
}

async function getReceiverUsername(user_id) {
    const user = await (await fetch('http://nginx:80/backend/users/' + user_id)).json();
    return user.username;
}

async function saveMessage(message) {
    const response = await fetch('http://nginx:80/backend/messages/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    });
    return response.json();
}