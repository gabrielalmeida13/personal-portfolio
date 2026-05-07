"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

type SubmitState = "idle" | "loading" | "success" | "error";

export function Contact() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const sectionRef = useScrollReveal<HTMLElement>({
    selector: "[data-reveal]",
    stagger: 0.1,
    start: "top 82%",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    setSubmitState("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const body = (await res.json()) as { error?: string };

      if (!res.ok) {
        setErrorMessage(
          res.status === 429
            ? "Too many messages sent. Please try again later."
            : body.error ?? "Something went wrong. Please try again."
        );
        setSubmitState("error");
        return;
      }

      setSubmitState("success");
      reset();
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setSubmitState("error");
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24">
      <div className="mx-auto max-w-6xl px-4">

        {/* --- Header --- */}
        <div data-reveal className="mb-16">
          <p className="mb-2 font-mono text-xs tracking-widest uppercase text-primary">
            Contact
          </p>
          <h2 className="font-sans text-3xl font-bold tracking-tight sm:text-4xl">
            Get in touch
          </h2>
          <p className="mt-3 max-w-md text-base text-foreground-muted">
            Have a project in mind or just want to talk? Send a message and I will
            get back to you as soon as possible.
          </p>
        </div>

        {/* --- Form --- */}
        <div data-reveal className="max-w-xl">
          {submitState === "success" ? (
            <div className="rounded-lg border border-border bg-background-secondary p-6">
              <p className="font-sans text-base font-semibold text-foreground">
                Message sent.
              </p>
              <p className="mt-1 text-sm text-foreground-muted">
                Thanks for reaching out. I will reply as soon as I can.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setSubmitState("idle")}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-5"
            >
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  {...register("name", {
                    required: "Name is required.",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters.",
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address.",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="What would you like to discuss?"
                  rows={5}
                  aria-invalid={!!errors.message}
                  {...register("message", {
                    required: "Message is required.",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters.",
                    },
                  })}
                />
                {errors.message && (
                  <p className="text-xs text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* API-level error */}
              {submitState === "error" && (
                <p className="text-sm text-destructive">{errorMessage}</p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={submitState === "loading"}
                className="self-start"
              >
                {submitState === "loading" ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
