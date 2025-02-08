function toggleGameList() {
    document.querySelector(".game-options").classList.toggle("show");
}

function selectGame(gameElement) {
    let gamePrice = gameElement.getAttribute("data-price");
    let gameCode = gameElement.getAttribute("data-code");
    
    document.getElementById("game-price").innerText = gamePrice;
    document.getElementById("game-code").innerText = gameCode;
    document.getElementById("payment-details").style.display = "block";
}
