import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, get, push, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBXdWb2s2YlLd0u31Fav0m0nbNpFXsTCRg",
    authDomain: "tom-2446.firebaseapp.com",
    databaseURL: "https://tom-2446-default-rtdb.firebaseio.com",
    projectId: "tom-2446",
    storageBucket: "tom-2446.appspot.com",
    messagingSenderId: "286728533388",
    appId: "1:286728533388:web:8a2b8499f16fe6d06552a9"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Kiểm tra trạng thái đăng nhập
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("userEmail").textContent = user.email;

        // Lấy số dư từ Firebase
        const balanceRef = ref(database, `users/${user.uid}/balance`);
        get(balanceRef).then((snapshot) => {
            if (snapshot.exists()) {
                document.getElementById("userBalance").textContent = snapshot.val() + " VNĐ";
            } else {
                document.getElementById("userBalance").textContent = "0 VNĐ";
            }
        });

        // Kiểm tra giao dịch đã duyệt và cập nhật số dư
        get(ref(database, "topups/")).then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                if (data.userId === user.uid && data.status === "approved") {
                    const newBalance = snapshot.val() ? snapshot.val() + data.amount : data.amount;
                    update(balanceRef, { balance: newBalance });
                    update(ref(database, `topups/${childSnapshot.key}`), { status: "completed" });
                }
            });
        });

    } else {
        // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
        window.location.href = "dangnhap.html";
    }
});

// Xử lý nạp tiền
window.submitTopUp = function () {
    const user = auth.currentUser;
    if (!user) {
        alert("Bạn cần đăng nhập để nạp tiền.");
        return;
    }

    const amount = document.getElementById("amount").value.trim();
    const transactionId = document.getElementById("transactionId").value.trim();
    const message = document.getElementById("topUpMessage");

    if (amount === "" || transactionId === "") {
        message.textContent = "⚠️ Vui lòng nhập đầy đủ thông tin!";
        return;
    }

    // Gửi yêu cầu nạp tiền lên Firebase
    push(ref(database, `topups/`), {
        userId: user.uid,
        email: user.email,
        amount: parseInt(amount),
        transactionId: transactionId,
        status: "pending", // Chờ admin xác nhận
        timestamp: Date.now()
    });

    message.textContent = "✅ Yêu cầu nạp tiền đã gửi, vui lòng chờ xác nhận!";
    document.getElementById("amount").value = "";
    document.getElementById("transactionId").value = "";
};

// Đăng xuất
document.getElementById("logoutButton").addEventListener("click", function () {
    signOut(auth).then(() => {
        window.location.href = "dangnhap.html";
    }).catch((error) => {
        console.error("❌ Lỗi khi đăng xuất:", error);
    });
});
