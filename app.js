function setNav()
{
    const btn = document.querySelector("[data-menu-btn]");
    const links = document.querySelector("[data-nav-links]");
    if (!btn || !links) return;

    btn.addEventListener("click", () =>
    {
        links.classList.toggle("open");
        const expanded = links.classList.contains("open");
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
}

function qs(sel) { return document.querySelector(sel); }

function showError(input, msg)
{
    input.classList.add("input-error");
    const err = input.parentElement.querySelector(".error");
    if (err)
    {
        err.textContent = msg;
        err.style.display = "block";
    }
}

function clearError(input)
{
    input.classList.remove("input-error");
    const err = input.parentElement.querySelector(".error");
    if (err) err.style.display = "none";
}

function validateForm()
{
    const form = qs("#sessionForm");
    if (!form) return;

    const athleteName = qs("#athleteName");
    const email = qs("#email");
    const sessionDate = qs("#sessionDate");
    const workoutType = qs("#workoutType");
    const notes = qs("#notes");

    const intensity = form.querySelector("input[name='intensity']:checked");
    const goal = qs("#goal");

    const didMobility = qs("#didMobility");

    const inputsToClear = [athleteName, email, sessionDate, workoutType, notes, goal];
    inputsToClear.forEach(clearError);

    let ok = true;

    if (!athleteName.value.trim())
    {
        showError(athleteName, "Name is required.");
        ok = false;
    }

    if (!email.value.trim() || !email.value.includes("@"))
    {
        showError(email, "Valid email is required.");
        ok = false;
    }

    if (!sessionDate.value.trim())
    {
        showError(sessionDate, "Date is required.");
        ok = false;
    }

    if (!workoutType.value.trim())
    {
        showError(workoutType, "Please choose a workout type.");
        ok = false;
    }

    if (!intensity)
    {
        const intensityWrap = qs("#intensityWrap");
        const intensityError = intensityWrap.querySelector(".error");
        intensityError.textContent = "Choose an intensity.";
        intensityError.style.display = "block";
        ok = false;
    }
    else
    {
        const intensityWrap = qs("#intensityWrap");
        const intensityError = intensityWrap.querySelector(".error");
        intensityError.style.display = "none";
    }

    if (!goal.value.trim())
    {
        showError(goal, "Please select a goal.");
        ok = false;
    }

    if (!notes.value.trim() || notes.value.trim().length < 10)
    {
        showError(notes, "Notes must be at least 10 characters.");
        ok = false;
    }

    if (!ok) return;

    const payload =
    {
        athleteName: athleteName.value.trim(),
        email: email.value.trim(),
        sessionDate: sessionDate.value,
        workoutType: workoutType.value,
        intensity: intensity.value,
        didMobility: didMobility.checked,
        goal: goal.value,
        notes: notes.value.trim()
    };

    const statusBox = qs("#statusBox");
    statusBox.className = "notice";
    statusBox.textContent = "Submitting...";

    fetch("/api/sessions",
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(async (res) =>
    {
        if (!res.ok)
        {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || "Submit failed.");
        }
        return res.json();
    })
    .then(() =>
    {
        statusBox.className = "notice ok";
        statusBox.textContent = "Saved! Redirecting...";
        window.location.href = "/logs.html";
    })
    .catch((err) =>
    {
        statusBox.className = "notice bad";
        statusBox.textContent = err.message;
    });
}

function loadLogs()
{
    const tableBody = qs("#logsBody");
    if (!tableBody) return;

    fetch("/api/sessions")
        .then((r) => r.json())
        .then((rows) =>
        {
            tableBody.innerHTML = "";
            if (!rows.length)
            {
                tableBody.innerHTML = `<tr><td colspan="7">No sessions yet. Add one on the “Add Session” page.</td></tr>`;
                return;
            }

            for (const s of rows)
            {
                const mobility = s.didMobility ? "Yes" : "No";
                const created = new Date(s.createdAt).toLocaleString();

                const tr = document.createElement("tr");
                tr.innerHTML =
                    `<td>${s.athleteName}</td>
                     <td><span class="badge">${s.workoutType}</span></td>
                     <td>${s.sessionDate}</td>
                     <td>${s.intensity}</td>
                     <td>${mobility}</td>
                     <td>${s.goal}</td>
                     <td>${s.notes}</td>`;
                tableBody.appendChild(tr);
            }

            const info = qs("#logsInfo");
            if (info) info.textContent = `Loaded ${rows.length} session(s).`;
        })
        .catch(() =>
        {
            tableBody.innerHTML = `<tr><td colspan="7">Could not load sessions.</td></tr>`;
        });
}

document.addEventListener("DOMContentLoaded", () =>
{
    setNav();

    const form = qs("#sessionForm");
    if (form)
    {
        form.addEventListener("submit", (e) =>
        {
            e.preventDefault();
            validateForm();
        });
    }

    loadLogs();
});
