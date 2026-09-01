window.STARTER_WORKOUT_DATA = {
  version: 1,
  settings: { defaultRestSeconds: 60 },
  workouts: [
    {
      id: "lower-body-core", name: "Lower Body + Core", subtitle: "Pistol Progression", accent: "coral",
      sections: [
        { id: "warmup", name: "Warm-Up", durationMinutes: 5, exercises: [
          { id: "air-squats", name: "Air squats", target: { type: "reps", reps: 15 } },
          { id: "hip-circles", name: "Hip circles", target: { type: "reps", reps: 10, perSide: true } },
          { id: "calf-stretch", name: "Calf stretch", target: { type: "time", seconds: 30, perSide: true } },
          { id: "ankle-rocks", name: "Ankle rocks", target: { type: "reps", reps: 10, perSide: true } }
        ] },
        { id: "main", name: "Main Workout", durationMinutes: 20, exercises: [
          { id: "box-pistol", name: "Box-supported pistol squats", sets: 3, target: { type: "range", min: 5, max: 8, perSide: true }, restSeconds: 75 },
          { id: "bulgarian-split", name: "Bulgarian split squats", sets: 2, target: { type: "reps", reps: 8, perSide: true }, restSeconds: 60 },
          { id: "glute-bridges", name: "Glute bridges", sets: 2, target: { type: "reps", reps: 12 }, restSeconds: 45 },
          { id: "negative-pistol", name: "Negative pistol squats", sets: 3, target: { type: "range", min: 3, max: 5, perSide: true }, restSeconds: 75 },
          { id: "leg-raises", name: "Leg raises", alternatives: ["Flutter kicks"], sets: 2, target: { type: "reps", reps: 15 }, restSeconds: 45 }
        ] },
        { id: "cooldown", name: "Cooldown / Stretch", durationMinutes: 5, exercises: [
          { id: "pigeon", name: "Pigeon stretch", target: { type: "time", seconds: 30, perSide: true } },
          { id: "quad-stretch", name: "Standing quad stretch", target: { type: "time", seconds: 30, perSide: true } },
          { id: "cooldown-calf", name: "Calf stretch", target: { type: "time", seconds: 30, perSide: true } }
        ] }
      ]
    },
    {
      id: "upper-body-core", name: "Upper Body + Core", subtitle: "Push, posture, and stability", accent: "blue",
      sections: [
        { id: "warmup", name: "Warm-Up", durationMinutes: 5, exercises: [
          { id: "arm-circles", name: "Arm circles", target: { type: "reps", reps: 10, note: "forward and back" } },
          { id: "wall-openers", name: "Wall shoulder openers", target: { type: "reps", reps: 10 } },
          { id: "shoulder-taps", name: "Plank shoulder taps", target: { type: "reps", reps: 10, perSide: true } }
        ] },
        { id: "main", name: "Main Workout", durationMinutes: 20, exercises: [
          { id: "pushups", name: "Push-ups", sets: 3, target: { type: "range", min: 10, max: 15 }, restSeconds: 60 },
          { id: "reverse-plank", name: "Reverse plank", alternatives: ["Rear delt squeezes"], sets: 3, target: { type: "time", seconds: 30 }, restSeconds: 45 },
          { id: "pike-pushups", name: "Pike push-ups", sets: 2, target: { type: "range", min: 8, max: 10 }, restSeconds: 60 },
          { id: "forearm-plank", name: "Forearm plank", sets: 2, target: { type: "range-time", min: 30, max: 45 }, restSeconds: 45 },
          { id: "side-plank", name: "Side plank", sets: 2, target: { type: "time", seconds: 20, perSide: true }, restSeconds: 45 }
        ] },
        { id: "cooldown", name: "Cooldown / Stretch", durationMinutes: 5, exercises: [
          { id: "chest-stretch", name: "Chest stretch", target: { type: "time", seconds: 30, perSide: true, note: "doorway" } },
          { id: "shoulder-cross", name: "Shoulder cross-body stretch", target: { type: "time", seconds: 30, perSide: true } },
          { id: "cat-cow", name: "Cat-cow pose", target: { type: "reps", reps: 10 } }
        ] }
      ]
    },
    {
      id: "full-body-conditioning", name: "Full Body + Conditioning", subtitle: "Three-round circuit", accent: "gold",
      sections: [
        { id: "warmup", name: "Warm-Up", durationMinutes: 5, exercises: [
          { id: "jumping-jacks", name: "Jumping jacks", target: { type: "reps", reps: 30 } },
          { id: "swings", name: "Arm & leg swings", target: { type: "reps", reps: 10, perSide: true } },
          { id: "squat-stand", name: "Squat to stand", target: { type: "reps", reps: 5 } }
        ] },
        { id: "main", name: "Circuit", durationMinutes: 20, rounds: 3, exercises: [
          { id: "step-ups", name: "Step-ups", target: { type: "reps", reps: 10, perSide: true }, restSeconds: 20 },
          { id: "circuit-pushups", name: "Push-ups", target: { type: "range", min: 10, max: 15 }, restSeconds: 20 },
          { id: "circuit-reverse-plank", name: "Reverse plank", target: { type: "time", seconds: 30 }, restSeconds: 20 },
          { id: "wall-sit", name: "Wall sit", target: { type: "time", seconds: 30 }, restSeconds: 20 },
          { id: "hollow-hold", name: "Hollow body hold", alternatives: ["Leg lifts"], target: { type: "time", seconds: 20 }, restSeconds: 60 }
        ] },
        { id: "cooldown", name: "Cooldown / Stretch", durationMinutes: 5, exercises: [
          { id: "deep-squat", name: "Deep squat hold", target: { type: "time", seconds: 45 } },
          { id: "forward-fold", name: "Forward fold", target: { type: "time", seconds: 30 } },
          { id: "child-pose", name: "Child's pose", target: { type: "time", seconds: 60 } },
          { id: "hip-flexor", name: "Hip flexor stretch", target: { type: "time", seconds: 30, perSide: true } }
        ] }
      ]
    },
    {
      id: "lower-body-core-2", name: "Lower Body + Core II", subtitle: "Hinge, lateral work, and balance", accent: "coral",
      sections: [
        { id: "warmup", name: "Warm-Up", durationMinutes: 5, exercises: [
          { id: "marching-knee-hugs", name: "Marching knee hugs", target: { type: "reps", reps: 10, perSide: true } },
          { id: "lateral-squat-shifts", name: "Lateral squat shifts", target: { type: "reps", reps: 8, perSide: true } },
          { id: "glute-bridge-warmup", name: "Glute bridges", target: { type: "reps", reps: 10 } },
          { id: "hip-hinges", name: "Bodyweight hip hinges", target: { type: "reps", reps: 10 } }
        ] },
        { id: "main", name: "Main Workout", durationMinutes: 20, exercises: [
          { id: "single-leg-rdl", name: "Single-leg Romanian deadlifts", sets: 3, target: { type: "reps", reps: 8, perSide: true }, restSeconds: 60 },
          { id: "reverse-lunge", name: "Reverse lunges", sets: 2, target: { type: "reps", reps: 10, perSide: true }, restSeconds: 60 },
          { id: "lateral-lunge", name: "Lateral lunges", sets: 2, target: { type: "reps", reps: 8, perSide: true }, restSeconds: 45 },
          { id: "hamstring-walkouts", name: "Hamstring walkouts", alternatives: ["Towel hamstring slides"], sets: 2, target: { type: "reps", reps: 6 }, restSeconds: 60 },
          { id: "single-leg-calf-raises", name: "Single-leg calf raises", sets: 2, target: { type: "reps", reps: 12, perSide: true }, restSeconds: 45 },
          { id: "dead-bug-2", name: "Dead bug", sets: 2, target: { type: "reps", reps: 10, perSide: true }, restSeconds: 45 }
        ] },
        { id: "cooldown", name: "Cooldown / Stretch", durationMinutes: 5, exercises: [
          { id: "hamstring-stretch", name: "Seated hamstring stretch", target: { type: "time", seconds: 30, perSide: true } },
          { id: "adductor-stretch", name: "Adductor stretch", target: { type: "time", seconds: 30, perSide: true } },
          { id: "figure-four", name: "Figure-four stretch", target: { type: "time", seconds: 30, perSide: true } }
        ] }
      ]
    },
    {
      id: "upper-body-core-2", name: "Upper Body + Core II", subtitle: "Back, arms, and shoulder stability", accent: "blue",
      sections: [
        { id: "warmup", name: "Warm-Up", durationMinutes: 5, exercises: [
          { id: "wall-slides", name: "Wall slides", target: { type: "reps", reps: 10 } },
          { id: "scapular-pushups", name: "Scapular push-ups", target: { type: "reps", reps: 10 } },
          { id: "thoracic-rotations", name: "Thoracic rotations", target: { type: "reps", reps: 8, perSide: true } }
        ] },
        { id: "main", name: "Main Workout", durationMinutes: 20, exercises: [
          { id: "close-grip-pushups", name: "Close-grip push-ups", alternatives: ["Knee close-grip push-ups"], sets: 3, target: { type: "range", min: 8, max: 12 }, restSeconds: 60 },
          { id: "prone-y-t", name: "Prone Y-T raises", sets: 3, target: { type: "reps", reps: 8 }, restSeconds: 45 },
          { id: "superman-pulldown", name: "Superman pull-downs", sets: 3, target: { type: "reps", reps: 10 }, restSeconds: 45 },
          { id: "triceps-extension", name: "Bodyweight triceps extensions", alternatives: ["Kneeling triceps extensions"], sets: 2, target: { type: "reps", reps: 8 }, restSeconds: 60 },
          { id: "bear-plank", name: "Bear plank hold", sets: 2, target: { type: "time", seconds: 30 }, restSeconds: 45 },
          { id: "bird-dog", name: "Bird-dog", sets: 2, target: { type: "reps", reps: 8, perSide: true }, restSeconds: 30 }
        ] },
        { id: "cooldown", name: "Cooldown / Stretch", durationMinutes: 5, exercises: [
          { id: "lat-stretch", name: "Lat stretch", target: { type: "time", seconds: 30, perSide: true } },
          { id: "triceps-stretch", name: "Overhead triceps stretch", target: { type: "time", seconds: 30, perSide: true } },
          { id: "thread-needle", name: "Thread-the-needle", target: { type: "reps", reps: 8, perSide: true } }
        ] }
      ]
    },
    {
      id: "mixed-under-25", name: "Full Body Express", subtitle: "Selective 23-minute session", accent: "gold",
      sections: [
        { id: "warmup", name: "Warm-Up", durationMinutes: 4, exercises: [
          { id: "marching-jacks", name: "Marching jacks", target: { type: "reps", reps: 20 } },
          { id: "squat-reach", name: "Squat to reach", target: { type: "reps", reps: 10 } },
          { id: "arm-swings", name: "Arm swings", target: { type: "reps", reps: 10, perSide: true } }
        ] },
        { id: "main", name: "Circuit", durationMinutes: 15, rounds: 3, exercises: [
          { id: "mixed-reverse-lunges", name: "Reverse lunges", target: { type: "time", seconds: 40 }, restSeconds: 20 },
          { id: "mixed-pushups", name: "Push-ups", alternatives: ["Knee push-ups"], target: { type: "time", seconds: 40 }, restSeconds: 20 },
          { id: "single-leg-bridge", name: "Single-leg glute bridges", target: { type: "time", seconds: 40 }, restSeconds: 20 },
          { id: "mixed-prone-y-t", name: "Prone Y-T raises", target: { type: "time", seconds: 40 }, restSeconds: 20 },
          { id: "mixed-dead-bug", name: "Dead bug", target: { type: "time", seconds: 40 }, restSeconds: 60 }
        ] },
        { id: "cooldown", name: "Cooldown / Stretch", durationMinutes: 4, exercises: [
          { id: "mixed-quad-stretch", name: "Standing quad stretch", target: { type: "time", seconds: 30, perSide: true } },
          { id: "mixed-chest-stretch", name: "Chest stretch", target: { type: "time", seconds: 30, perSide: true } }
        ] }
      ]
    }
  ]
};