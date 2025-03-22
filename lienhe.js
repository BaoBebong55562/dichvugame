// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBXdWb2s2YlLd0u31Fav0m0nbNpFXsTCRg",
  authDomain: "tom-2446.firebaseapp.com",
  databaseURL: "https://tom-2446-default-rtdb.firebaseio.com",
  projectId: "tom-2446",
  storageBucket: "tom-2446.firebasestorage.app",
  messagingSenderId: "286728533388",
  appId: "1:286728533388:web:8a2b8499f16fe6d06552a9",
  measurementId: "G-1G6V19R6M5"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const messagesRef = ref(database, "messages");

// Lấy phần tử giao diện
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const statusMessage = document.getElementById("statusMessage");

// Hàm hiển thị tin nhắn
function displayMessage(sender, text) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Tự động cuộn xuống tin nhắn mới nhất
}

// Tải lịch sử chat khi trang tải lại
get(messagesRef).then((snapshot) => {
    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            const message = childSnapshot.val();
            displayMessage(message.sender, message.text);
        });
    }
});

// Lắng nghe tin nhắn mới từ Firebase
onChildAdded(messagesRef, (snapshot) => {
    const message = snapshot.val();
    displayMessage(message.sender, message.text);
});

// Gửi tin nhắn khi bấm nút hoặc nhấn Enter
function sendMessage() {
    const messageText = messageInput.value.trim();

    if (messageText === "") {
        statusMessage.textContent = "⚠️ Vui lòng nhập tin nhắn!";
        setTimeout(() => { statusMessage.textContent = ""; }, 3000);
        return;
    }

    push(messagesRef, {
        sender: "Khách hàng",
        text: messageText
    });

    messageInput.value = "";
    statusMessage.textContent = "✅ Tin nhắn đã gửi!";
    setTimeout(() => { statusMessage.textContent = ""; }, 3000);
}

// Xử lý sự kiện gửi tin nhắn
sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});
