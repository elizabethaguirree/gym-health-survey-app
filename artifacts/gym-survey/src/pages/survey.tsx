import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  SurveySubmissionGymFrequency,
  SurveySubmissionFitnessGoal,
  SurveySubmissionWorkoutTypesItem,
  SurveySubmissionDietRating,
  SurveySubmissionMotivationsItem,
} from "@workspace/api-zod";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const surveySchema = z.object({
  gym_frequency: z.nativeEnum(SurveySubmissionGymFrequency, {
    required_error: "Please select how often you go to the gym.",
  }),
  fitness_goal: z.nativeEnum(SurveySubmissionFitnessGoal, {
    required_error: "Please select a primary fitness goal.",
  }),
  workout_types: z
    .array(z.nativeEnum(SurveySubmissionWorkoutTypesItem))
    .min(1, "Please select at least one workout type."),
  diet_rating: z.nativeEnum(SurveySubmissionDietRating, {
    required_error: "Please rate your diet.",
  }),
  motivations: z
    .array(z.nativeEnum(SurveySubmissionMotivationsItem))
    .min(1, "Please select at least one motivation."),
  biggest_challenge: z.string().min(1, "Please describe your biggest challenge."),
  current_goal: z.string().min(1, "Please enter your current health/fitness goal."),
});

type SurveyFormValues = z.infer<typeof surveySchema>;

export default function SurveyPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const submitSurvey = useMutation({
    mutationFn: async (data: SurveyFormValues) => {
      const { error } = await supabase.from("survey_responses").insert(data);
      if (error) throw error;
    },
  });

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      workout_types: [],
      motivations: [],
      biggest_challenge: "",
      current_goal: "",
    },
  });

  const onSubmit = (data: SurveyFormValues) => {
    submitSurvey.mutate(
      data,
      {
        onSuccess: () => {
          sessionStorage.setItem("survey_results", JSON.stringify(data));
          setLocation("/results", { state: data });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Failed to submit the survey. Please try again.",
          });
        },
      }
    );
  };

  const isPending = submitSurvey.isPending;

  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col pt-12 pb-24 px-4 sm:px-6">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <header className="text-center space-y-4 fade-in slide-in-from-bottom-4 duration-500 animate-in">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground" data-testid="heading-survey">
            Health & Habits
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto" data-testid="text-survey-description">
            Take a few minutes to reflect on your physical wellbeing, routines, and what drives you.
          </p>
        </header>

        <Card className="p-6 sm:p-10 border-none shadow-xl shadow-black/5 rounded-2xl fade-in slide-in-from-bottom-8 duration-700 delay-150 animate-in fill-mode-both">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
              {/* Q1: Gym Frequency */}
              <FormField
                control={form.control}
                name="gym_frequency"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <div className="space-y-1">
                      <FormLabel className="text-lg font-medium">1. How often do you go to the gym?</FormLabel>
                    </div>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid sm:grid-cols-2 gap-3"
                        data-testid="radiogroup-gym-frequency"
                      >
                        {Object.entries(SurveySubmissionGymFrequency).map(([key, value]) => (
                          <FormItem key={key} className="flex items-center space-x-3 space-y-0 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                            <FormControl>
                              <RadioGroupItem value={value} data-testid={`radio-frequency-${key}`} />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer w-full text-base">{value}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Q2: Primary Fitness Goal */}
              <FormField
                control={form.control}
                name="fitness_goal"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <div className="space-y-1">
                      <FormLabel className="text-lg font-medium">2. What is your primary fitness goal?</FormLabel>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-14 text-base rounded-xl" data-testid="select-fitness-goal">
                          <SelectValue placeholder="Select a goal..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        {Object.entries(SurveySubmissionFitnessGoal).map(([key, value]) => (
                          <SelectItem key={key} value={value} className="text-base py-3" data-testid={`select-item-goal-${key}`}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Q3: Workout Types */}
              <FormField
                control={form.control}
                name="workout_types"
                render={() => (
                  <FormItem className="space-y-4">
                    <div className="space-y-1">
                      <FormLabel className="text-lg font-medium">3. What types of workouts do you typically do?</FormLabel>
                      <FormDescription className="text-sm">Select all that apply.</FormDescription>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {Object.entries(SurveySubmissionWorkoutTypesItem).map(([key, value]) => (
                        <FormField
                          key={key}
                          control={form.control}
                          name="workout_types"
                          render={({ field }) => {
                            return (
                              <FormItem
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, value])
                                        : field.onChange(
                                            field.value?.filter(
                                              (val) => val !== value
                                            )
                                          )
                                    }}
                                    data-testid={`checkbox-workout-${key}`}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer w-full text-base">
                                  {value}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Q4: Diet Rating */}
              <FormField
                control={form.control}
                name="diet_rating"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <div className="space-y-1">
                      <FormLabel className="text-lg font-medium">4. How would you rate your overall diet?</FormLabel>
                    </div>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col gap-3"
                        data-testid="radiogroup-diet"
                      >
                        {Object.entries(SurveySubmissionDietRating).map(([key, value]) => (
                          <FormItem key={key} className="flex items-center space-x-3 space-y-0 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                            <FormControl>
                              <RadioGroupItem value={value} data-testid={`radio-diet-${key}`} />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer w-full text-base">{value}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Q5: Motivations */}
              <FormField
                control={form.control}
                name="motivations"
                render={() => (
                  <FormItem className="space-y-4">
                    <div className="space-y-1">
                      <FormLabel className="text-lg font-medium">5. What motivates you to stay active?</FormLabel>
                      <FormDescription className="text-sm">Select all that apply.</FormDescription>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {Object.entries(SurveySubmissionMotivationsItem).map(([key, value]) => (
                        <FormField
                          key={key}
                          control={form.control}
                          name="motivations"
                          render={({ field }) => {
                            return (
                              <FormItem
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, value])
                                        : field.onChange(
                                            field.value?.filter(
                                              (val) => val !== value
                                            )
                                          )
                                    }}
                                    data-testid={`checkbox-motivation-${key}`}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer w-full text-base">
                                  {value}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Q6: Biggest Challenge */}
              <FormField
                control={form.control}
                name="biggest_challenge"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <div className="space-y-1">
                      <FormLabel className="text-lg font-medium">6. What is your biggest challenge when it comes to staying consistent with your health or fitness?</FormLabel>
                    </div>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Finding time after work, staying motivated in winter..." 
                        className="h-14 text-base rounded-xl"
                        data-testid="input-challenge"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Q7: Current Goal */}
              <FormField
                control={form.control}
                name="current_goal"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <div className="space-y-1">
                      <FormLabel className="text-lg font-medium">7. What is one health or fitness goal you are currently working toward?</FormLabel>
                    </div>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Running a 5k, sleeping 8 hours a night..." 
                        className="h-14 text-base rounded-xl"
                        data-testid="input-current-goal"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg rounded-xl transition-all" 
                  disabled={isPending}
                  data-testid="button-submit-survey"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Reflections
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
