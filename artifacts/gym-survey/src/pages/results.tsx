import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, HeartPulse, Quote, Target, Flame } from "lucide-react";
import {
  SurveySubmissionGymFrequency,
  SurveySubmissionFitnessGoal,
  SurveySubmissionMotivationsItem,
} from "@workspace/api-zod";

type SurveyData = {
  gym_frequency: string;
  fitness_goal: string;
  motivations: string[];
};

export default function ResultsPage() {
  const [, setLocation] = useLocation();
  const [data, setData] = useState<SurveyData | null>(null);

  useEffect(() => {
    const state = history.state as SurveyData | undefined;
    if (state && state.gym_frequency) {
      setData(state);
    } else {
      const stored = sessionStorage.getItem("survey_results");
      if (stored) {
        try {
          setData(JSON.parse(stored) as SurveyData);
        } catch {
          setLocation("/");
        }
      }
    }
  }, [setLocation]);

  if (!data) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background px-4">
        <div className="text-center space-y-6 fade-in duration-500 animate-in">
          <HeartPulse className="w-16 h-16 mx-auto text-primary/50" />
          <div className="space-y-2">
            <h1 className="text-2xl font-medium text-foreground">No Survey Data Found</h1>
            <p className="text-muted-foreground max-w-sm mx-auto">
              It looks like you haven't taken the survey yet, or you refreshed the page.
            </p>
          </div>
          <Button onClick={() => setLocation("/")} size="lg" className="rounded-xl h-12" data-testid="button-take-survey">
            Take the Survey
          </Button>
        </div>
      </div>
    );
  }

  const getFrequencyFeedback = (frequency: string) => {
    switch (frequency) {
      case SurveySubmissionGymFrequency.Daily:
        return "You're already showing incredible dedication — consistency at this level is rare and builds real, lasting results.";
      case SurveySubmissionGymFrequency["3-5_times_per_week"]:
        return "Going to the gym 3–5 times a week puts you ahead of most. Keep showing up — it adds up faster than you think.";
      case SurveySubmissionGymFrequency["1-2_times_per_week"]:
        return "Starting with 1–2 sessions a week is a solid foundation. Even small steps compound over time — don't underestimate your progress.";
      case SurveySubmissionGymFrequency.Rarely:
        return "Getting back on track is easier than you think. One session at a time is all it takes to rebuild momentum.";
      case SurveySubmissionGymFrequency.Never:
        return "Every journey starts somewhere. Even a 10-minute walk counts — the hardest step is always the first one.";
      default:
        return "Your relationship with the gym is yours to define.";
    }
  };

  const getGoalFeedback = (goal: string) => {
    switch (goal) {
      case SurveySubmissionFitnessGoal.Build_muscle:
        return "Strength building is a long game — trust the process and celebrate every rep you add to the bar.";
      case SurveySubmissionFitnessGoal.Lose_weight:
        return "Sustainable weight loss is about habits, not perfection. You're building something that will last.";
      case SurveySubmissionFitnessGoal.Improve_endurance:
        return "Endurance training builds mental toughness as much as physical — keep pushing past what you think you can do.";
      case SurveySubmissionFitnessGoal.Stay_healthy:
        return "Prioritizing your health is one of the best investments you can make — you're already thinking ahead.";
      case SurveySubmissionFitnessGoal.Other:
      default:
        return "Your fitness journey is uniquely yours — and that's exactly how it should be.";
    }
  };

  const getMotivationFeedback = (motivations: string[]) => {
    if (motivations.includes(SurveySubmissionMotivationsItem.Mental_health)) {
      return "It's clear you understand the powerful link between physical movement and mental wellbeing — keep honoring both.";
    }
    if (motivations.includes(SurveySubmissionMotivationsItem["Routine/habit"])) {
      return "Habit-driven fitness is one of the most powerful approaches — it becomes automatic, not a chore.";
    }
    if (motivations.includes(SurveySubmissionMotivationsItem.Athletic_performance)) {
      return "Training for performance gives you a concrete target — that clarity is a superpower in your consistency.";
    }
    return "Your motivations are your fuel — keep connecting back to your why on tough days.";
  };

  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col pt-16 pb-24 px-4 sm:px-6">
      <div className="w-full max-w-3xl mx-auto space-y-12">
        <header className="text-center space-y-6 fade-in slide-in-from-bottom-4 duration-500 animate-in">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground" data-testid="heading-results">
            Thank you for sharing
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed" data-testid="text-results-intro">
            We've reviewed your reflections. Here are a few thoughts tailored to where you are on your journey right now.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 fade-in slide-in-from-bottom-8 duration-700 delay-150 animate-in fill-mode-both">
          {/* Consistency Card */}
          <Card className="p-6 md:p-8 flex flex-col space-y-4 border-none shadow-xl shadow-black/5 bg-white rounded-2xl" data-testid="card-feedback-frequency">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Quote className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium text-lg text-foreground">On Consistency</h3>
            <p className="text-muted-foreground leading-relaxed text-base">
              {getFrequencyFeedback(data.gym_frequency)}
            </p>
          </Card>

          {/* Goal Card */}
          <Card className="p-6 md:p-8 flex flex-col space-y-4 border-none shadow-xl shadow-black/5 bg-white rounded-2xl md:-translate-y-4" data-testid="card-feedback-goal">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium text-lg text-foreground">On Your Goal</h3>
            <p className="text-muted-foreground leading-relaxed text-base">
              {getGoalFeedback(data.fitness_goal)}
            </p>
          </Card>

          {/* Motivation Card */}
          <Card className="p-6 md:p-8 flex flex-col space-y-4 border-none shadow-xl shadow-black/5 bg-white rounded-2xl" data-testid="card-feedback-motivation">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium text-lg text-foreground">On Your Drive</h3>
            <p className="text-muted-foreground leading-relaxed text-base">
              {getMotivationFeedback(data.motivations)}
            </p>
          </Card>
        </div>

        <div className="pt-12 text-center fade-in duration-700 delay-300 animate-in fill-mode-both">
          <Button 
            variant="outline" 
            size="lg"
            className="rounded-xl h-14 px-8 text-base border-border hover:bg-muted/50"
            onClick={() => setLocation("/")}
            data-testid="button-retake-survey"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retake Survey
          </Button>
        </div>
      </div>
    </div>
  );
}
