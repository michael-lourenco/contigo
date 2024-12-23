"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Form validation schema
const formSchema = z.object({
  playerEntries: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(2, "Name must be at least 2 characters"),
        score: z.number().min(0, "Score must be a positive number"),
        date: z.string(),
      })
    )
    .min(1, "At least one player entry is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateLeaderboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerEntries: [
        {
          id: crypto.randomUUID(),
          name: "",
          score: 0,
          date: new Date().toISOString(),
        },
      ],
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true);

      const response = await axios.post("/api/createLeaderboard", {
        leaderboard: data.playerEntries,
      });

      toast({
        title: "Success",
        description: "Leaderboard created successfully!",
      });

      router.push("/gameplay"); // or wherever you want to redirect after success
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create leaderboard. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating leaderboard:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const addPlayer = () => {
    const currentEntries = form.getValues("playerEntries");
    form.setValue("playerEntries", [
      ...currentEntries,
      {
        id: crypto.randomUUID(),
        name: "",
        score: 0,
        date: new Date().toISOString(),
      },
    ]);
  };

  const removePlayer = (index: number) => {
    const currentEntries = form.getValues("playerEntries");
    if (currentEntries.length > 1) {
      form.setValue(
        "playerEntries",
        currentEntries.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create New Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {form.watch("playerEntries").map((entry, index) => (
                <div key={entry.id} className="flex gap-4 items-end">
                  <FormField
                    control={form.control}
                    name={`playerEntries.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Player Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter player name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`playerEntries.${index}.score`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Score</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter score"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removePlayer(index)}
                    className="mb-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPlayer}
                  className="w-full"
                >
                  Add Player
                </Button>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Leaderboard"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
