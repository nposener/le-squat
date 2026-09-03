const storageKey = "set-go-workouts-v1";
const activeSessionStorageKey = "set-go-active-session-v1";
const sessionPreferencesStorageKey = "set-go-session-preferences-v1";
let data;
let selectedWorkoutId;
let activeSession;
let timerId;
let completedExercises = new Set();
let sessionPreferences = { alertsEnabled: false, descriptionsVisible: true };
let editingWorkoutId;
let openExerciseConfigId;
const starterExerciseDescriptions = {
  "air-squats": "Stand with feet about hip-width apart and sit your hips back and down. Keep your chest lifted, knees tracking over toes, and press through your heels to stand tall.",
  "hip-circles": "Stand tall and lift one knee to roughly hip height before drawing a slow circle from the hip. Keep the pelvis steady and make the circle smooth rather than forcing its range.",
  "calf-stretch": "Place one foot behind you with the heel grounded and toes pointing forward. Lean forward gently until the calf lengthens, keeping the back leg straight and the stretch comfortable.",
  "ankle-rocks": "Face a wall or stable support with one foot forward and keep that heel heavy. Glide the knee slowly toward the toes, then back out, without letting the arch collapse inward.",
  "box-pistol": "Stand in front of a stable box or chair and extend one leg forward as you lower under control. Lightly touch the box, then drive through the working heel to stand without twisting the hips.",
  "bulgarian-split": "Rest the top of your rear foot on a stable surface and set your front foot far enough forward to stay balanced. Lower the rear knee toward the floor with a tall torso, then press through the front foot to rise.",
  "glute-bridges": "Lie on your back with knees bent, feet flat, and heels close to your hips. Brace lightly, lift your hips by squeezing the glutes, and avoid arching the lower back at the top.",
  "negative-pistol": "Use a counterweight or support as needed while lowering on one leg as slowly as possible. Keep the working knee aligned with the toes and use both legs or assistance to return to standing.",
  "leg-raises": "Lie on your back with hands beside you or tucked under the hips for support. Keep the lower back heavy as the legs lower, stopping before the back lifts from the floor.",
  "pigeon": "Bring one shin in front of you and extend the opposite leg behind with the hips as level as possible. Fold forward only as far as you can breathe easily, keeping the sensation in the outer hip rather than the knee.",
  "quad-stretch": "Stand tall, bend one knee, and guide that heel toward the same-side glute. Keep both knees close together and gently tuck the pelvis instead of pulling hard on the foot.",
  "cooldown-calf": "Place the back foot far enough behind that the heel can stay heavy on the floor. Shift forward slowly and use an easy breath to settle into the calf and Achilles.",
  "arm-circles": "Stand with ribs stacked over hips and extend the arms comfortably to the sides. Make controlled circles from the shoulders, moving forward first and then reversing direction.",
  "wall-openers": "Place a hand or forearm on a wall at shoulder height and turn the body away gradually. Keep the shoulder down away from the ear and stop at a gentle opening across the chest.",
  "shoulder-taps": "Start in a high plank with hands under shoulders and feet wide enough to control your balance. Tap the opposite shoulder slowly while keeping hips and ribs as level as possible.",
  "pushups": "Set hands just outside shoulder width and create one straight line from head through heels or knees. Lower the chest between the hands with elbows angled back, then press the floor away while keeping the core braced.",
  "reverse-plank": "Sit with hands behind you, fingers pointing toward your feet or slightly outward as comfortable. Press down through hands and heels to lift the hips, opening the chest without dropping the head back.",
  "pike-pushups": "Begin in an inverted V with hands planted firmly and hips high. Shift forward slightly as you lower the crown of the head toward the floor, then press back up without collapsing the shoulders.",
  "forearm-plank": "Place elbows under shoulders and extend the legs into a long, strong line. Squeeze glutes, gently tuck the pelvis, and keep breathing without allowing the low back to sag.",
  "side-plank": "Stack the supporting elbow or hand directly below the shoulder and extend the legs in a straight line. Lift the hips away from the floor while keeping the neck long and the top shoulder open.",
  "chest-stretch": "Place an arm against a doorway or wall with the elbow bent or straight at a comfortable height. Turn your body away slowly until the chest opens, keeping the shoulder relaxed and pain-free.",
  "shoulder-cross": "Bring one straight arm across the chest and support it gently above the elbow with the other arm. Keep the shoulder blade low and avoid rotating your torso to make the stretch stronger.",
  "cat-cow": "Start on hands and knees with hands below shoulders and knees below hips. Alternate between rounding the whole spine and gently arching the chest forward, letting the movement follow your breath.",
  "jumping-jacks": "Stand tall, then step or jump the feet wide as the arms travel overhead. Return with soft, quiet landings and choose a pace that keeps your breathing controlled.",
  "swings": "Stand tall and begin with small, relaxed swings of the arms and legs. Let the movement come from the shoulders and hips while keeping the torso upright and stable.",
  "squat-stand": "Fold forward to hold the toes or shins, then bend the knees and drop the hips into a deep squat. Lift the chest between the arms before straightening the legs only as far as your hamstrings allow.",
  "step-ups": "Step fully onto a stable box or stair and place the whole working foot on the surface. Drive through that foot to stand tall, then lower slowly instead of pushing off hard with the trailing leg.",
  "circuit-pushups": "Set a strong high plank before every repetition, using knees down if needed to maintain shape. Lower under control and press up with the chest, hips, and shoulders moving together.",
  "circuit-reverse-plank": "Set the hands behind you with fingers comfortable and feet grounded in front. Lift through the hips and chest while pressing the floor away, keeping the neck neutral and shoulders active.",
  "wall-sit": "Slide down a wall until the knees are bent to a manageable depth and feet are planted under the knees. Press the back into the wall, distribute weight through both feet, and breathe steadily.",
  "hollow-hold": "Lie on your back and flatten the lower spine gently into the floor by tucking the pelvis. Lift shoulders and legs only as low as you can without losing that back position.",
  "deep-squat": "Stand with feet at a comfortable width and lower slowly into the deepest squat you can control. Keep heels grounded, use the elbows to gently open the knees, and relax into the hips.",
  "forward-fold": "Stand with a soft bend in the knees and hinge forward from the hips. Let the head and arms hang while keeping the weight even through the feet and avoiding any forced pull.",
  "child-pose": "Kneel and sit the hips toward the heels, then reach the arms forward along the floor. Breathe into the back and sides of the ribs, adjusting knee width until the position feels restful.",
  "hip-flexor": "Kneel in a split stance and gently tuck the pelvis before shifting forward a small amount. Keep the torso tall and squeeze the glute of the kneeling side to target the front of that hip.",
  "marching-knee-hugs": "Walk forward slowly, bringing one knee toward the chest with both hands if comfortable. Stand tall on the supporting leg and avoid rounding or leaning back as you alternate sides.",
  "lateral-squat-shifts": "Start in a wide stance and shift the hips toward one side while the other leg lengthens. Keep the grounded foot flat, chest lifted, and move smoothly through the center before changing sides.",
  "glute-bridge-warmup": "Lie on your back with feet flat and ribs softly down before lifting the hips. Squeeze the glutes at the top for a brief pause, then lower with control without overextending the back.",
  "hip-hinges": "Stand with a slight knee bend and push the hips back as though closing a door behind you. Keep the spine long, feel the hamstrings load, and squeeze the glutes to return upright.",
  "single-leg-rdl": "Stand on one leg and hinge from the hips as the free leg reaches straight behind you. Keep hips square to the floor, maintain a long spine, and use a light fingertip support if balance limits form.",
  "reverse-lunge": "From a tall stance, step one foot back and lower both knees toward the floor under control. Keep most weight in the front foot and press through it to return without tipping forward.",
  "lateral-lunge": "Take a wide stance and sit the hips back toward one bent knee while the opposite leg stays long. Keep the bent knee tracking over the foot, then push the floor away to return to center.",
  "hamstring-walkouts": "Begin in a glute bridge and take tiny heel steps away from the hips while keeping them lifted. Walk the heels back in with control, lowering the hips only if you cannot maintain a neutral back.",
  "single-leg-calf-raises": "Stand near a wall for balance and shift weight fully onto one foot. Rise onto the ball of that foot with a brief pause at the top, then lower the heel slowly through the full range.",
  "dead-bug-2": "Lie on your back with arms up and knees bent above the hips, keeping the low back gently heavy. Slowly extend the opposite arm and leg, then return before the pelvis or ribs begin to move.",
  "hamstring-stretch": "Extend one leg comfortably in front and hinge forward from the hips rather than rounding hard at the waist. Keep the spine long and ease off if you feel pulling behind the knee.",
  "adductor-stretch": "Use a wide stance and shift the hips toward one bent knee while the other leg stays long. Keep the long-leg foot grounded and move only to a gentle inner-thigh stretch.",
  "figure-four": "Lie on your back and cross one ankle over the opposite thigh, keeping the lifted foot flexed. Draw the legs toward you slowly until you feel the outer hip open without pressure in the knee.",
  "wall-slides": "Stand with back, head, and arms lightly against a wall in a comfortable starting position. Slide the arms upward slowly while keeping ribs down and avoiding a shrug through the shoulders.",
  "scapular-pushups": "Set up in a strong high plank with elbows locked but not hyperextended. Without bending the arms, let the chest sink slightly between the shoulders, then press the floor away to spread the shoulder blades.",
  "thoracic-rotations": "Start on hands and knees or in a side-lying position with the lower body stable. Rotate the upper back and open the chest toward the ceiling, allowing the eyes to follow the moving hand.",
  "close-grip-pushups": "Place hands beneath the shoulders or slightly narrower and create a firm plank from head to heels or knees. Keep elbows close to the ribs as you lower, then press up without letting the hips sag.",
  "prone-y-t": "Lie face down with the forehead resting lightly and arms extended in a Y or T shape. Lift the arms from the upper back with thumbs up if comfortable, keeping the neck relaxed and shoulders away from ears.",
  "superman-pulldown": "Lie face down with arms overhead and gently lift the chest and legs to a comfortable height. Pull elbows down toward the ribs as if making a pull-down, then reach long again without straining the neck.",
  "triceps-extension": "Set hands on a wall, bench, or floor with the body held in a straight line. Bend only at the elbows to bring the forehead toward the hands, then press through the palms to straighten the arms.",
  "bear-plank": "Start on hands and knees, then hover the knees a few centimeters above the floor. Keep the back flat, shoulders stacked over hands, and breathe while resisting any shift side to side.",
  "bird-dog": "Begin on hands and knees with the spine long and hips level. Reach one arm and the opposite leg away slowly, then return with control before switching without rotating the torso.",
  "lat-stretch": "Reach one arm overhead and anchor the hand on a wall, doorway, or other stable point. Shift the hips gently away from that arm and breathe into the long side of the body.",
  "triceps-stretch": "Raise one arm, bend the elbow, and let the hand reach down the upper back. Use the other hand only lightly to guide the elbow upward while keeping the ribs from flaring forward.",
  "thread-needle": "From hands and knees, slide one arm underneath the body with the palm turned upward. Rest the shoulder and side of the head gently, then breathe as the upper back rotates.",
  "marching-jacks": "March in place while stepping the feet wide and sweeping the arms overhead. Keep the movement light and rhythmic, choosing range and speed that warm you up without breathlessness.",
  "squat-reach": "Lower into a comfortable squat with hips back and chest lifted, then stand and reach both arms tall. Keep the knees tracking over the toes and avoid arching the lower back as you reach.",
  "arm-swings": "Stand tall and swing the arms forward and back in a loose, relaxed rhythm. Let the shoulders move freely while the ribs stay stacked over the hips.",
  "mixed-reverse-lunges": "Step back into a controlled lunge and alternate legs at a pace you can sustain. Keep the front knee tracking forward and use a shorter range if balance or control fades.",
  "mixed-pushups": "Start every repetition with a firm plank and hands set just outside the shoulders. Work at a steady cadence, using an incline or knees if that keeps the chest, hips, and shoulders moving together.",
  "single-leg-bridge": "Lie on your back with one foot planted and the other leg extended or bent comfortably. Drive through the planted heel to lift the hips, keeping both sides of the pelvis level before lowering slowly.",
  "mixed-prone-y-t": "Lie face down with the upper back engaged and move between Y and T arm positions. Lift the arms with control, squeezing the shoulder blades gently without craning the neck.",
  "mixed-dead-bug": "Lie with knees above hips and arms toward the ceiling, then reach opposite limbs away in a slow alternating pattern. Keep the low back still and reduce range as soon as the ribs or pelvis start to lift.",
  "mixed-quad-stretch": "Stand tall and guide one heel toward the glute while holding a wall if needed for balance. Keep the knees close and gently tuck the pelvis to stretch the front of the thigh.",
  "mixed-chest-stretch": "Place one arm on a doorway or wall and rotate the body away slowly. Keep the shoulder relaxed and settle at a mild chest opening rather than forcing the range."
};

