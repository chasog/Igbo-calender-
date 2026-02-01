const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const toggleTheme = document.getElementById("toggleTheme");

// ================= IGBO MARKET DAYS =================
const marketDays = ["EKE", "ORIE", "AFO", "NKWO"];

// Reference: Jan 1, 2026 = ORIE
const referenceDate = new Date(2026, 0, 1);
const referenceMarketIndex = 1;

// ================= FIXED HOLIDAYS =================
const holidays = {
  "01-01": "New Year",
  "05-01": "Workers Day",
  "06-12": "Democracy Day",
  "10-01": "Independence Day",
  "12-25": "Christmas",
  "12-26": "Boxing Day",
  "02-14": "Valentine's Day"
};

// ================= IGBO FESTIVALS =================
const igboFestivals = {
  "07-15": "New Yam Festival (Iri Ji)",
  "08-20": "Ofala Festival",
  "11-30": "Ahiajoku Festival"
};

let currentDate = new Date();

// ================= MARKET DAY FUNCTION =================
function getMarketDay(date) {
  const diffDays = Math.floor(
    (date - referenceDate) / (1000 * 60 * 60 * 24)
  );
  const index = (referenceMarketIndex + diffDays % 4 + 4) % 4;
  return marketDays[index];
}

// ================= EASTER CALCULATION =================
function getEasterSunday(year) {
  const f = Math.floor;
  const G = year % 19;
  const C = f(year / 100);
  const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
  const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
  const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
  const L = I - J;
  const month = 3 + f((L + 40) / 44);
  const day = L + 28 - 31 * f(month / 4);

  return new Date(year, month - 1, day);
}

function getMovableHolidays(year) {
  const easter = getEasterSunday(year);

  return {
    "Ash Wednesday": new Date(year, easter.getMonth(), easter.getDate() - 46),
    "Holy Thursday": new Date(year, easter.getMonth(), easter.getDate() - 3),
    "Good Friday": new Date(year, easter.getMonth(), easter.getDate() - 2),
    "Holy Saturday": new Date(year, easter.getMonth(), easter.getDate() - 1),
    "Easter Sunday": easter,
    "Easter Monday": new Date(year, easter.getMonth(), easter.getDate() + 1)
  };
}

// ================= HOLIDAY HANDLER =================
function getHoliday(date) {
  const key =
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");

  if (holidays[key]) return holidays[key];
  if (igboFestivals[key]) return igboFestivals[key];

  const movable = getMovableHolidays(date.getFullYear());
  for (let name in movable) {
    const d = movable[name];
    if (
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    ) {
      return name;
    }
  }
  return null;
}

// ================= CALENDAR RENDER =================
function renderCalendar() {
  calendarDays.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < firstDay; i++) {
    calendarDays.innerHTML += `<div class="day empty"></div>`;
  }

  for (let day = 1; day <= lastDate; day++) {
    const dateObj = new Date(year, month, day);
    const market = getMarketDay(dateObj);
    const holiday = getHoliday(dateObj);

    let classes = "day";

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      classes += " today";
    }

    if (holiday) {
      classes += " holiday-day";
    }

    calendarDays.innerHTML += `
      <div class="${classes}">
        <div class="date">${day}</div>
        <div class="market">${market}</div>
        ${holiday ? `<div class="holiday">${holiday}</div>` : ""}
      </div>
    `;
  }
}

// ================= NAVIGATION =================
prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// ================= THEME TOGGLE =================
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleTheme.textContent = "☀️ Light Mode";
} else {
  toggleTheme.textContent = "🌙 Dark Mode";
}

toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");

  toggleTheme.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  toggleTheme.setAttribute("aria-pressed", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ================= INITIAL LOAD =================
renderCalendar();