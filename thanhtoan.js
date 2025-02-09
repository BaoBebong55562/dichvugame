function toggleGameList() {
    const gameList = document.querySelector(".game-options");
    gameList.style.display = gameList.style.display === "block" ? "none" : "block";
}

function selectGame(element) {
    const gameCode = element.getAttribute("data-code");
    const gamePrice = element.getAttribute("data-price");

    document.getElementById("game-code").textContent = gameCode;
    document.getElementById("game-price").textContent = gamePrice;
    document.getElementById("payment-details").style.display = "block";
}
