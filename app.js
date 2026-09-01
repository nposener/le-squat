const storageKey = "set-go-workouts-v1";
let data;
let selectedWorkoutId;
let fileHandle;
let activeSession;
let timerId;
let completedExercises = new Set();

const byId = (id) => document.getElementById(id);
const clone = (value) => JSON.parse(JSON.stringify(value));

async function loadData() {
  const saved = localStorage.getItem(storageKey);
  if (saved) return JSON.parse(saved);
  return clone(window.STARTER_WORKOUT_DATA);
}

function persist() { localStorage.setItem(storageKey, JSON.stringify(data)); }
function currentWorkout() { return data.workouts.find((workout) => workout.id === selectedWorkoutId); }
function formatSeconds(seconds) { return `${Math.max(0, seconds)}s`; }
function targetText(target) {
  const side = target.perSide ? " / side" : "";
  const note = target.note ? ` (${target.note})` : "";
  if (target.type === "reps") return `${target.reps} reps${side}${note}`;
  if (target.type === "time") return `${target.seconds} sec${side}${note}`;
  if (target.type === "range") return `${target.min}-${target.max} reps${side}`;
  if (target.type === "range-time") return `${target.min}-${target.max} sec${side}`;
  return "Custom target";
}
function getSets(exercise, section) { return exercise.sets || section.rounds || 1; }
function hasRepeatedWork(exercise, section) { return Boolean(exercise.sets || section.rounds); }
function exerciseRest(exercise) { return exercise.restSeconds ?? data.settings.defaultRestSeconds; }
function exerciseName(exercise) { return exercise.selectedVariation || exercise.name; }
function targetAmount(target) { return target.type === "reps" ? target.reps : target.type === "time" ? target.seconds : Math.round((target.min + target.max) / 2); }
function targetStep(target) { return target.type.includes("time") || target.type === "time" ? 5 : 1; }
function estimateSeconds(workout) {
  return workout.sections.reduce((total, section) => total + section.exercises.reduce((sectionTotal, exercise) => {
    const multiplier = exercise.target.perSide ? 2 : 1;
    const workSeconds = (exercise.target.type === "time" || exercise.target.type === "range-time") ? targetAmount(exercise.target) : targetAmount(exercise.target) * 3;
    const sets = getSets(exercise, section);
    return sectionTotal + (workSeconds * multiplier * sets) + (hasRepeatedWork(exercise, section) ? exerciseRest(exercise) * Math.max(0, sets - 1) : 0);
  }, 0), 0);
}
function estimateText(workout) { return `about ${Math.max(1, Math.round(estimateSeconds(workout) / 60))} min`; }
function slugify(value) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `workout-${Date.now()}`; }

function renderLibrary() {
  const selected = currentWorkout() || data.workouts[0];
  selectedWorkoutId = selected.id;
  byId("workout-selector").innerHTML = data.workouts.map((workout) => `<button class="workout-tab ${workout.id === selected.id ? "active" : ""}" style="--accent: var(--${workout.accent || "coral"})" data-workout-id="${workout.id}" role="tab" aria-selected="${workout.id === selected.id}"><strong>${escapeHtml(workout.name)}</strong><span>${escapeHtml(workout.subtitle || "Custom workout")}</span></button>`).join("");
  byId("workout-panel").innerHTML = `<div class="workout-title"><div><h2>${escapeHtml(selected.name)}</h2><p>${escapeHtml(selected.subtitle || "Custom workout")} / ${estimateText(selected)}</p></div><div class="workout-actions"><button class="secondary-button reset-progress" id="reset-progress">Reset checks</button><button class="primary-button" id="start-workout">Start guided session</button></div></div>${selected.sections.map(renderSection).join("")}`;
}

