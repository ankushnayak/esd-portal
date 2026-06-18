"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { registerAlumniAction } from "@/actions/auth";
import { expertCompletionYears, institutionOptions, professionOptions } from "@/lib/alumni-registration";
import { registerSchema } from "@/lib/validation/auth";

type RegisterValues = z.input<typeof registerSchema>;

type CountryOption = {
  isoCode: string;
  name: string;
};

type StateOption = {
  isoCode: string;
  name: string;
};

const fieldClassName =
  "w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:bg-white";

async function fetchLocationOptions<T>(path: string) {
  const response = await fetch(path, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Unable to load location options.");
  }

  const payload = (await response.json()) as { options: T[] };
  return payload.options;
}

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<RegisterValues>({
    defaultValues: {
      phone: "",
      countryIso: "IN",
      stateCode: "",
      professionOption: undefined,
    },
  });

  const selectedCountryIso = useWatch({ control, name: "countryIso" });
  const selectedStateCode = useWatch({ control, name: "stateCode" });
  const selectedProfession = useWatch({ control, name: "professionOption" });

  useEffect(() => {
    let ignore = false;

    fetchLocationOptions<CountryOption>("/api/locations?type=countries")
      .then((options) => {
        if (ignore) return;
        setCountries(options);
      })
      .catch(() => {
        if (!ignore) {
          toast.error("We couldn't load the country list. Please refresh and try again.");
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedCountryIso) return;

    let ignore = false;

    fetchLocationOptions<StateOption>(`/api/locations?type=states&country=${selectedCountryIso}`)
      .then((options) => {
        if (ignore) return;

        setStates(options);
        setLoadingStates(false);

        if (!options.some((item) => item.isoCode === getValues("stateCode"))) {
          setValue("stateCode", "", { shouldDirty: true });
          setValue("city", "", { shouldDirty: true });
          setCities([]);
        }
      })
      .catch(() => {
        if (!ignore) {
          setLoadingStates(false);
          setStates([]);
          setCities([]);
          toast.error("We couldn't load the state list. Please try again.");
        }
      });

    return () => {
      ignore = true;
    };
  }, [getValues, selectedCountryIso, setValue]);

  useEffect(() => {
    if (!selectedCountryIso || !selectedStateCode) return;

    let ignore = false;

    fetchLocationOptions<string>(`/api/locations?type=cities&country=${selectedCountryIso}&state=${selectedStateCode}`)
      .then((options) => {
        if (ignore) return;
        setCities(options);
        setLoadingCities(false);

        if (getValues("city") && !options.includes(getValues("city"))) {
          setValue("city", "", { shouldDirty: true });
        }
      })
      .catch(() => {
        if (!ignore) {
          setLoadingCities(false);
          setCities([]);
          toast.error("We couldn't load the city list. Please try again.");
        }
      });

    return () => {
      ignore = true;
    };
  }, [getValues, selectedCountryIso, selectedStateCode, setValue]);

  const onSubmit = handleSubmit((values) => {
    const parsed = registerSchema.safeParse(values);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please review your form.");
      return;
    }

    startTransition(async () => {
      const result = await registerAlumniAction(parsed.data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      reset({
        phone: "",
        countryIso: "IN",
        stateCode: "",
        city: "",
        professionOption: undefined,
      });
      setLoadingStates(true);
      setLoadingCities(false);
      setStates([]);
      setCities([]);
      toast.success(result.message);
      router.push("/login");
    });
  });

  return (
    <form onSubmit={onSubmit} className="surface-card grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
      <div className="sm:col-span-2">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Registration details</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Set up your verified alumni profile</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Clear and complete profile details help reviewers verify accounts faster and keep the platform easy to search,
          report on, and manage.
        </p>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="name">
          Full name
        </label>
        <input id="name" autoComplete="name" placeholder="Enter your full name" className={fieldClassName} {...register("name")} />
        {errors.name ? <p className="mt-2 text-sm text-rose-600">{errors.name.message}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input id="email" type="email" autoComplete="email" placeholder="name@example.com" className={fieldClassName} {...register("email")} />
        {errors.email ? <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a secure password"
          className={fieldClassName}
          {...register("password")}
        />
        {errors.password ? <p className="mt-2 text-sm text-rose-600">{errors.password.message}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          className={fieldClassName}
          {...register("confirmPassword")}
        />
        <p className="mt-2 text-xs text-slate-500">This helps prevent typo-based lockouts during sign-up.</p>
        {errors.confirmPassword ? <p className="mt-2 text-sm text-rose-600">{errors.confirmPassword.message}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="phone">
          Mobile / WhatsApp
        </label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInput
              id="phone"
              international
              defaultCountry="IN"
              countryCallingCodeEditable={false}
              autoComplete="tel"
              placeholder="+91 98765 43210"
              className="phone-input"
              countrySelectProps={{ "aria-label": "Phone country" }}
              numberInputProps={{
                id: "phone",
                className: "phone-input__field",
                autoComplete: "tel",
              }}
              value={field.value || undefined}
              onBlur={field.onBlur}
              onChange={(value) => field.onChange(value ?? "")}
            />
          )}
        />
        <p className="mt-2 text-xs text-slate-500">Use the number you actively use for review follow-ups and approvals.</p>
        {errors.phone ? <p className="mt-2 text-sm text-rose-600">{errors.phone.message}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="batchYear">
          Year of Completion at EXPERT
        </label>
        <select id="batchYear" className={fieldClassName} {...register("batchYear", { valueAsNumber: true })}>
          <option value="">Select year</option>
          {expertCompletionYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {errors.batchYear ? <p className="mt-2 text-sm text-rose-600">{errors.batchYear.message}</p> : null}
      </div>

      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="institution">
          Institution
        </label>
        <select id="institution" className={fieldClassName} {...register("institution")}>
          <option value="">Select institution</option>
          {institutionOptions.map((institution) => (
            <option key={institution} value={institution}>
              {institution}
            </option>
          ))}
        </select>
        {errors.institution ? <p className="mt-2 text-sm text-rose-600">{errors.institution.message}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="professionOption">
          Profession
        </label>
        <input
          id="professionOption"
          list="profession-options"
          placeholder="Search or select a profession"
          className={fieldClassName}
          {...register("professionOption")}
        />
        <datalist id="profession-options">
          {professionOptions.map((profession) => (
            <option key={profession} value={profession} />
          ))}
        </datalist>
        <p className="mt-2 text-xs text-slate-500">Choose the closest profession, or select Other to describe it in your own words.</p>
        {errors.professionOption ? <p className="mt-2 text-sm text-rose-600">{errors.professionOption.message}</p> : null}
      </div>

      {selectedProfession === "Other" ? (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="professionOther">
            Tell us your profession
          </label>
          <input id="professionOther" placeholder="Example: Health policy advisor" className={fieldClassName} {...register("professionOther")} />
          {errors.professionOther ? <p className="mt-2 text-sm text-rose-600">{errors.professionOther.message}</p> : null}
        </div>
      ) : (
        <div className="hidden sm:block" aria-hidden="true" />
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="countryIso">
          Country
        </label>
        <Controller
          name="countryIso"
          control={control}
          render={({ field }) => (
            <select
              id="countryIso"
              className={fieldClassName}
              value={field.value || ""}
              onChange={(event) => {
                const nextCountryIso = String(event.target.value ?? "");
                field.onChange(nextCountryIso);

                if (nextCountryIso === selectedCountryIso) {
                  return;
                }

                setLoadingStates(Boolean(nextCountryIso));
                setLoadingCities(false);
                setStates([]);
                setCities([]);
                setValue("stateCode", "", { shouldDirty: true });
                setValue("city", "", { shouldDirty: true });
              }}
            >
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.countryIso ? <p className="mt-2 text-sm text-rose-600">{errors.countryIso.message}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="stateCode">
          State
        </label>
        <Controller
          name="stateCode"
          control={control}
          render={({ field }) => (
            <select
              id="stateCode"
              disabled={!selectedCountryIso || loadingStates}
              className={`${fieldClassName} disabled:bg-slate-100 disabled:text-slate-500`}
              value={field.value || ""}
              onChange={(event) => {
                const nextStateCode = String(event.target.value ?? "");
                field.onChange(nextStateCode);

                if (nextStateCode === selectedStateCode) {
                  return;
                }

                setLoadingCities(Boolean(nextStateCode));
                setCities([]);
                setValue("city", "", { shouldDirty: true });
              }}
            >
              <option value="">{loadingStates ? "Loading states..." : "Select state"}</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
          )}
        />
        {errors.stateCode ? <p className="mt-2 text-sm text-rose-600">{errors.stateCode.message}</p> : null}
      </div>

      <div className="sm:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="city">
          City
        </label>
        <input
          id="city"
          list="city-options"
          disabled={!selectedStateCode}
          placeholder={loadingCities ? "Loading cities..." : "Search or select a city"}
          className={`${fieldClassName} disabled:bg-slate-100 disabled:text-slate-500`}
          {...register("city")}
        />
        <datalist id="city-options">
          {cities.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>
        <p className="mt-2 text-xs text-slate-500">Country, state, and city suggestions come from a standardized dataset for consistent registrations.</p>
        {errors.city ? <p className="mt-2 text-sm text-rose-600">{errors.city.message}</p> : null}
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-2xl bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] px-4 py-3 font-semibold text-white shadow-[0_20px_40px_-24px_rgba(29,78,216,0.85)] transition hover:brightness-105 disabled:opacity-50"
        >
          {isPending ? "Registering..." : "Register as Alumni"}
        </button>
      </div>
    </form>
  );
}
