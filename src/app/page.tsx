"use client";

import Button from "@verbs/components/Button";
import InputInfo from "@verbs/components/InputInfo";
import useIrregularVerbs from "@verbs/hooks/useIrregularVerbs";
import { Controller } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export default function Home() {
  const {
    showNextButton,
    showPreviewButton,
    control,
    handleNextVerb,
    handlePreviewVerb,
  } = useIrregularVerbs();

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-10 w-full">
      <Controller
        control={control}
        name="verb"
        render={({ field }) => (
          <InputInfo placeholder="Verb" subtitle="Verb" readOnly {...field} />
        )}
      />

      <Controller
        control={control}
        name="infinitive"
        render={({ field, fieldState }) => (
          <InputInfo
            placeholder="Infinitive"
            subtitle="Infinitive"
            error={fieldState?.error?.message}
            valid={!fieldState?.invalid}
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="simplePast"
        render={({ field, fieldState }) => (
          <InputInfo
            placeholder="Simple past"
            subtitle="Simple past"
            error={fieldState?.error?.message}
            {...field}
          />
        )}
      />

      <Controller
        control={control}
        name="pastParticiple"
        render={({ field, fieldState }) => (
          <InputInfo
            placeholder="Past participle"
            subtitle="Past participle"
            error={fieldState?.error?.message}
            {...field}
          />
        )}
      />
      <div className={twMerge("flex flex-col gap-[8px] w-full")}>
        {showNextButton && (
          <Button text="Next" btn="primary" onClick={handleNextVerb} />
        )}
        {showPreviewButton && (
          <Button text="Preview" btn="secondary" onClick={handlePreviewVerb} />
        )}
      </div>
    </main>
  );
}
