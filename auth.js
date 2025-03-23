import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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

// 📌 ĐĂNG KÝ TÀI KHOẢN
window.register = function () {
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const message = document.getElementById("registerMessage");

    if (!email || !password) {
        message.textContent = "⚠️ Vui lòng nhập đầy đủ thông tin!";
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Tạo balance mặc định là 0 khi đăng ký
            set(ref(database, `users/${user.uid}`), {
                email: user.email,
                balance: 0
            });

            message.textContent = "✅ Đăng ký thành công!";
            setTimeout(() => window.location.href = "dangnhap.html", 1500);
        })
        .catch((error) => {
            message.textContent = "⚠️ " + error.message;
        });
};

// 📌 ĐĂNG NHẬP TÀI KHOẢN
window.login = function () {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const message = document.getElementById("loginMessage");

    if (!email || !password) {
        message.textContent = "⚠️ Vui lòng nhập đầy đủ thông tin!";
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            message.textContent = "✅ Đăng nhập thành công! Chuyển hướng...";
            setTimeout(() => window.location.href = "index.html", 1500);
        })
        .catch((error) => {
            message.textContent = "⚠️ " + error.message;
        });
};

// 📌 QUÊN MẬT KHẨU
window.resetPassword = function () {
    const email = document.getElementById("resetEmail").value.trim();
    const message = document.getElementById("resetMessage");

    if (!email) {
        message.textContent = "⚠️ Vui lòng nhập email!";
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            message.textContent = "✅ Kiểm tra email để đặt lại mật khẩu!";
        })
        .catch((error) => {
            message.textContent = "⚠️ " + error.message;
        });
};

// 📌 ĐĂNG XUẤT
window.logout = function () {
    signOut(auth)
        .then(() => {
            window.location.href = "dangnhap.html";
        })
        .catch((error) => {
            console.error("❌ Lỗi khi đăng xuất:", error);
        });
};

// 📌 KIỂM TRA ĐĂNG NHẬP & CẬP NHẬT SỐ DƯ
onAuthStateChanged(auth, (user) => {
    if (user) {
        const balanceRef = ref(database, `users/${user.uid}/balance`);
        get(balanceRef).then((snapshot) => {
            if (snapshot.exists()) {
                document.getElementById("userBalance").textContent = snapshot.val() + " VNĐ";
            } else {
                document.getElementById("userBalance").textContent = "0 VNĐ";
            }
        });
    } else {
        // Nếu chưa đăng nhập, chuyển về trang đăng nhập
        if (window.location.pathname !== "/dangnhap.html") {
            window.location.href = "dangnhap.html";
        }
    }
});
const userId = "J8gKji6FlsPtjYLK0Hzl0hQ5mjk1"; // Thay bằng ID người dùng thực tế
const amountToAdd = 50000; // Số tiền muốn cộng

const userRef = firebase.database().ref("users/" + userId);

// Đọc số dư hiện tại và cộng thêm
userRef.once("value").then((snapshot) => {
    let currentBalance = snapshot.val()?.balance || 0;
    userRef.update({ balance: currentBalance + amountToAdd });
    console.log("Số dư mới: ", currentBalance + amountToAdd);
});
