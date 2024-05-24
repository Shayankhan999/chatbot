
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY = "OPENAI_API_KEY";

const createChatLi = (message, className) => {
    // Create a chat li element with the passed message and class name
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" 
        ? `<p>${message}</p>` 
        : `<span class="material-symbols-outlined">smart_toy</span> <p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
};

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }],
        }),
    };

    // Send post request to API, get response
    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            messageElement.textContent = data.choices[0].message.content;
        })
        .catch((error) => {
            messageElement.textContent = "Oops! Something went wrong, please try again.";
        })
        .finally(() => {
            chatbox.scrollTo(0, chatbox.scrollHeight);
        });
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Append the user message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);

    chatInput.value = ""; // Clear the chat input after sending the message
};

sendChatBtn.addEventListener("click", handleChat);
