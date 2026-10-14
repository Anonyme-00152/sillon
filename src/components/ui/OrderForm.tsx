"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { getColorway } from "@/lib/colorways";
import { SITE } from "@/lib/site";
import { useSite } from "@/lib/store";
import ColorwayPicker from "./ColorwayPicker";

// Formulaire de démonstration : tout reste dans le navigateur, rien n'est envoyé.
export default function OrderForm() {
  const id = useId();
  const colorway = useSite((s) => s.colorway);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const status = useRef<HTMLParagraphElement>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const el = input.current;
    if (!el) return;
    if (!el.value.trim()) {
      setError("Indiquez une adresse e-mail.");
      el.focus();
      return;
    }
    if (!el.validity.valid) {
      setError("Cette adresse e-mail ne semble pas valide.");
      el.focus();
      return;
    }
    setError("");
    setDone(true);
    requestAnimationFrame(() => status.current?.focus());
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6">
        <p ref={status} tabIndex={-1} role="status" className="title text-4xl outline-none">
          C&apos;est noté.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Sillon 01 en {getColorway(colorway).name.toLowerCase()} vous attend. Petit rappel : Sillon est une marque
          fictive, aucune donnée n&apos;a été envoyée.
        </p>
        <button type="button" className="btn btn-ghost btn-sm mt-6" onClick={() => setDone(false)}>
          Recommencer
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-8">
      <ColorwayPicker name="teinte-precommande" />

      <div className="flex items-baseline justify-between border-y border-line py-4">
        <span>
          <span className="block font-semibold">{SITE.product}</span>
          <span className="text-sm text-muted">{SITE.shipping} · Livraison offerte</span>
        </span>
        <span className="title text-4xl">{SITE.price}</span>
      </div>

      <div>
        <label htmlFor={`${id}-email`} className="mb-2 block text-sm font-medium">
          Adresse e-mail
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            ref={input}
            id={`${id}-email`}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="vous@exemple.fr"
            aria-invalid={error ? true : undefined}
            aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
            className="h-12 min-w-0 flex-1 rounded-full border border-line-strong bg-transparent px-5 placeholder:text-muted/70 focus-visible:border-fg aria-invalid:border-accent"
          />
          <button type="submit" className="btn btn-primary">
            Rejoindre la liste <span className="arrow" aria-hidden="true">→</span>
          </button>
        </div>
        {error && (
          <p id={`${id}-error`} className="mt-2 text-sm text-accent">
            {error}
          </p>
        )}
        <p id={`${id}-hint`} className="mt-3 text-xs text-muted">
          Démo de portfolio : rien n&apos;est envoyé ni conservé. Aucun paiement.
        </p>
      </div>
    </form>
  );
}
