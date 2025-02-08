// Vô hiệu hóa chuột phải
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    alert("Chức năng sao chép đã bị vô hiệu hóa!");
});

// Chặn phím Ctrl + C, Ctrl + X, Ctrl + U, Ctrl + S
document.addEventListener("keydown", function (e) {
    if (
        (e.ctrlKey && (e.key === "c" || e.key === "x" || e.key === "u" || e.key === "s")) ||
        (e.metaKey && (e.key === "c" || e.key === "x" || e.key === "u" || e.key === "s"))
    ) {
        e.preventDefault();
        alert("Chức năng sao chép đã bị vô hiệu hóa!");
    }
});
