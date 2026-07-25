import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listWorkoutLogs from "./tools/list-workout-logs";
import logWorkout from "./tools/log-workout";
import deleteWorkoutLog from "./tools/delete-workout-log";
import trainingSummary from "./tools/training-summary";
import searchExerciseVideos from "./tools/search-exercise-videos";

// Issuer must be the direct Supabase host, built from the project ref that Vite
// inlines at build time (never from SUPABASE_URL, which may be a proxy host).
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "superhuman-tlc-mcp",
  title: "SUPERHUMAN by TLC",
  version: "0.1.0",
  instructions:
    "Tools for the SUPERHUMAN hybrid-athlete training app by TLC. Use `training_summary` for an overview of the athlete's recent training, `list_workout_logs` to read logged sets, `log_workout` to record a new set, `delete_workout_log` to remove an entry, and `search_exercise_videos` to find tutorial videos in the app's library. All tools act as the signed-in athlete.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [trainingSummary, listWorkoutLogs, logWorkout, deleteWorkoutLog, searchExerciseVideos],
});
