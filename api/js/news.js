window.addEventListener("load", () => {
  document.querySelectorAll(".latestNewsColumn").forEach(async (element, i) => {
    if (element.tagName !== "UL") return;

    const res = await fetch("/api/v1/latestNews");
    let body = await res.json();

    body.forEach((news) => {
      element.insertAdjacentHTML("beforeend", `
      <li><a href="${news.link}">${news.title}</li>
      `);
    });
  });
});