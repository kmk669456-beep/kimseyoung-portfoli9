document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("writeForm");
  const backBtn = document.getElementById("backBtn");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const content = document.getElementById("content").value;

    let records = JSON.parse(localStorage.getItem("records")) || [];

    const newRecord = {
      id: Date.now(),
      title: title,
      category: category,
      content: content,
      date: new Date().toISOString().slice(0, 10),
      image: null
    };

    records.push(newRecord);

    localStorage.setItem("records", JSON.stringify(records));

    alert("저장 완료!");
    window.location.href = "records.html";
  });

  if (backBtn) {
    backBtn.addEventListener("click", function () {
      if (confirm("작성 중인 내용은 저장되지 않습니다. 돌아갈까요?")) {
        window.location.href = "records.html";
      }
    });
  }

});
