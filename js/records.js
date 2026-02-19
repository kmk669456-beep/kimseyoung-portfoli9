document.addEventListener("DOMContentLoaded", function () {

  const recordList = document.getElementById("recordList");
  const sortSelect = document.getElementById("sort");
  const writeBtn = document.getElementById("writeBtn");
  const searchInput = document.getElementById("searchInput");
  const totalCount = document.getElementById("totalCount");
  const monthCount = document.getElementById("monthCount");
  const categoryButtons = document.querySelectorAll(".category-filter button");

  let records = JSON.parse(localStorage.getItem("records")) || [];

  let currentCategory = "all";
  let currentKeyword = "";

  /* =========================
     통계 업데이트
  ========================= */
  function updateStats(filteredList) {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const monthly = filteredList.filter(r => {
      const d = new Date(r.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });

    totalCount.textContent = filteredList.length;
    monthCount.textContent = monthly.length;
  }

  /* =========================
     렌더링 (검색+분류+정렬 통합)
  ========================= */
  function render(order = "latest") {

    recordList.innerHTML = "";

    let filtered = [...records];
 

    // 🔎 검색 필터
    if (currentKeyword) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(currentKeyword) ||
        r.content.toLowerCase().includes(currentKeyword)
      );
    }

    // 📂 카테고리 필터
    if (currentCategory !== "all") {
      filtered = filtered.filter(r => r.category === currentCategory);
    }

    // 🔃 정렬
    filtered.sort((a, b) =>
      order === "latest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

    filtered.forEach(record => {

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${record.date}</td>
        <td>${record.title}</td>
        <td>${record.category}</td>
        <td>${record.content}</td>
        <td>
          <button class="edit-btn action-btn" data-id="${record.id}">수정</button>
          <button class="delete-btn action-btn" data-id="${record.id}">삭제</button>
        </td>
      `;
    
      recordList.appendChild(row);
    });

    updateStats(filtered);
  }

  /* =========================
     글쓰기 버튼 (로그인)
  ========================= */
  if (writeBtn) {
    writeBtn.addEventListener("click", function () {

      const id = prompt("아이디를 입력하세요");
      const pw = prompt("비밀번호를 입력하세요");

      if (id === "kmk2714" && pw === "ksy0110$$") {
        window.location.href = "write.html";
      } else {
        alert("접근 권한이 없습니다.");
      }
    });
  }

  /* =========================
     정렬 변경
  ========================= */
  if (sortSelect) {
    sortSelect.addEventListener("change", function (e) {
      render(e.target.value);
    });
  }

  /* =========================
     검색 기능
  ========================= */
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      currentKeyword = this.value.toLowerCase();
      render(sortSelect.value);
    });
  }

  /* =========================
     카테고리 필터
  ========================= */
  categoryButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      currentCategory = this.dataset.cat;
      render(sortSelect.value);
    });
  });

  /* =========================
     수정 / 삭제 (이벤트 위임)
  ========================= */
  recordList.addEventListener("click", function (e) {

    const id = Number(e.target.dataset.id);

    // 🔴 삭제
    if (e.target.classList.contains("delete-btn")) {

      if (confirm("정말 삭제하시겠습니까?")) {
        records = records.filter(r => r.id !== id);
        localStorage.setItem("records", JSON.stringify(records));
        render(sortSelect.value);
      }
    }

    // 🔵 수정
    if (e.target.classList.contains("edit-btn")) {

      const inputId = prompt("아이디를 입력하세요");
      const inputPw = prompt("비밀번호를 입력하세요");

      if (inputId === "kmk2714" && inputPw === "ksy0110$$") {
        localStorage.setItem("editId", id);
        window.location.href = "write.html";
      } else {
        alert("권한이 없습니다.");
      }
    }

  });

  /* =========================
     최초 실행
  ========================= */
  render();

});