const byId = (id) => document.getElementById(id);
const clone = (value) => JSON.parse(JSON.stringify(value));

async function loadData() {
  const saved = localStorage.getItem(storageKey);
  if (saved) return JSON.parse(saved);
  return clone(window.STARTER_WORKOUT_DATA);
}

function persist() { localStorage.setItem(storageKey, JSON.stringify(data)); }
function persistActiveSession() {
  if (!activeSession || activeSession.index >= activeSession.steps.length) {
    localStorage.removeItem(activeSessionStorageKey);
    return;
  }
  const { workoutId, index, phase, remaining, timerEndsAt, startedAt, completedExerciseIds } = activeSession;
  localStorage.setItem(activeSessionStorageKey, JSON.stringify({ workoutId, index, phase, remaining, timerEndsAt, startedAt, completedExerciseIds }));
}
function persistSessionPreferences() { localStorage.setItem(sessionPreferencesStorageKey, JSON.stringify(sessionPreferences)); }
function setDescriptionVisibility(visible) {
  document.body.classList.toggle("descriptions-hidden", !visible);
  byId("description-toggle").checked = visible;
}
function currentWorkout() { return data.workouts.find((workout) => workout.id === selectedWorkoutId); }
function formatSeconds(seconds) { return `${Math.max(0, seconds)}s`; }
function targetText(target, includePerSide = true) {
  const side = target.perSide && includePerSide ? " / side" : "";
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
function exerciseDescription(exercise) { return exercise.description || starterExerciseDescriptions[exercise.id] || ""; }
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
function isCustomWorkout(workout) { return workout.isCustom || !window.STARTER_WORKOUT_DATA.workouts.some((starter) => starter.id === workout.id); }

function renderLibrary() {
  const selected = currentWorkout() || data.workouts[0];
  selectedWorkoutId = selected.id;
  byId("workout-selector").innerHTML = data.workouts.map((workout) => `<button class="workout-tab ${workout.id === selected.id ? "active" : ""}" style="--accent: var(--${workout.accent || "coral"})" data-workout-id="${workout.id}" role="tab" aria-selected="${workout.id === selected.id}"><strong>${escapeHtml(workout.name)}</strong><span>${escapeHtml(workout.subtitle || "Custom workout")}</span></button>`).join("");
  byId("workout-panel").innerHTML = `<div class="workout-title"><div><h2>${escapeHtml(selected.name)}</h2><p>${escapeHtml(selected.subtitle || "Custom workout")} / ${estimateText(selected)}</p></div><div class="workout-actions">${isCustomWorkout(selected) ? `<button class="secondary-button" id="edit-workout">Edit workout</button>` : ""}${hasResumableSession() ? `<button class="secondary-button" id="resume-session">Resume session</button><button class="secondary-button" id="stop-session">Stop session</button>` : ""}<button class="secondary-button reset-progress" id="reset-progress">Reset checks</button><button class="primary-button" id="start-workout">Start guided session</button></div></div>${selected.sections.map(renderSection).join("")}`;
}

function renderSection(section) {
  const descriptor = section.rounds ? `${section.name} / ${section.rounds} rounds` : `${section.name}${section.durationMinutes ? ` / ${section.durationMinutes} min` : ""}`;
  return `<section class="section-block section-${section.id}"><div class="section-label"><span>${escapeHtml(descriptor)}</span><i></i></div><div class="exercise-list">${section.exercises.map((exercise) => renderExercise(exercise, section)).join("")}</div></section>`;
}
function renderExercise(exercise, section) {
  const sets = getSets(exercise, section);
  const repeated = hasRepeatedWork(exercise, section);
  const choice = exercise.alternatives ? `<select class="alternative-select" data-exercise-id="${exercise.id}" aria-label="Exercise variation"><option ${!exercise.selectedVariation ? "selected" : ""}>${escapeHtml(exercise.name)}</option>${exercise.alternatives.map((name) => `<option ${exercise.selectedVariation === name ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}</select>` : `<div class="exercise-name">${escapeHtml(exerciseName(exercise))}</div>`;
  const descriptionText = exerciseDescription(exercise);
  const description = descriptionText ? `<p class="exercise-description">${escapeHtml(descriptionText)}</p>` : "";
  const targetLabel = exercise.target.type === "time" || exercise.target.type === "range-time" ? "time" : "reps";
  const metrics = `<div class="exercise-metrics"><span><b>${targetText(exercise.target)}</b><small>${targetLabel}</small></span>${repeated ? `<span><b>${sets}</b><small>${section.rounds && !exercise.sets ? "rounds" : "sets"}</small></span><span><b>${formatSeconds(exerciseRest(exercise))}</b><small>rest</small></span>` : ""}</div>`;
  const adjusters = `<details class="exercise-config" data-config-exercise-id="${exercise.id}" ${openExerciseConfigId === exercise.id ? "open" : ""}><summary aria-label="Adjust ${escapeHtml(exerciseName(exercise))}" title="Adjust exercise">Adjust</summary><div class="config-controls"><div class="mini-control"><span>${targetLabel}</span><div class="stepper"><button data-change="target" data-exercise-id="${exercise.id}" data-delta="-${targetStep(exercise.target)}" aria-label="Decrease ${targetLabel}">-</button><strong>${targetAmount(exercise.target)}</strong><button data-change="target" data-exercise-id="${exercise.id}" data-delta="${targetStep(exercise.target)}" aria-label="Increase ${targetLabel}">+</button></div></div>${repeated ? `<div class="mini-control"><span>${section.rounds && !exercise.sets ? "rounds" : "sets"}</span><div class="stepper"><button data-change="sets" data-exercise-id="${exercise.id}" data-delta="-1" aria-label="Decrease sets">-</button><strong>${sets}</strong><button data-change="sets" data-exercise-id="${exercise.id}" data-delta="1" aria-label="Increase sets">+</button></div></div><div class="mini-control"><span>rest</span><div class="stepper"><button data-change="rest" data-exercise-id="${exercise.id}" data-delta="-15" aria-label="Decrease rest">-</button><strong>${formatSeconds(exerciseRest(exercise))}</strong><button data-change="rest" data-exercise-id="${exercise.id}" data-delta="15" aria-label="Increase rest">+</button></div></div>` : ""}</div></details>`;
  return `<div class="exercise-row ${completedExercises.has(exercise.id) ? "is-complete" : ""}"><label class="done-toggle" title="Mark ${escapeHtml(exerciseName(exercise))} done"><input type="checkbox" data-complete-id="${exercise.id}" ${completedExercises.has(exercise.id) ? "checked" : ""} /><span></span></label><div class="exercise-content">${choice}${description}${metrics}</div>${adjusters}</div>`;
}
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]); }

function findExercise(exerciseId) { for (const section of currentWorkout().sections) { const exercise = section.exercises.find((item) => item.id === exerciseId); if (exercise) return { exercise, section }; } }
function changeExercise(exerciseId, property, delta) {
  const found = findExercise(exerciseId);
  if (!found) return;
  openExerciseConfigId = exerciseId;
  if (property === "sets") {
    if (found.exercise.sets) found.exercise.sets = Math.max(1, found.exercise.sets + delta);
    else found.section.rounds = Math.max(1, (found.section.rounds || 1) + delta);
  } else if (property === "target") {
    const target = found.exercise.target;
    if (target.type === "reps") target.reps = Math.max(1, target.reps + delta);
    else if (target.type === "time") target.seconds = Math.max(5, target.seconds + delta);
    else {
      const nextMin = Math.max(1, target.min + delta);
      const width = target.max - target.min;
      target.min = nextMin;
      target.max = nextMin + width;
    }
  } else found.exercise.restSeconds = Math.max(0, exerciseRest(found.exercise) + delta);
  persist();
  renderLibrary();
}

function flattenedExercises(workout) {
  const makeSteps = (exercise, section, setIndex, totalSets) => {
    const step = { exercise, section, setIndex, totalSets };
    return exercise.target.perSide ? ["Left", "Right"].map((side) => ({ ...step, side })) : [step];
  };
  return workout.sections.flatMap((section) => {
    if (section.rounds) return Array.from({ length: section.rounds }, (_, roundIndex) => section.exercises.flatMap((exercise) => makeSteps(exercise, section, roundIndex, section.rounds))).flat();
    return section.exercises.flatMap((exercise) => Array.from({ length: getSets(exercise, section) }, (_, setIndex) => makeSteps(exercise, section, setIndex, getSets(exercise, section))).flat());
  });
}
function startGuided() {
  completedExercises = new Set();
  activeSession = { workoutId: currentWorkout().id, steps: flattenedExercises(currentWorkout()), index: 0, phase: "work", remaining: 0, timerEndsAt: null, startedAt: Date.now(), completedExerciseIds: [] };
  clearInterval(timerId);
  persistActiveSession();
  showPage("guided");
  renderGuided();
}
function resumeGuided() {
  if (!hasResumableSession()) return;
  selectedWorkoutId = activeSession.workoutId;
  completedExercises = new Set(activeSession.completedExerciseIds);
  showPage("guided");
  renderGuided();
  if (activeSession.phase === "rest" || activeSession.phase === "timed-work") startTimer();
}
function stopSession() {
  clearInterval(timerId);
  timerId = null;
  activeSession = undefined;
  completedExercises = new Set();
  persistActiveSession();
  renderLibrary();
}
function hasResumableSession() { return activeSession && activeSession.index < activeSession.steps.length; }
function stepTitle(step) { return `${exerciseName(step.exercise)}${step.side ? ` (${step.side.toLowerCase()} side)` : ""}`; }
function shouldRestAfterStep(step) { return hasRepeatedWork(step.exercise, step.section) && (!step.side || step.side === "Right"); }
function isTimedExercise(exercise) { return exercise.target.type === "time" || exercise.target.type === "range-time"; }
function sectionPalette(section) {
  const name = `${section.id} ${section.name}`.toLowerCase();
  if (/cool.?down|stretch/.test(name)) return { accent: "blue", surface: "sky" };
  if (/main|circuit/.test(name)) return { accent: "coral", surface: "blush" };
  return { accent: "mint", surface: "mint-wash" };
}
function renderGuided() {
  const session = activeSession;
  const step = session.steps[session.index];
  const total = session.steps.length;
  const palette = step ? sectionPalette(step.section) : { accent: "coral", surface: "blush" };
  byId("guided-page").style.setProperty("--guided-accent", `var(--${palette.accent})`);
  byId("guided-page").style.setProperty("--guided-surface", `var(--${palette.surface})`);
  byId("guided-count").textContent = `${Math.min(session.index + 1, total)} / ${total}`;
  byId("progress-fill").style.width = `${(session.index / total) * 100}%`;
  if (!step) { persistActiveSession(); byId("guided-kicker").textContent = "SESSION COMPLETE"; byId("guided-card").innerHTML = `<div class="complete-state"><p class="section-tag">NICE WORK</p><h1>All sets done.</h1><p>${total} steps completed in ${formatElapsed(Date.now() - session.startedAt)}.</p><div class="guided-actions"><button class="primary-button" id="restart-session">Do it again</button><button class="secondary-button" id="return-library">Back to workouts</button></div></div>`; byId("progress-fill").style.width = "100%"; return; }
  const isRest = session.phase === "rest";
  byId("guided-kicker").textContent = isRest ? "REST" : step.section.name.toUpperCase();
  const alertToggle = `<label class="alert-toggle"><input type="checkbox" id="alert-toggle" ${sessionPreferences.alertsEnabled ? "checked" : ""} /> Alert when rest ends</label>`;
  if (isRest) {
    byId("guided-card").innerHTML = `<p class="section-tag">NEXT: ${escapeHtml(stepTitle(step))}</p><h1>Catch your breath.</h1><p class="timer rest" id="guided-timer">${clock(session.remaining)}</p><div class="guided-actions"><button class="primary-button" id="skip-rest">Skip rest</button><button class="secondary-button" id="pause-rest">Pause</button></div>${alertToggle}`;
  } else if (session.phase === "timed-work") {
    byId("guided-card").innerHTML = `<p class="section-tag guided-section-title">${escapeHtml(step.section.name)}</p><h1>${escapeHtml(exerciseName(step.exercise))}</h1>${exerciseDescription(step.exercise) ? `<p class="guided-description">${escapeHtml(exerciseDescription(step.exercise))}</p>` : ""}<p class="timer" id="guided-timer">${clock(session.remaining)}</p><p class="set-indicator">${step.side ? `<strong>${step.side} side</strong> · ` : ""}Set <strong>${step.setIndex + 1}</strong> of ${step.totalSets}</p><div class="guided-actions"><button class="primary-button" id="finish-timed-work">Finish early</button><button class="secondary-button" id="pause-work-timer">Pause</button></div>${alertToggle}`;
  } else {
    const primaryAction = isTimedExercise(step.exercise) ? `<button class="primary-button finish-button" id="start-work-timer">Start timer</button>` : `<button class="primary-button finish-button" id="finish-set">Finished set</button>`;
    byId("guided-card").innerHTML = `<p class="section-tag guided-section-title">${escapeHtml(step.section.name)}</p><h1>${escapeHtml(exerciseName(step.exercise))}</h1>${exerciseDescription(step.exercise) ? `<p class="guided-description">${escapeHtml(exerciseDescription(step.exercise))}</p>` : ""}<p class="guided-target">${targetText(step.exercise.target, false)}</p><p class="set-indicator">${step.side ? `<strong>${step.side} side</strong> · ` : ""}Set <strong>${step.setIndex + 1}</strong> of ${step.totalSets}</p><div class="guided-actions">${primaryAction}<button class="secondary-button" id="skip-set">Skip</button></div>${alertToggle}`;
  }
}
function clock(seconds) { return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`; }
function formatElapsed(milliseconds) { const seconds = Math.round(milliseconds / 1000); return `${Math.floor(seconds / 60)}m ${seconds % 60}s`; }
function finishSet(completed = true) {
  clearInterval(timerId);
  timerId = null;
  const step = activeSession.steps[activeSession.index];
  const isLast = activeSession.index === activeSession.steps.length - 1;
  activeSession.timerEndsAt = null;
  if (completed && !activeSession.steps.slice(activeSession.index + 1).some((candidate) => candidate.exercise.id === step.exercise.id)) {
    completedExercises.add(step.exercise.id);
    activeSession.completedExerciseIds = [...completedExercises];
  }
  const rest = shouldRestAfterStep(step) ? exerciseRest(step.exercise) : 0;
  if (isLast || !rest) { activeSession.index++; activeSession.phase = "work"; persistActiveSession(); renderGuided(); return; }
  activeSession.phase = "rest";
  activeSession.remaining = rest;
  activeSession.timerEndsAt = Date.now() + (rest * 1000);
  persistActiveSession();
  renderGuided();
  startTimer();
}
function notifyRestFinished() {
  if (!sessionPreferences.alertsEnabled) return;
  if (navigator.vibrate) navigator.vibrate([100, 80, 100]);
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return;
  try {
    const context = new AudioContextConstructor();
    const oscillator = context.createOscillator();
    oscillator.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.12);
  } catch (error) { }
}
function startWorkTimer() {
  const step = activeSession.steps[activeSession.index];
  activeSession.phase = "timed-work";
  activeSession.remaining = targetAmount(step.exercise.target);
  activeSession.timerEndsAt = Date.now() + (activeSession.remaining * 1000);
  persistActiveSession();
  renderGuided();
  startTimer();
}
function startTimer() {
  clearInterval(timerId);
  if (!activeSession.timerEndsAt) activeSession.timerEndsAt = Date.now() + (activeSession.remaining * 1000);
  timerId = setInterval(() => {
    const previousRemaining = activeSession.remaining;
    activeSession.remaining = Math.max(0, Math.ceil((activeSession.timerEndsAt - Date.now()) / 1000));
    if (activeSession.remaining <= 0) {
      clearInterval(timerId);
      timerId = null;
      if (activeSession.phase === "rest") {
        activeSession.index++;
        activeSession.phase = "work";
        activeSession.timerEndsAt = null;
        notifyRestFinished();
      } else {
        finishSet();
        return;
      }
    }
    if (activeSession.remaining !== previousRemaining) {
      const guidedTimer = byId("guided-timer");
      if (guidedTimer) guidedTimer.textContent = clock(activeSession.remaining);
      persistActiveSession();
    }
  }, 250);
}
function skipRest() { clearInterval(timerId); timerId = null; activeSession.index++; activeSession.phase = "work"; activeSession.timerEndsAt = null; persistActiveSession(); renderGuided(); }
function toggleTimer(buttonId) { if (timerId) { clearInterval(timerId); timerId = null; activeSession.timerEndsAt = null; persistActiveSession(); byId(buttonId).textContent = "Resume"; } else { startTimer(); persistActiveSession(); byId(buttonId).textContent = "Pause"; } }

