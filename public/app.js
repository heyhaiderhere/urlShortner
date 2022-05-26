const form = document.querySelector("#form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = document.querySelector(".url");
  fetch("/url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: url.value }),
  })
    .then((data) => {
      return data.json();
    })
    .then((response) => {
      const area = document.querySelector(".area");
      const displayUrl = document.createElement("a");
      area.innerHTML = "";
      displayUrl.textContent = response;
      displayUrl.href = response;
      area.append(displayUrl);
      console.log(response);
    });
});
