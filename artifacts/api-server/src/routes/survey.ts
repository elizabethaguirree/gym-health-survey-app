import { Router, type IRouter } from "express";
import { z } from "zod";
import { supabase } from "../lib/supabase";

const router: IRouter = Router();

const SurveySubmissionSchema = z.object({
  gym_frequency: z.enum(["Daily", "3-5 times per week", "1-2 times per week", "Rarely", "Never"]),
  fitness_goal: z.enum(["Build muscle", "Lose weight", "Improve endurance", "Stay healthy", "Other"]),
  workout_types: z.array(
    z.enum(["Weightlifting", "Cardio", "Classes (yoga, pilates, etc.)", "Sports", "None"])
  ).min(1),
  diet_rating: z.enum(["Very healthy", "Somewhat healthy", "Neutral", "Somewhat unhealthy", "Very unhealthy"]),
  motivations: z.array(
    z.enum(["Physical appearance", "Mental health", "Social reasons", "Routine/habit", "Athletic performance"])
  ).min(1),
  biggest_challenge: z.string().min(1),
  current_goal: z.string().min(1),
});

router.post("/survey", async (req, res) => {
  const parseResult = SurveySubmissionSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({ error: parseResult.error.message });
    return;
  }

  const data = parseResult.data;

  const { data: inserted, error } = await supabase
    .from("survey_responses")
    .insert({
      gym_frequency: data.gym_frequency,
      fitness_goal: data.fitness_goal,
      workout_types: data.workout_types,
      diet_rating: data.diet_rating,
      motivations: data.motivations,
      biggest_challenge: data.biggest_challenge,
      current_goal: data.current_goal,
    })
    .select("id, created_at")
    .single();

  if (error) {
    req.log.error({ error }, "Failed to insert survey response");
    res.status(500).json({ error: "Failed to save survey response" });
    return;
  }

  res.status(201).json({
    id: String(inserted.id),
    created_at: String(inserted.created_at),
  });
});

export default router;
