import { useEffect, useState } from "react";

export default function WorkoutTracker() {
  const [selectedDay, setSelectedDay] = useState("day1");

  // Timer State
  const [timer, setTimer] = useState(60);
  const [isTiming, setIsTiming] = useState(false);
  const [restInterval, setRestInterval] = useState(60);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    let interval;
    if (isTiming && timer > 0) {
      setShowOverlay(true);
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (isTiming && timer === 0) {
      clearInterval(interval);
      setIsTiming(false);
      setShowOverlay(false);
      playBeep();
    }
    return () => clearInterval(interval);
  }, [isTiming, timer]);

  const playBeep = () => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const context = new (window.AudioContext ||
          window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(1000, context.currentTime);
        oscillator.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.2);
      }, i * 500);
    }
  };

  const startTimer = () => {
    setTimer(restInterval);
    setIsTiming(true);
  };

  const resetTimer = () => {
    setTimer(restInterval);
    setIsTiming(false);
    setShowOverlay(false);
  };

  const toggleRestInterval = () => {
    const newInterval = restInterval === 60 ? 90 : 60;
    setRestInterval(newInterval);
    setTimer(newInterval);
  };

  // Workout State
  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem("workouts");
    return saved
      ? JSON.parse(saved)
      : {
          day1: {
            label: "Legs (Strength)",
            date: new Date().toISOString().split("T")[0],
            exercises: [
              {
                name: "Barbell Back Squat - 5 sets x 5 reps",
                sets: 5,
                reps: 5,
                weight: "",
              },
              {
                name: "Romanian Deadlift - 4 sets x 6-8 reps",
                sets: 4,
                reps: 6,
                weight: "",
              },
            ],
          },
          day2: {
            label: "Chest (Hypertrophy)",
            date: new Date().toISOString().split("T")[0],
            exercises: [
              {
                name: "Bench Press - 4 sets x 8 reps",
                sets: 4,
                reps: 8,
                weight: "",
              },
              {
                name: "Incline Dumbbell Press - 3 sets x 10 reps",
                sets: 3,
                reps: 10,
                weight: "",
              },
            ],
          },
          day3: {
            label: "Back & Biceps",
            date: new Date().toISOString().split("T")[0],
            exercises: [
              {
                name: "Pull-Ups - 3 sets to failure",
                sets: 3,
                reps: 10,
                weight: "",
              },
            ],
          },
          day4: {
            label: "Glutes & Hamstrings",
            date: new Date().toISOString().split("T")[0],
            exercises: [
              {
                name: "Hip Thrusts - 4 sets x 12 reps",
                sets: 4,
                reps: 12,
                weight: "",
              },
            ],
          },
          day5: {
            label: "Shoulders & Arms",
            date: new Date().toISOString().split("T")[0],
            exercises: [
              {
                name: "Overhead Press - 3 sets x 10 reps",
                sets: 3,
                reps: 10,
                weight: "",
              },
            ],
          },
          notes: {
            label: "Progressive Overload Plan",
            exercises: [
              { name: "Week 1: Start moderate weight, focus on form." },
              { name: "Week 2: Increase weight by 2.5-5% on main lifts." },
            ],
          },
        };
  });

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  const handleInputChange = (day, index, field, value) => {
    const updatedExercises = [...workouts[day].exercises];
    updatedExercises[index][field] = value;
    setWorkouts({
      ...workouts,
      [day]: { ...workouts[day], exercises: updatedExercises },
    });
  };

  const handleDateChange = (day, value) => {
    setWorkouts({ ...workouts, [day]: { ...workouts[day], date: value } });
  };

  const handleAddExercise = (day) => {
    const newExercise = { name: "", sets: "", reps: "", weight: "" };
    setWorkouts({
      ...workouts,
      [day]: {
        ...workouts[day],
        exercises: [...workouts[day].exercises, newExercise],
      },
    });
  };

  const handleDeleteExercise = (day, index) => {
    const updatedExercises = workouts[day].exercises.filter(
      (_, idx) => idx !== index
    );
    setWorkouts({
      ...workouts,
      [day]: { ...workouts[day], exercises: updatedExercises },
    });
  };

  return (
    <div
      style={{
        padding: "1rem",
        fontSize: "12px",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        minHeight: "100vh",
        overflowY: "auto",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Timer Overlay */}
      {showOverlay && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "48px",
              fontWeight: "bold",
            }}
          >
            {timer}s
          </div>
        </div>
      )}

      {/* Top Controls */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ fontSize: "18px", marginBottom: "1rem" }}>
          Randy's Workout ({workouts[selectedDay]?.exercises.length ?? 0}{" "}
          Exercises)
        </h1>

        <div style={{ textAlign: "right", minWidth: "150px" }}>
          <div>
            <strong>Timer: {timer}s</strong>
            <button onClick={startTimer} style={{ marginLeft: "4px" }}>
              {isTiming ? "Pause" : "Start"}
            </button>
            <button onClick={resetTimer} style={{ marginLeft: "4px" }}>
              Reset
            </button>
            <button onClick={toggleRestInterval} style={{ marginLeft: "4px" }}>
              Rest: {restInterval}s
            </button>
          </div>
          {selectedDay !== "notes" && (
            <div style={{ marginTop: "0.5rem" }}>
              <label>Date: </label>
              <input
                type="date"
                value={workouts[selectedDay]?.date ?? ""}
                onChange={(e) => handleDateChange(selectedDay, e.target.value)}
                style={{ fontSize: "12px", padding: "4px", width: "100%" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Day Buttons */}
      <div style={{ marginBottom: "1rem" }}>
        {Object.entries(workouts).map(([day, data]) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
              marginBottom: "0.5rem",
              backgroundColor: selectedDay === day ? "#007bff" : "#ccc",
              color: selectedDay === day ? "#fff" : "#000",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            {data.label}
          </button>
        ))}
      </div>

      {/* Exercises */}
      {workouts[selectedDay]?.exercises.map((exercise, idx) => (
        <div key={idx} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Exercise Name"
            value={exercise.name}
            onChange={(e) =>
              handleInputChange(selectedDay, idx, "name", e.target.value)
            }
            style={{
              fontSize: "12px",
              padding: "4px",
              marginBottom: "4px",
              width: "100%",
            }}
          />
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <input
              type="number"
              placeholder="Sets"
              value={exercise.sets}
              onChange={(e) =>
                handleInputChange(selectedDay, idx, "sets", e.target.value)
              }
              style={{ fontSize: "12px", padding: "4px", flex: 1 }}
            />
            <input
              type="number"
              placeholder="Reps"
              value={exercise.reps}
              onChange={(e) =>
                handleInputChange(selectedDay, idx, "reps", e.target.value)
              }
              style={{ fontSize: "12px", padding: "4px", flex: 1 }}
            />
            <input
              type="text"
              placeholder="Weight"
              value={exercise.weight}
              onChange={(e) =>
                handleInputChange(selectedDay, idx, "weight", e.target.value)
              }
              style={{ fontSize: "12px", padding: "4px", flex: 1 }}
            />
            <button
              onClick={() => handleDeleteExercise(selectedDay, idx)}
              style={{
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                padding: "4px 8px",
                fontSize: "12px",
                borderRadius: "4px",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Summary */}
      {selectedDay !== "notes" &&
        workouts[selectedDay]?.exercises.length > 0 && (
          <div
            style={{
              marginTop: "2rem",
              borderTop: "1px solid #ccc",
              paddingTop: "1rem",
            }}
          >
            <h3 style={{ fontSize: "14px", marginBottom: "0.5rem" }}>
              Workout Summary:
            </h3>
            <p style={{ fontSize: "12px", margin: "4px 0" }}>
              Total Sets:{" "}
              {workouts[selectedDay].exercises.reduce(
                (sum, ex) => sum + (parseInt(ex.sets) || 0),
                0
              )}
            </p>
            <p style={{ fontSize: "12px", margin: "4px 0" }}>
              Total Reps:{" "}
              {workouts[selectedDay].exercises.reduce(
                (sum, ex) =>
                  sum + (parseInt(ex.sets) || 0) * (parseInt(ex.reps) || 0),
                0
              )}
            </p>
            <p style={{ fontSize: "12px", margin: "4px 0" }}>
              Total Volume:{" "}
              {workouts[selectedDay].exercises
                .reduce(
                  (sum, ex) =>
                    sum +
                    (parseInt(ex.sets) || 0) *
                      (parseInt(ex.reps) || 0) *
                      (parseFloat(ex.weight) || 0),
                  0
                )
                .toLocaleString()}{" "}
              lbs
            </p>
          </div>
        )}

      {/* Add Exercise */}
      {selectedDay !== "notes" && (
        <button
          onClick={() => handleAddExercise(selectedDay)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "12px",
            marginTop: "1rem",
          }}
        >
          Add Exercise
        </button>
      )}
    </div>
  );
}