function showPage(page) { clearInterval(timerId); timerId = null; document.querySelectorAll(".page").forEach((element) => element.classList.remove("active")); document.querySelectorAll(".nav-link").forEach((element) => element.classList.toggle("active", element.dataset.page === page)); byId(`${page}-page`).classList.add("active"); if (page === "library") renderLibrary(); }
function targetInputValue(target) {
  const amount = target.type === "reps" ? target.reps : target.type === "time" ? target.seconds : `${target.min}-${target.max}`;
  const unit = target.type === "time" || target.type === "range-time" ? " sec" : " reps";
  return `${amount}${unit}${target.perSide ? " per side" : ""}`;
}
function addExerciseField(sectionElement, exercise = {}) {
  const template = byId("exercise-field-template");
  const field = template.content.cloneNode(true);
  const nameInput = field.querySelector('[data-field="name"]');
  const targetInput = field.querySelector('[data-field="target"]');
  const descriptionInput = field.querySelector('[data-field="description"]');
  const setsInput = field.querySelector('[data-field="sets"]');
  const restInput = field.querySelector('[data-field="rest"]');
  nameInput.value = exercise.name || "";
  targetInput.value = exercise.target ? targetInputValue(exercise.target) : "";
  descriptionInput.value = exercise.description || "";
  setsInput.value = exercise.sets || 3;
  restInput.value = exercise.restSeconds ?? 60;
  sectionElement.querySelector(".section-exercise-fields").append(field);
}
function addBuilderSection(section = {}) {
  const template = byId("builder-section-template");
  const element = template.content.cloneNode(true);
  const sectionElement = element.querySelector("[data-builder-section]");
  sectionElement.querySelector("[data-section-name]").value = section.name || "Main Workout";
  byId("builder-sections").append(element);
  (section.exercises?.length ? section.exercises : [{}]).forEach((exercise) => addExerciseField(sectionElement, exercise));
}
function moveElement(element, direction) {
  const sibling = direction === "up" ? element.previousElementSibling : element.nextElementSibling;
  if (!sibling) return;
  if (direction === "up") element.parentElement.insertBefore(element, sibling);
  else element.parentElement.insertBefore(sibling, element);
}
function resetBuilder() {
  editingWorkoutId = undefined;
  byId("workout-form").reset();
  byId("builder-sections").innerHTML = "";
  byId("builder-description").textContent = "Build a reusable workout. It becomes available in your library immediately.";
  byId("save-workout").textContent = "Add workout";
  addBuilderSection();
}
function openBuilderForWorkout(workout, duplicate = false) {
  editingWorkoutId = duplicate ? undefined : workout.id;
  const form = byId("workout-form");
  form.elements.name.value = duplicate ? `${workout.name} copy` : workout.name;
  form.elements.subtitle.value = workout.subtitle || "";
  form.elements.accent.value = workout.accent || "coral";
  form.elements.defaultRest.value = data.settings.defaultRestSeconds;
  byId("builder-sections").innerHTML = "";
  workout.sections.forEach(addBuilderSection);
  byId("builder-description").textContent = duplicate ? "Start with this workout, then make it your own." : "Update the exercises and sections, then save your changes.";
  byId("save-workout").textContent = duplicate ? "Add workout" : "Save changes";
  showPage("create");
}
function parseTarget(value) { const normalized = value.trim().toLowerCase(); const numberMatch = normalized.match(/(\d+)\s*(?:-|to)?\s*(\d+)?/); const perSide = /side|leg/.test(normalized); if (!numberMatch) return { type: "reps", reps: 10, perSide }; const first = Number(numberMatch[1]); const second = numberMatch[2] ? Number(numberMatch[2]) : null; const timed = /sec|min/.test(normalized); const multiplier = /min/.test(normalized) ? 60 : 1; if (second) return timed ? { type: "range-time", min: first * multiplier, max: second * multiplier, perSide } : { type: "range", min: first, max: second, perSide }; return timed ? { type: "time", seconds: first * multiplier, perSide } : { type: "reps", reps: first, perSide }; }
function createWorkout(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const name = formData.get("name").trim();
  const defaultRest = Math.max(0, Number(formData.get("defaultRest")) || 60);
  const sections = [...byId("builder-sections").querySelectorAll("[data-builder-section]")].map((sectionField, sectionIndex) => {
    const sectionName = sectionField.querySelector("[data-section-name]").value.trim();
    const exercises = [...sectionField.querySelectorAll(".exercise-field")].map((field, exerciseIndex) => ({
      id: `${slugify(field.querySelector('[data-field="name"]').value)}-${sectionIndex + 1}-${exerciseIndex + 1}`,
      name: field.querySelector('[data-field="name"]').value.trim(),
      description: field.querySelector('[data-field="description"]').value.trim(),
      sets: Math.max(1, Number(field.querySelector('[data-field="sets"]').value) || 1),
      target: parseTarget(field.querySelector('[data-field="target"]').value),
      restSeconds: Math.max(0, Number(field.querySelector('[data-field="rest"]').value) || defaultRest)
    }));
    return { id: `${slugify(sectionName)}-${sectionIndex + 1}`, name: sectionName, exercises };
  });
  if (!sections.length || sections.some((section) => !section.name || !section.exercises.length || section.exercises.some((exercise) => !exercise.name))) return;
  const id = editingWorkoutId || `${slugify(name)}-${Date.now().toString(36)}`;
  const workout = { id, name, subtitle: formData.get("subtitle").trim(), accent: formData.get("accent"), sections, isCustom: true };
  const existingIndex = data.workouts.findIndex((item) => item.id === editingWorkoutId);
  if (existingIndex >= 0) data.workouts.splice(existingIndex, 1, workout);
  else data.workouts.push(workout);
  selectedWorkoutId = id;
  persist();
  resetBuilder();
  showPage("library");
}

