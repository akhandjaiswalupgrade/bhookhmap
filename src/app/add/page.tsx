"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AREAS, generateId } from "@/lib/utils";
import type { Dish, Place } from "@/types";

const PLACE_TYPES = [
  { value: "shop", label: "Dukaan / Shop" },
  { value: "cart", label: "Thela / Cart" },
  { value: "dhaba", label: "Dhaba" },
  { value: "stall", label: "Stall" },
  { value: "restaurant", label: "Restaurant" },
];

const step1Schema = z.object({
  placeType: z.string().min(1, "Type chuniye"),
  area: z.string().min(1, "Area chuniye"),
  placeId: z.string().min(1, "Jagah chuniye"),
});

const step2Schema = z.object({
  dishId: z.string().min(1, "Dish chuniye"),
  price: z
    .string()
    .min(1, "Price daaliye")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, "Sahi price daaliye"),
});

const step3Schema = z.object({
  rating: z.number().int().min(1, "Rating dijiye").max(5),
  text: z.string().min(10, "Kam se kam 10 characters likhiye"),
});

const formSchema = step1Schema.merge(step2Schema).merge(step3Schema);
type FormValues = z.infer<typeof formSchema>;

const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ["placeType", "area", "placeId"],
  2: ["dishId", "price"],
  3: ["rating", "text"],
};

const GUEST_USER_KEY = "bhookhmap_guest_user_id";

function getGuestUserId() {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(GUEST_USER_KEY);
  if (!id) {
    id = generateId();
    window.localStorage.setItem(GUEST_USER_KEY, id);
  }
  return id;
}

export default function AddSpotPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [places, setPlaces] = useState<Place[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      placeType: "",
      area: "",
      placeId: "",
      dishId: "",
      price: "",
      rating: 0,
      text: "",
    },
  });

  const placeType = watch("placeType");
  const area = watch("area");
  const placeId = watch("placeId");
  const rating = watch("rating");

  useEffect(() => {
    if (!placeType || !area) {
      setPlaces([]);
      return;
    }
    let cancelled = false;
    setLoadingPlaces(true);
    setValue("placeId", "");
    fetch(`/api/places?type=${placeType}&area=${encodeURIComponent(area)}`)
      .then((res) => res.json())
      .then((data: Place[]) => {
        if (!cancelled) setPlaces(data);
      })
      .finally(() => {
        if (!cancelled) setLoadingPlaces(false);
      });
    return () => {
      cancelled = true;
    };
  }, [placeType, area, setValue]);

  useEffect(() => {
    fetch("/api/dishes")
      .then((res) => res.json())
      .then((data: Dish[]) => setDishes(data));
  }, []);

  const selectedPlace = useMemo(
    () => places.find((p) => p.id === placeId),
    [places, placeId]
  );

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(3, s + 1));
  }

  function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: getGuestUserId(),
          placeId: values.placeId,
          dishId: values.dishId,
          rating: values.rating,
          text: `Price paid: ₹${values.price} — ${values.text}`,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ? JSON.stringify(data.error) : "Kuch gadbad ho gaya");
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Kuch gadbad ho gaya");
    } finally {
      setSubmitting(false);
    }
  });

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center gap-3">
        <CheckCircle2 className="w-12 h-12 text-chutney" />
        <h1 className="text-xl font-bold text-foreground">Shukriya! Review jud gaya 🙏</h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          Aapka proof-of-taste review save ho gaya hai. Aur logon ko sahi jagah dhundhne mein madad milegi.
        </p>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button onClick={() => router.push(`/place/${placeId}`)}>Jagah dekhein</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 pt-4 pb-8 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-foreground mb-1">Naya Spot Jodo</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Apna khaane ka anubhav share karein, teen aasan steps mein.
      </p>

      {/* ── Progress bar ─────────────────────────────── */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-colors ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-4">Step {step} of 3</p>

      <form onSubmit={onSubmit}>
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Jagah ki jaankari</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="placeType">Jagah ka type</Label>
                <Select
                  value={placeType || undefined}
                  onValueChange={(v) => setValue("placeType", v as string, { shouldValidate: true })}
                >
                  <SelectTrigger id="placeType" className="w-full">
                    <SelectValue placeholder="Type chuniye" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLACE_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.placeType && (
                  <p className="text-xs text-destructive">{errors.placeType.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="area">Area</Label>
                <Select
                  value={area || undefined}
                  onValueChange={(v) => setValue("area", v as string, { shouldValidate: true })}
                >
                  <SelectTrigger id="area" className="w-full">
                    <SelectValue placeholder="Area chuniye" />
                  </SelectTrigger>
                  <SelectContent>
                    {AREAS.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.area && (
                  <p className="text-xs text-destructive">{errors.area.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="placeId">Jagah ka naam</Label>
                <Select
                  value={placeId || undefined}
                  onValueChange={(v) => setValue("placeId", v as string, { shouldValidate: true })}
                  disabled={!placeType || !area || loadingPlaces}
                >
                  <SelectTrigger id="placeId" className="w-full">
                    <SelectValue
                      placeholder={
                        !placeType || !area
                          ? "Pehle type aur area chuniye"
                          : loadingPlaces
                          ? "Load ho raha hai..."
                          : places.length === 0
                          ? "Yahan koi jagah nahi mili"
                          : "Naam chuniye"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {places.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.placeId && (
                  <p className="text-xs text-destructive">{errors.placeId.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Dish aur price</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {selectedPlace && (
                <p className="text-sm text-muted-foreground">
                  📍 {selectedPlace.name}, {selectedPlace.area}
                </p>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dishId">Kaunsi dish khayi?</Label>
                <Select
                  value={watch("dishId") || undefined}
                  onValueChange={(v) => setValue("dishId", v as string, { shouldValidate: true })}
                >
                  <SelectTrigger id="dishId" className="w-full">
                    <SelectValue placeholder="Dish chuniye" />
                  </SelectTrigger>
                  <SelectContent>
                    {dishes.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.dishId && (
                  <p className="text-xs text-destructive">{errors.dishId.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="price">Kitne mein mili? (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g. 80"
                  {...register("price")}
                />
                {errors.price && (
                  <p className="text-xs text-destructive">{errors.price.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Rating aur review</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Kitne sitare doge?</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} star`}
                      className="p-1.5 min-w-11 min-h-11 flex items-center justify-center"
                      onClick={() => setValue("rating", n, { shouldValidate: true })}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          n <= (rating || 0)
                            ? "fill-gold text-gold"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && (
                  <p className="text-xs text-destructive">{errors.rating.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="text">Apna anubhav likhiye</Label>
                <Textarea
                  id="text"
                  rows={5}
                  placeholder="Zayka kaisa tha? Hygiene? Value for money?"
                  {...register("text")}
                />
                {errors.text && (
                  <p className="text-xs text-destructive">{errors.text.message}</p>
                )}
              </div>

              {submitError && (
                <p className="text-xs text-destructive">{submitError}</p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex items-center gap-3 mt-6">
          {step > 1 && (
            <Button type="button" variant="outline" className="flex-1 h-11" onClick={goBack}>
              Peeche
            </Button>
          )}
          {step < 3 && (
            <Button type="button" className="flex-1 h-11" onClick={goNext}>
              Aage
            </Button>
          )}
          {step === 3 && (
            <Button type="submit" className="flex-1 h-11" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submit ho raha hai...
                </>
              ) : (
                "Review Submit Karein"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