function renderSection(section) {
  const descriptor = section.rounds ? `${section.name} / ${section.rounds} rounds` : `${section.name}${section.durationMinutes ? ` / ${section.durationMinutes} min` : ""}`;
  return `<section class="section-block section-${section.id}"><div class="section-label"><span>${escapeHtml(descriptor)}</span><i></i></div><div class="exercise-list">${section.exercises.map((exercise) => renderExercise(exercise, section)).join("")}</div></section>`;
}
function renderExercise(exercise, section) {
  const sets = getSets(exercise, section);
  const repeated = hasRepeatedWork(exercise, section);
  const choice = exercise.alternatives ? `<select class="alternative-select" data-exercise-id="${exercise.id}" aria-label="Exercise variation"><option ${!exercise.selectedVariation ? "selected" : ""}>${escapeHtml(exercise.name)}</option>${exercise.alternatives.map((name) => `<option ${exercise.selectedVariation === name ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}</select>` : `<div class="exercise-name">${escapeHtml(exerciseName(exercise))}</div>`;
  const targetLabel = exercise.target.type === "time" || exercise.target.type === "range-time" ? "time" : "reps";
  const metrics = `<div class="exercise-metrics"><span><b>${targetText(exercise.target)}</b><small>${targetLabel}</small></span>${repeated ? `<span><b>${sets}</b><small>${section.rounds && !exercise.sets ? "rounds" : "sets"}</small></span><span><b>${formatSeconds(exerciseRest(exercise))}</b><small>rest</small></span>` : ""}</div>`;
  const adjusters = `<details class="exercise-config"><summary aria-label="Adjust ${escapeHtml(exerciseName(exercise))}" title="Adjust exercise">Adjust</summary><div class="config-controls"><div class="mini-control"><span>${targetLabel}</span><div class="stepper"><button data-change="target" data-exercise-id="${exercise.id}" data-delta="-${targetStep(exercise.target)}" aria-label="Decrease ${targetLabel}">-</button><strong>${targetAmount(exercise.target)}</strong><button data-change="target" data-exercise-id="${exercise.id}" data-delta="${targetStep(exercise.target)}" aria-label="Increase ${targetLabel}">+</button></div></div>${repeated ? `<div class="mini-control"><span>${section.rounds && !exercise.sets ? "rounds" : "sets"}</span><div class="stepper"><button data-change="sets" data-exercise-id="${exercise.id}" data-delta="-1" aria-label="Decrease sets">-</button><strong>${sets}</strong><button data-change="sets" data-exercise-id="${exercise.id}" data-delta="1" aria-label="Increase sets">+</button></div></div><div class="mini-control"><span>rest</span><div class="stepper"><button data-change="rest" data-exercise-id="${exercise.id}" data-delta="-15" aria-label="Decrease rest">-</button><strong>${formatSeconds(exerciseRest(exercise))}</strong><button data-change="rest" data-exercise-id="${exercise.id}" data-delta="15" aria-label="Increase rest">+</button></div></div>` : ""}</div></details>`;
  return `<div class="exercise-row ${completedExercises.has(exercise.id) ? "is-complete" : ""}"><label class="done-toggle" title="Mark ${escapeHtml(exerciseName(exercise))} done"><input type="checkbox" data-complete-id="${exercise.id}" ${completedExercises.has(exercise.id) ? "checked" : ""} /><span></span></label><div class="exercise-content">${choice}${metrics}</div>${adjusters}</div>`;
}
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]); }

function findExercise(exerciseId) { for (const section of currentWorkout().sections) { const exercise = section.exercises.find((item) => item.id === exerciseId); if (exercise) return { exercise, section }; } }
function changeExercise(exerciseId, property, delta) { const found = findExercise(exerciseId); if (!found) return; if (property === "sets") { if (found.exercise.sets) found.exercise.sets = Math.max(1, found.exercise.sets + delta); else found.section.rounds = Math.max(1, (found.section.rounds || 1) + delta); } else if (property === "target") { const target = found.exercise.target; if (target.type === "reps") target.reps = Math.max(1, target.reps + delta); else if (target.type === "time") target.seconds = Math.max(5, target.seconds + delta); else { const nextMin = Math.max(1, target.min + delta); const width = target.max - target.min; target.min = nextMin; target.max = nextMin + width; } } else { found.exercise.restSeconds = Math.max(0, exerciseRest(found.exercise) + delta); } persist(); renderLibrary(); }

function flattenedExercises(workout) {
  return workout.sections.flatMap((section) => {
    if (section.rounds) return Array.from({ length: section.rounds }, (_, roundIndex) => section.exercises.map((exercise) => ({ exercise, section, setIndex: roundIndex, totalSets: section.rounds }))).flat();
    return section.exercises.flatMap((exercise) => Array.from({ length: getSets(exercise, section) }, (_, setIndex) => ({ exercise, section, setIndex, totalSets: getSets(exercise, section) })));
  });
}
function startGuided() { activeSession = { steps: flattenedExercises(currentWorkout()), index: 0, phase: "work", remaining: 0, startedAt: Date.now() }; clearInterval(timerId); showPage("guided"); renderGuided(); }
function renderGuided() {
  const session = activeSession;
  const step = session.steps[session.index];
  const total = session.steps.length;
  byId("guided-count").textContent = `${Math.min(session.index + 1, total)} / ${total}`;
  byId("progress-fill").style.width = `${(session.index / total) * 100}%`;
  if (!step) { byId("guided-kicker").textContent = "SESSION COMPLETE"; byId("guided-card").innerHTML = `<div class="complete-state"><p class="section-tag">NICE WORK</p><h1>All sets done.</h1><p>${total} sets completed in ${formatElapsed(Date.now() - session.startedAt)}.</p><div class="guided-actions"><button class="primary-button" id="restart-session">Do it again</button><button class="secondary-button" id="return-library">Back to workouts</button></div></div>`; byId("progress-fill").style.width = "100%"; return; }
  const isRest = session.phase === "rest";
  byId("guided-kicker").textContent = isRest ? "REST" : step.section.name.toUpperCase();
  byId("guided-card").innerHTML = isRest ? `<p class="section-tag">NEXT: ${escapeHtml(step.exercise.name)}</p><h1>Catch your breath.</h1><p class="timer rest">${clock(session.remaining)}</p><div class="guided-actions"><button class="primary-button" id="skip-rest">Skip rest</button><button class="secondary-button" id="pause-rest">Pause</button></div>` : `<p class="section-tag">${escapeHtml(step.section.name)}</p><h1>${escapeHtml(step.exercise.name)}</h1><p class="guided-target">${targetText(step.exercise.target)}</p><p class="set-indicator">Set ${step.setIndex + 1} of ${step.totalSets}</p><div class="guided-actions"><button class="primary-button finish-button" id="finish-set">Finished set</button><button class="secondary-button" id="skip-set">Skip</button></div>`;
}
function clock(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; }
function formatElapsed(milliseconds) { const seconds = Math.round(milliseconds / 1000); return `${Math.floor(seconds / 60)}m ${seconds % 60}s`; }
function finishSet() { const step = activeSession.steps[activeSession.index]; const isLast = activeSession.index === activeSession.steps.length - 1; const rest = hasRepeatedWork(step.exercise, step.section) ? exerciseRest(step.exercise) : 0; if (isLast || !rest) { activeSession.index++; renderGuided(); return; } activeSession.phase = "rest"; activeSession.remaining = rest; renderGuided(); startTimer(); }
function startTimer() { clearInterval(timerId); timerId = setInterval(() => { activeSession.remaining--; if (activeSession.remaining <= 0) { clearInterval(timerId); activeSession.index++; activeSession.phase = "work"; } renderGuided(); }, 1000); }
function skipRest() { clearInterval(timerId); activeSession.index++; activeSession.phase = "work"; renderGuided(); }
function pauseRest() { if (timerId) { clearInterval(timerId); timerId = null; byId("pause-rest").textContent = "Resume"; } else { startTimer(); byId("pause-rest").textContent = "Pause"; } }

function showPage(page) { clearInterval(timerId); timerId = null; document.querySelectorAll(".page").forEach((element) => element.classList.remove("active")); document.querySelectorAll(".nav-link").forEach((element) => element.classList.toggle("active", element.dataset.page === page)); byId(`${page}-page`).classList.add("active"); if (page === "library") renderLibrary(); }
function addExerciseField() { const template = byId("exercise-field-template"); byId("exercise-fields").append(template.content.cloneNode(true)); }
function parseTarget(value) { const normalized = value.trim().toLowerCase(); const numberMatch = normalized.match(/(\d+)\s*(?:-|to)?\s*(\d+)?/); const perSide = /side|leg/.test(normalized); if (!numberMatch) return { type: "reps", reps: 10, perSide }; const first = Number(numberMatch[1]); const second = numberMatch[2] ? Number(numberMatch[2]) : null; const timed = /sec|min/.test(normalized); const multiplier = /min/.test(normalized) ? 60 : 1; if (second) return timed ? { type: "range-time", min: first * multiplier, max: second * multiplier, perSide } : { type: "range", min: first, max: second, perSide }; return timed ? { type: "time", seconds: first * multiplier, perSide } : { type: "reps", reps: first, perSide }; }
function createWorkout(event) { event.preventDefault(); const form = event.currentTarget; const formData = new FormData(form); const name = formData.get("name").trim(); const id = `${slugify(name)}-${Date.now().toString(36)}`; const defaultRest = Math.max(0, Number(formData.get("defaultRest")) || 60); const exercises = [...byId("exercise-fields").querySelectorAll(".exercise-field")].map((field, index) => ({ id: `${slugify(field.querySelector('[data-field="name"]').value)}-${index + 1}`, name: field.querySelector('[data-field="name"]').value.trim(), sets: Math.max(1, Number(field.querySelector('[data-field="sets"]').value) || 1), target: parseTarget(field.querySelector('[data-field="target"]').value), restSeconds: Math.max(0, Number(field.querySelector('[data-field="rest"]').value) || defaultRest) })); if (!exercises.length || exercises.some((exercise) => !exercise.name)) return; data.workouts.push({ id, name, subtitle: formData.get("subtitle").trim(), accent: formData.get("accent"), sections: [{ id: "main", name: "Main Workout", exercises }] }); selectedWorkoutId = id; persist(); form.reset(); byId("exercise-fields").innerHTML = ""; addExerciseField(); showPage("library"); }

async function importJson() { byId("file-input").click(); }
async function readChosenFile(event) { const file = event.target.files[0]; if (!file) return; try { const parsed = JSON.parse(await file.text()); if (!Array.isArray(parsed.workouts) || !parsed.settings) throw new Error("Expected a workout data file"); data = parsed; selectedWorkoutId = data.workouts[0]?.id; fileHandle = undefined; persist(); renderLibrary(); alert("Workout file loaded."); } catch (error) { alert(`Could not open file: ${error.message}`); } finally { event.target.value = ""; } }
async function saveFile() { const text = JSON.stringify(data, null, 2); try { if (window.isSecureContext && "showSaveFilePicker" in window) { fileHandle ||= await window.showSaveFilePicker({ suggestedName: "workouts.json", types: [{ description: "Workout JSON", accept: { "application/json": [".json"] } }] }); const writable = await fileHandle.createWritable(); await writable.write(text); await writable.close(); alert("Workout file saved."); } else { const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([text], { type: "application/json" })); link.download = "workouts.json"; link.click(); URL.revokeObjectURL(link.href); } } catch (error) { if (error.name !== "AbortError") alert(`Could not save file: ${error.message}`); } }
function resetPlan() { if (!confirm("Reset the workout library to the original three-day plan?")) return; data = clone(window.STARTER_WORKOUT_DATA); selectedWorkoutId = data.workouts[0].id; fileHandle = undefined; localStorage.removeItem(storageKey); renderLibrary(); }

document.addEventListener("click", (event) => { const target = event.target.closest("button"); if (!target) return; if (target.dataset.page) return showPage(target.dataset.page); if (target.dataset.workoutId) { selectedWorkoutId = target.dataset.workoutId; completedExercises = new Set(); renderLibrary(); } if (target.dataset.change) changeExercise(target.dataset.exerciseId, target.dataset.change, Number(target.dataset.delta)); if (target.id === "start-workout") startGuided(); if (target.id === "exit-guided" || target.id === "return-library") showPage("library"); if (target.id === "finish-set" || target.id === "skip-set") finishSet(); if (target.id === "skip-rest") skipRest(); if (target.id === "pause-rest") pauseRest(); if (target.id === "restart-session") startGuided(); if (target.id === "import-button") importJson(); if (target.id === "save-button") saveFile(); if (target.id === "reset-button") resetPlan(); if (target.id === "reset-progress") { completedExercises = new Set(); renderLibrary(); } if (target.id === "add-exercise") addExerciseField(); if (target.classList.contains("remove-exercise")) target.closest(".exercise-field").remove(); if (target.id === "clear-builder") { setTimeout(() => { byId("exercise-fields").innerHTML = ""; addExerciseField(); }); } });
byId("file-input").addEventListener("change", readChosenFile); byId("workout-form").addEventListener("submit", createWorkout);
document.addEventListener("change", (event) => { if (event.target.matches(".alternative-select")) { const found = findExercise(event.target.dataset.exerciseId); if (!found) return; found.exercise.selectedVariation = event.target.value === found.exercise.name ? "" : event.target.value; persist(); } if (event.target.matches("[data-complete-id]")) { const { completeId } = event.target.dataset; if (event.target.checked) completedExercises.add(completeId); else completedExercises.delete(completeId); event.target.closest(".exercise-row").classList.toggle("is-complete", event.target.checked); } });
loadData().then((loaded) => { data = loaded; selectedWorkoutId = data.workouts[0]?.id; renderLibrary(); addExerciseField(); }).catch((error) => { document.body.innerHTML = `<p style="padding: 40px; font-family: sans-serif">Could not load workout data: ${escapeHtml(error.message)}</p>`; });