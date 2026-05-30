// ════════════════════════════════════════════════════════════════════
//
//  ✅ HOW TO ADD MORE ROWS
//  Just change the number below. That's it.
// ════════════════════════════════════════════════════════════════════
const NUM_ROWS = 9;


// ════════════════════════════════════════════════════════════════════
//  SUBJECTS LIST
//  Add or remove subjects here. All dropdowns update automatically.
// ════════════════════════════════════════════════════════════════════
const SUBJECTS = [
    "Biology", "Chemistry", "Civic", "Economics",
    "English", "Geography", "Marketing", "Mathematics", "Physics"
];


// ════════════════════════════════════════════════════════════════════
//  DYNAMIC HTML BUILDER
//
//  Instead of copy-pasting rows in HTML (which breaks when you add
//  more), we build every input row and table row from JS using
//  NUM_ROWS. This means you never touch HTML again — just change
//  NUM_ROWS above.
// ════════════════════════════════════════════════════════════════════
function buildRows() {
    const rowsContainer = document.getElementById("rows-container");
    const tableBody     = document.getElementById("table-body");

    for (let i = 1; i <= NUM_ROWS; i++) {
        const subjectOptions = SUBJECTS
            .map(s => `<option value="${s}">${s}</option>`)
            .join("");

        // ── Input row ──────────────────────────────────────────────
        const fieldRow = document.createElement("div");
        fieldRow.className  = "field-row";
        fieldRow.dataset.row = i;
        fieldRow.innerHTML  = `
            <select id="subject${i}" class="subject" required>
                <option value="" disabled selected>Subject</option>
                ${subjectOptions}
            </select>
            <input type="number" class="input" id="first${i}"
                   placeholder="1st Test" max="20" min="0">
            <input type="number" class="input" id="second${i}"
                   placeholder="2nd Test" max="20" min="0">
            <input type="number" class="input" id="exam${i}"
                   placeholder="Exam" max="60" min="0">
            <input type="number" class="input total" id="total${i}"
                   readonly placeholder="Total">
        `;
        rowsContainer.appendChild(fieldRow);

        // ── Table row ──────────────────────────────────────────────
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
            <td id="sub${i}" required name="sub${i}" class="option"></td>
            <td id="tot${i}" required name="tot${i}" class="option2"></td>
            <td id="avg${i}" required name="avg${i}" class="option2"></td>
            <td id="remark${i}" required name="remark${i}" class="option2"></td>
            <td id="grade${i}" required name="grade${i}" class="option2"></td>
        `;
        tableBody.appendChild(tableRow);
    }

    // Attach all listeners after DOM is ready
    attachAllListeners();
}


// ════════════════════════════════════════════════════════════════════
//  CUSTOM ALERT SYSTEM
// ════════════════════════════════════════════════════════════════════
const alertStyle = document.createElement('style');
alertStyle.textContent = `
    @keyframes slideIn  { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }

    .custom-alert {
        position: fixed; padding: 15px 20px; border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,.4); z-index: 9999;
        animation: slideIn .3s ease; font-size: 14px; font-weight: 500;
        display: flex; align-items: center; gap: 10px;
        backdrop-filter: blur(10px);
    }
    @media (min-width: 3840px) { .custom-alert { top:50px; right:50px; max-width:600px; min-width:450px; font-size:18px; padding:24px 32px; border-radius:12px; } }
    @media (min-width: 2560px) and (max-width: 3839px) { .custom-alert { top:40px; right:40px; max-width:550px; min-width:400px; font-size:17px; padding:22px 28px; } }
    @media (min-width: 1920px) and (max-width: 2559px) { .custom-alert { top:30px; right:30px; max-width:480px; min-width:360px; font-size:15px; padding:18px 24px; } }
    @media (min-width: 1440px) and (max-width: 1919px) { .custom-alert { top:25px; right:25px; max-width:420px; min-width:320px; } }
    @media (min-width: 1024px) and (max-width: 1439px) { .custom-alert { top:20px; right:20px; max-width:380px; min-width:300px; } }
    @media (min-width:  768px) and (max-width: 1023px) { .custom-alert { top:20px; right:20px; max-width:350px; min-width:280px; font-size:13px; } }
    @media (max-width: 767px) and (min-width: 481px)   { .custom-alert { top:15px; right:15px; left:15px; max-width:calc(100% - 30px); font-size:13px; padding:12px 16px; } }
    @media (max-width: 480px) { .custom-alert { top:10px; right:10px; left:10px; max-width:calc(100% - 20px); font-size:13px; padding:12px 15px; border-radius:6px; } }
    @media (max-width: 360px) { .custom-alert { font-size:12px; padding:10px 12px; } }

    .custom-alert-icon    { flex-shrink:0; font-size:18px; }
    .custom-alert-message { flex:1; line-height:1.4; }

    .custom-alert.success { background: linear-gradient(135deg,#0d6efd,#0dcaf0); color:#fff; border-left:4px solid #0a58ca; }
    .custom-alert.error   { background: linear-gradient(135deg,#0d6efd,#6610f2); color:#fff; border-left:4px solid #0a58ca; }
    .custom-alert.warning { background: linear-gradient(135deg,#0dcaf0,#0d6efd); color:#fff; border-left:4px solid #0a58ca; }
    .custom-alert.info    { background: linear-gradient(135deg,#6610f2,#0d6efd); color:#fff; border-left:4px solid #0a58ca; }
`;
document.head.appendChild(alertStyle);

let activeAlert = null;

function showAlert(message, type = 'info', duration = 3000) {
    if (activeAlert) { activeAlert.remove(); activeAlert = null; }

    const icons = { success: '✅', error: '🚫', warning: '⚠️', info: 'ℹ️' };
    const alert = document.createElement('div');
    alert.className = `custom-alert ${type}`;
    alert.innerHTML = `
        <span class="custom-alert-icon">${icons[type] || 'ℹ️'}</span>
        <span class="custom-alert-message">${message}</span>
    `;
    document.body.appendChild(alert);
    activeAlert = alert;

    setTimeout(() => {
        alert.style.animation = 'slideOut .3s ease forwards';
        setTimeout(() => {
            if (alert.parentNode) alert.remove();
            if (activeAlert === alert) activeAlert = null;
        }, 300);
    }, duration);
}


// ════════════════════════════════════════════════════════════════════
//  INPUT VALIDATION
// ════════════════════════════════════════════════════════════════════
function validateInput(input, max, label) {
    const val = Number(input.value);
    if (val < 0) {
        input.value = 0;
        showAlert(`${label} cannot be negative. Reset to 0.`, 'warning');
        return false;
    }
    if (val > max) {
        input.value = max;
        showAlert(`${label} cannot exceed ${max}. Clamped to ${max}.`, 'error');
        return false;
    }
    return true;
}


// ════════════════════════════════════════════════════════════════════
//  GRADE HELPER
//
//  e.g. (total >= 75 && total <= 100) is the same as (total >= 75)
//  because the if-else chain already handles everything below 75.
//  Cleaner and easier to maintain.
// ════════════════════════════════════════════════════════════════════
function getGradeRemark(total) {
    if      (total >= 75) return { grade: "A1", remark: "Distinction" };
    else if (total >= 71) return { grade: "B2", remark: "Excellent"   };
    else if (total >= 66) return { grade: "B3", remark: "Very Good"   };
    else if (total >= 56) return { grade: "C4", remark: "Good"        };
    else if (total >= 51) return { grade: "C5", remark: "Credit"      };
    else if (total >= 46) return { grade: "C6", remark: "Average"     };
    else if (total >= 41) return { grade: "D7", remark: "Fair"        };
    else if (total >= 36) return { grade: "E8", remark: "Pass"        };
    else                  return { grade: "F9", remark: "Fail"        };
}


// ════════════════════════════════════════════════════════════════════
//  OVERALL SUMMARY
// ════════════════════════════════════════════════════════════════════
function updateOverall() {
    let sum = 0, count = 0;

    for (let i = 1; i <= NUM_ROWS; i++) {
        const cell = document.getElementById(`tot${i}`);
        if (cell && cell.innerText !== "") {
            sum += Number(cell.innerText);
            count++;
        }
    }

    if (count === 0) {
        document.getElementById("overall-avg").innerText    = "";
        document.getElementById("overall-grade").innerText  = "";
        document.getElementById("overall-remark").innerText = "";
        return;
    }

    const avg    = (sum / count).toFixed(1);
    const result = getGradeRemark(Math.round(avg));

    document.getElementById("overall-avg").innerText    = avg + "%";
    document.getElementById("overall-grade").innerText  = result.grade;
    document.getElementById("overall-remark").innerText = result.remark;
}


// ════════════════════════════════════════════════════════════════════
//  ROW CALCULATOR — david(row)
//  clear the row if all three score fields are empty.
// ════════════════════════════════════════════════════════════════════
function david(row) {

    const subjectEl = document.getElementById(`subject${row}`);
    const f         = document.getElementById(`first${row}`);
    const s         = document.getElementById(`second${row}`);
    const e         = document.getElementById(`exam${row}`);
    const subject   = subjectEl.value;

    // Update the subject name in the table
    document.getElementById(`sub${row}`).innerText = subject || "";

    // Validate score ranges
    validateInput(f, 20, `1st Test (Row ${row})`);
    validateInput(s, 20, `2nd Test (Row ${row})`);
    validateInput(e, 60, `Exam (Row ${row})`);

    // ── Guard: if no scores entered yet, clear the row and stop ────
    // This prevents F9/Fail showing up before the student types anything
    if (f.value === "" && s.value === "" && e.value === "") {
        document.getElementById(`total${row}`).value      = "";
        document.getElementById(`tot${row}`).innerText    = "";
        document.getElementById(`avg${row}`).innerText    = "";
        document.getElementById(`grade${row}`).innerText  = "";
        document.getElementById(`remark${row}`).innerText = "";
        updateOverall();
        return;
    }

    // Calculate total and display everything
    const total  = Number(f.value || 0) + Number(s.value || 0) + Number(e.value || 0);
    const result = getGradeRemark(total);

    document.getElementById(`total${row}`).value      = total;
    document.getElementById(`tot${row}`).innerText    = total;
    document.getElementById(`avg${row}`).innerText    = total.toFixed(1) + "%";
    document.getElementById(`grade${row}`).innerText  = result.grade;
    document.getElementById(`remark${row}`).innerText = result.remark;

    // Show toast only when all fields are fully filled
    if (subject && f.value !== "" && s.value !== "" && e.value !== "") {
        showAlert(
            `${subject}: Total ${total} (${total.toFixed(1)}%) — ${result.grade} | ${result.remark}`,
            'success', 2500
        );
    }

    updateOverall();
}


// ════════════════════════════════════════════════════════════════════
//  SUBJECT DUPLICATE PREVENTION — syncSubjectOptions()
//  Now we loop over every select, and for each one, we disable any
//  option that has been chosen by a DIFFERENT select. This scales
//  to any number of rows without any extra code.
// ════════════════════════════════════════════════════════════════════
function getSelects() {
    return Array.from({ length: NUM_ROWS }, (_, i) =>
        document.getElementById(`subject${i + 1}`)
    );
}

function syncSubjectOptions() {
    const selects = getSelects();
    const values  = selects.map(sel => sel.value);

    // First, re-enable every option in every dropdown
    selects.forEach(sel =>
        Array.from(sel.options).forEach(opt => opt.disabled = false)
    );

    // Then, for each dropdown, disable subjects that OTHER dropdowns have picked
    selects.forEach((sel, i) => {
        values.forEach((val, j) => {
            if (i !== j && val) {
                Array.from(sel.options).forEach(opt => {
                    if (opt.value === val) opt.disabled = true;
                });
            }
        });
    });
}


// ════════════════════════════════════════════════════════════════════
//  CLEAR ROW HELPER
//  Resets a row's select and wipes its table cells.
// ════════════════════════════════════════════════════════════════════
function clearRow(row) {
    document.getElementById(`subject${row}`).selectedIndex = 0;
    document.getElementById(`total${row}`).value           = "";
    ["sub", "tot", "avg", "grade", "remark"].forEach(prefix => {
        document.getElementById(`${prefix}${row}`).innerText = "";
    });
    updateOverall();
}


// ════════════════════════════════════════════════════════════════════
//  EVENT LISTENER SETUP
// ════════════════════════════════════════════════════════════════════
function attachAllListeners() {
    const selects = getSelects();

    for (let i = 0; i < NUM_ROWS; i++) {
        const row = i + 1;

        // Score inputs — recalculate whenever a score changes
        ["first", "second", "exam"].forEach(field => {
            document.getElementById(`${field}${row}`)
                .addEventListener("input", () => david(row));
        });

        // Subject dropdown
        selects[i].addEventListener("change", function () {
            const chosen = this.value;

            syncSubjectOptions();

            // Check if any OTHER row already has this subject — if so, clear it
            selects.forEach((otherSel, j) => {
                if (j !== i && otherSel.value === chosen) {
                    const otherRow = j + 1;
                    showAlert(
                        `${chosen} was already selected in Row ${otherRow} and has been cleared.`,
                        'warning', 3000
                    );
                    clearRow(otherRow);
                }
            });

            david(row);
        });
    }

    // ── Student name — sync to table header whenever the user types ──
    document.getElementById("student-name")
        .addEventListener("input", function () {
            document.getElementById("stuname").innerText = this.value;
        });

    // ── Class select — sync to table header whenever the selection changes ──
    document.getElementById("class-select")
        .addEventListener("change", function () {
            document.getElementById("stuclass").innerText = this.value;
        });

    // ── Session — set once on load, auto-generates e.g. "2026/2027" ──
    const year = new Date().getFullYear();
    document.getElementById("year").textContent = `${year}/${year + 1}`;
}


// ════════════════════════════════════════════════════════════════════
//  FIELD FLASH — red glow on any required field left empty
//  Called by validateTable() to give instant visual feedback.
// ════════════════════════════════════════════════════════════════════
function flashField(el) {
    el.style.transition = 'box-shadow 0.3s ease';
    el.style.boxShadow  = '0 0 0 3px rgba(239, 68, 68, 0.80)';
    setTimeout(function () { el.style.boxShadow = ''; }, 2500);
}


// ════════════════════════════════════════════════════════════════════
//  TABLE VALIDATION
//  Runs before every print or download action.
//  Returns true only when every required field is filled.
// ════════════════════════════════════════════════════════════════════
function validateTable() {

    // 1 ── Student name must not be blank
    const nameEl = document.getElementById('student-name');
    if (!nameEl.value.trim()) {
        flashField(nameEl);
        showAlert('Please enter the student\'s name before printing or downloading.', 'error', 3500);
        nameEl.focus();
        return false;
    }

    // 2 ── A class must be selected
    const classEl = document.getElementById('class-select');
    if (!classEl.value) {
        flashField(classEl);
        showAlert('Please select a class before printing or downloading.', 'error', 3500);
        return false;
    }

    // 3 ── Check every subject row
    let filledRows = 0;

    for (let i = 1; i <= NUM_ROWS; i++) {
        const subjectEl = document.getElementById(`subject${i}`);
        const firstEl   = document.getElementById(`first${i}`);
        const secondEl  = document.getElementById(`second${i}`);
        const examEl    = document.getElementById(`exam${i}`);

        const subject = subjectEl.value;
        const first   = firstEl.value;
        const second  = secondEl.value;
        const exam    = examEl.value;

        // A row is "touched" if ANY of its four fields has a value
        const touched = subject || first !== '' || second !== '' || exam !== '';
        if (!touched) continue;   // completely empty rows are allowed (skip them)

        // For a touched row, ALL four fields are required
        if (!subject) {
            flashField(subjectEl);
            showAlert(`Row ${i}: Please select a subject.`, 'error', 3500);
            return false;
        }
        if (first === '') {
            flashField(firstEl);
            showAlert(`${subject}: 1st Test score is missing.`, 'error', 3500);
            return false;
        }
        if (second === '') {
            flashField(secondEl);
            showAlert(`${subject}: 2nd Test score is missing.`, 'error', 3500);
            return false;
        }
        if (exam === '') {
            flashField(examEl);
            showAlert(`${subject}: Exam score is missing.`, 'error', 3500);
            return false;
        }

        filledRows++;
    }

    // 4 ── At least one subject row must be filled
    if (filledRows === 0) {
        showAlert('Please fill in at least one subject row before printing or downloading.', 'error', 3500);
        return false;
    }

    return true;   // all checks passed ✔
}


// ════════════════════════════════════════════════════════════════════
//  PRINT HANDLER
//  Validates the table first; only calls window.print() if it passes.
// ════════════════════════════════════════════════════════════════════
function handlePrint() {
    if (!validateTable()) return;
    window.print();
}


// ════════════════════════════════════════════════════════════════════
//  INIT — build everything on page load
// ════════════════════════════════════════════════════════════════════
buildRows();