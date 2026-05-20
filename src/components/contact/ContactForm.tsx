"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/shared/Button";
import { validateContactForm, hasErrors } from "@/lib/validation";
import type { ContactFormData, ContactFormResponse } from "@/lib/types";

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    organisation: "",
    role: "",
    email: "",
    phone: "",
    message: "",
    _honeypot: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name } = e.target;
    const fieldErrors = validateContactForm(formData);
    if (fieldErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError("");

    const validationErrors = validateContactForm(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setFormState("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data: ContactFormResponse = await res.json();

      if (data.success) {
        setFormState("success");
      } else {
        setFormState("error");
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setServerError(data.message || "Something went wrong. Please try again.");
        }
      }
    } catch {
      setFormState("error");
      setServerError("Unable to send message. Please try again later.");
    }
  }

  if (formState === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 font-heading text-lg font-semibold text-green-800">
          Message Sent
        </h3>
        <p className="mt-2 text-sm text-green-700">
          Thank you for your enquiry. We will be in touch within one business day.
        </p>
        <button
          type="button"
          onClick={() => {
            setFormState("idle");
            setFormData({
              name: "",
              organisation: "",
              role: "",
              email: "",
              phone: "",
              message: "",
              _honeypot: "",
            });
            setErrors({});
          }}
          className="mt-4 text-sm font-medium text-green-700 underline hover:text-green-900"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-deep-blue focus:outline-none focus:ring-2 focus:ring-deep-blue/20"
          placeholder="Your full name"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="organisation" className="block text-sm font-medium text-slate-700">
          Organisation <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="organisation"
          name="organisation"
          required
          value={formData.organisation}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-deep-blue focus:outline-none focus:ring-2 focus:ring-deep-blue/20"
          placeholder="Your RTO or organisation name"
        />
        {errors.organisation && (
          <p className="mt-1 text-xs text-red-600">{errors.organisation}</p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-slate-700">
          Role <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="role"
          name="role"
          required
          value={formData.role}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-deep-blue focus:outline-none focus:ring-2 focus:ring-deep-blue/20"
          placeholder="Your job title"
        />
        {errors.role && (
          <p className="mt-1 text-xs text-red-600">{errors.role}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-deep-blue focus:outline-none focus:ring-2 focus:ring-deep-blue/20"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
          Phone <span className="text-slate-400">(optional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-deep-blue focus:outline-none focus:ring-2 focus:ring-deep-blue/20"
          placeholder="04XX XXX XXX"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-deep-blue focus:outline-none focus:ring-2 focus:ring-deep-blue/20"
          placeholder="Tell us about your needs, or request a free sample..."
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-600">{errors.message}</p>
        )}
      </div>

      {/* Honeypot - hidden from real users */}
      <div
        aria-hidden="true"
        style={{ opacity: 0, position: "absolute", pointerEvents: "none" }}
      >
        <input
          type="text"
          name="_honeypot"
          tabIndex={-1}
          autoComplete="off"
          value={formData._honeypot}
          onChange={handleChange}
        />
      </div>

      <Button
        type="submit"
        disabled={formState === "submitting"}
        className="w-full"
      >
        {formState === "submitting" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
