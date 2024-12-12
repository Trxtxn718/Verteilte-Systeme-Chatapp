export async function formatMessage(message) {
    console.log(`Message received: ${message}`);
    const chat = await fetch('http://localhost:80/backend/chats/' + message.chatId)
}