function resetPlan() { if (!confirm("Reset the workout library to the original three-day plan?")) return; data = clone(window.STARTER_WORKOUT_DATA); selectedWorkoutId = data.workouts[0].id; localStorage.removeItem(storageKey); renderLibrary(); }

document.addEventListener("keydown", (event) => {
  if (event.code !== "Space" || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (!byId("guided-page").classList.contains("active") || event.target.closest("button, input, select, textarea, summary, a, [contenteditable]")) return;
  const primaryAction = byId("guided-card").querySelector(".primary-button:not(:disabled)");
  if (!primaryAction) return;
  event.preventDefault();
  primaryAction.click();
});
document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) {
    const row = event.target.closest(".exercise-row");
    if (!row || event.target.closest("label, select, input, summary, details")) return;
    row.querySelector("[data-complete-id]").click();
    return;
  }
  if (target.dataset.page) return showPage(target.dataset.page);
  if (target.dataset.workoutId) { selectedWorkoutId = target.dataset.workoutId; completedExercises = new Set(); renderLibrary(); }
  if (target.dataset.change) changeExercise(target.dataset.exerciseId, target.dataset.change, Number(target.dataset.delta));
  if (target.id === "start-workout") startGuided();
  if (target.id === "resume-session") resumeGuided();
  if (target.id === "stop-session") stopSession();
  if (target.id === "edit-workout") openBuilderForWorkout(currentWorkout());
  if (target.id === "exit-guided" || target.id === "return-library") showPage("library");
  if (target.id === "finish-set") finishSet();
  if (target.id === "skip-set") finishSet(false);
  if (target.id === "start-work-timer") startWorkTimer();
  if (target.id === "finish-timed-work") finishSet();
  if (target.id === "skip-rest") skipRest();
  if (target.id === "pause-rest" || target.id === "pause-work-timer") toggleTimer(target.id);
  if (target.id === "restart-session") startGuided();
  if (target.id === "reset-button") resetPlan();
  if (target.id === "reset-progress") { completedExercises = new Set(); renderLibrary(); }
  if (target.id === "add-section") addBuilderSection();
  if (target.classList.contains("add-section-exercise")) addExerciseField(target.closest("[data-builder-section]"));
  if (target.classList.contains("remove-section")) target.closest("[data-builder-section]").remove();
  if (target.classList.contains("move-section")) moveElement(target.closest("[data-builder-section]"), target.dataset.direction);
  if (target.classList.contains("remove-exercise")) target.closest(".exercise-field").remove();
  if (target.classList.contains("move-exercise")) moveElement(target.closest(".exercise-field"), target.dataset.direction);
  if (target.id === "clear-builder") setTimeout(resetBuilder);
});
byId("workout-form").addEventListener("submit", createWorkout);
document.addEventListener("change", (event) => { if (event.target.matches(".alternative-select")) { const found = findExercise(event.target.dataset.exerciseId); if (!found) return; found.exercise.selectedVariation = event.target.value === found.exercise.name ? "" : event.target.value; persist(); } if (event.target.matches("[data-complete-id]")) { const { completeId } = event.target.dataset; if (event.target.checked) completedExercises.add(completeId); else completedExercises.delete(completeId); event.target.closest(".exercise-row").classList.toggle("is-complete", event.target.checked); } if (event.target.id === "alert-toggle") { sessionPreferences.alertsEnabled = event.target.checked; persistSessionPreferences(); } if (event.target.id === "description-toggle") { sessionPreferences.descriptionsVisible = event.target.checked; persistSessionPreferences(); setDescriptionVisibility(sessionPreferences.descriptionsVisible); } });
document.addEventListener("toggle", (event) => {
  if (!event.target.matches(".exercise-config")) return;
  openExerciseConfigId = event.target.open ? event.target.dataset.configExerciseId : undefined;
});
loadData().then((loaded) => {
  data = loaded;
  selectedWorkoutId = data.workouts[0]?.id;
  sessionPreferences = { ...sessionPreferences, ...JSON.parse(localStorage.getItem(sessionPreferencesStorageKey) || "{}") };
  setDescriptionVisibility(sessionPreferences.descriptionsVisible);
  const savedSession = JSON.parse(localStorage.getItem(activeSessionStorageKey) || "null");
  if (savedSession?.restEndsAt && !savedSession.timerEndsAt) savedSession.timerEndsAt = savedSession.restEndsAt;
  const savedWorkout = savedSession && data.workouts.find((workout) => workout.id === savedSession.workoutId);
  if (savedWorkout) {
    const steps = flattenedExercises(savedWorkout);
    if (savedSession.index < steps.length) {
      activeSession = { ...savedSession, steps, completedExerciseIds: savedSession.completedExerciseIds || [] };
      completedExercises = new Set(activeSession.completedExerciseIds);
      if (activeSession.phase === "rest" && activeSession.timerEndsAt <= Date.now()) { activeSession.index++; activeSession.phase = "work"; activeSession.remaining = 0; activeSession.timerEndsAt = null; persistActiveSession(); }
    } else localStorage.removeItem(activeSessionStorageKey);
  }
  renderLibrary();
  resetBuilder();
}).catch((error) => { document.body.innerHTML = `<p style="padding: 40px; font-family: sans-serif">Could not load workout data: ${escapeHtml(error.message)}</p>`; });