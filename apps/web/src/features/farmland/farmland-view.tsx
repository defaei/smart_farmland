"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { farmlandZones } from "./mock";
import type { FarmlandZone, FarmZoneId, NutrientLevel } from "./types";

const nutrientLabels: Record<NutrientLevel, string> = {
  low: "کم",
  balanced: "متعادل",
  high: "زیاد",
};

const formatNumber = (value: number) => new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 }).format(value);

function CropPattern({ zoneId }: { zoneId: FarmZoneId }) {
  const patternId = `crop-pattern-${zoneId}`;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-55"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <defs>
        <pattern height="22" id={patternId} patternUnits="userSpaceOnUse" width="22">
          <path
            className="stroke-farm-crop"
            d="M11 20V12m0 4c-4 0-6-2-6-5 4 0 6 2 6 5Zm0-3c4 0 6-2 6-5-4 0-6 2-6 5Z"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <circle className="fill-farm-crop-light" cx="11" cy="20" r="1.2" />
        </pattern>
      </defs>
      <rect fill={`url(#${patternId})`} height="100" width="100" />
    </svg>
  );
}

function ZoneButton({ zone, active, onSelect }: { zone: FarmlandZone; active: boolean; onSelect: (zoneId: FarmZoneId) => void }) {
  const soilColor = {
    M1: "bg-farm-soil-a",
    M2: "bg-farm-soil-b",
    M3: "bg-farm-soil-c",
    M4: "bg-farm-soil-d",
  }[zone.id];

  return (
    <button
      aria-label={`محدوده ${zone.id}`}
      aria-pressed={active}
      className={`group relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden text-foreground transition-colors focus-visible:z-10 focus-visible:outline-4 focus-visible:outline-offset-[-5px] focus-visible:outline-farm-selected ${soilColor} ${active ? "z-1 ring-4 ring-inset ring-farm-selected" : "hover:brightness-[0.97]"}`}
      onClick={() => onSelect(zone.id)}
      type="button"
    >
      <CropPattern zoneId={zone.id} />
      <span className="relative flex flex-col items-center gap-1 border border-white/70 bg-surface/90 px-3 py-2 text-center shadow-sm">
        <span className="text-base font-bold leading-none text-primary sm:text-lg">{zone.id}</span>
      </span>
      {active && <span aria-hidden="true" className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-farm-selected" />}
    </button>
  );
}

function ZoneDetailsDialog({ zone, onDismiss }: { zone: FarmlandZone | null; onDismiss: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (zone && !dialog.open) dialog.showModal();
    if (!zone && dialog.open) dialog.close();
  }, [zone]);

  const closeOnBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) dialogRef.current?.close();
  };

  const moisturePercent = zone ? Math.min(100, Math.max(0, zone.moisturePercent)) : 0;
  const water =
    moisturePercent < 20
      ? { label: "خیلی کم", color: "text-farm-high", background: "bg-farm-high-bg", fill: "bg-farm-high" }
      : moisturePercent < 50
        ? { label: "کم", color: "text-farm-low", background: "bg-farm-low-bg", fill: "bg-farm-low" }
        : moisturePercent <= 70
          ? { label: "مناسب", color: "text-farm-good", background: "bg-farm-good-bg", fill: "bg-farm-good" }
          : { label: "زیاد", color: "text-farm-high", background: "bg-farm-high-bg", fill: "bg-farm-high" };

  return (
    <dialog
      aria-labelledby="zone-dialog-title"
      className="m-0 mt-auto w-full max-w-none border border-border bg-surface p-0 text-foreground shadow-lg backdrop:bg-foreground/35 sm:m-auto sm:max-w-lg sm:rounded-lg"
      onClick={closeOnBackdrop}
      onClose={onDismiss}
      ref={dialogRef}
    >
      {zone && water && (
        <div className="p-5 sm:p-7">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-bold text-primary">جزئیات خاک</p>
              <h2 className="text-xl font-bold" id="zone-dialog-title">
                محدوده {zone.id}
              </h2>
            </div>
            <button
              aria-label="بستن جزئیات"
              className="flex h-10 w-10 shrink-0 items-center justify-center border border-border text-xl text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              data-dialog-close
              onClick={() => dialogRef.current?.close()}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <section aria-label="وضعیت آب" className="mb-5 border-b border-border pb-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold">آب در دسترس</h3>
              <span className={`px-2.5 py-1 text-xs font-bold ${water.background} ${water.color}`}>{water.label}</span>
            </div>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">رطوبت خاک</span>
              <span className="text-lg font-bold">{formatNumber(moisturePercent)}٪</span>
            </div>

            <div
              aria-label={`رطوبت خاک ${moisturePercent} درصد`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={moisturePercent}
              className="relative h-2 w-full overflow-hidden bg-muted"
              role="progressbar"
            >
              <div className={`absolute left-0 top-0 h-full ${water.fill}`} style={{ width: `${moisturePercent}%` }} />
            </div>

            <p className="mt-3">{zone.waterNote}</p>
          </section>

          <section aria-label="کیفیت خاک">
            <h3 className="mb-2 text-sm font-bold">کیفیت خاک</h3>
            <p className="mb-4 text-sm leading-7 text-muted-foreground">{zone.soilSummary}</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-4 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">اسیدیته (pH)</dt>
                <dd className="font-bold" dir="ltr">
                  {zone.ph}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">مواد آلی</dt>
                <dd className="font-bold">{formatNumber(zone.organicMatterPercent)}٪</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">نیتروژن</dt>
                <dd className="font-bold">{nutrientLabels[zone.nitrogen]}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">فسفر</dt>
                <dd className="font-bold">{nutrientLabels[zone.phosphorus]}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">پتاسیم</dt>
                <dd className="font-bold">{nutrientLabels[zone.potassium]}</dd>
              </div>
            </dl>
          </section>

          <p className="mt-5 border-t border-border pt-3 text-[11px] text-muted-foreground">
            مقادیر نمایش‌داده‌شده نمونه هستند و اندازه‌گیری زنده نیستند.
          </p>
        </div>
      )}
    </dialog>
  );
}

export default function FarmlandView() {
  const [activeZoneId, setActiveZoneId] = useState<FarmZoneId>("M1");
  const [dialogZoneId, setDialogZoneId] = useState<FarmZoneId | null>(null);
  const dialogZone = farmlandZones.find((zone) => zone.id === dialogZoneId) ?? null;

  const selectZone = (zoneId: FarmZoneId) => {
    setActiveZoneId(zoneId);
    setDialogZoneId(zoneId);
  };

  return (
    <main className="min-h-dvh bg-background px-4 py-5 text-foreground sm:px-8 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100dvh-2.5rem)] max-w-6xl flex-col sm:min-h-[calc(100dvh-4rem)]">
        <header className="mb-5 flex items-center justify-between gap-4 border-b border-border pb-4 sm:mb-8 sm:pb-5">
          <div>
            <p className="text-xs font-bold text-primary sm:text-sm">مزرعه‌یار</p>
            <h1 className="mt-1 text-lg font-bold sm:text-2xl">پایش قطعه</h1>
          </div>
          <div className="flex items-center gap-2 border border-border bg-surface px-3 py-2 text-xs text-muted-foreground sm:text-sm">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
            داده‌های نمونه
          </div>
        </header>

        <section aria-label="نقشه قطعه ده در ده متر" className="mx-auto my-auto w-full max-w-180">
          <div className="mb-2 ml-9 sm:ml-14">
            <div className="mb-1 text-center text-sm font-bold text-muted-foreground">۱۰ متر</div>
            <div aria-hidden="true" className="grid grid-cols-2 text-center text-xs text-muted-foreground">
              <span className="border-r border-border">۵ متر</span>
              <span>۵ متر</span>
            </div>
            <div aria-hidden="true" className="h-px bg-border" />
          </div>

          <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-2 sm:grid-cols-[44px_minmax(0,1fr)] sm:gap-3">
            <div aria-hidden="true" className="relative flex flex-col justify-around py-2 text-[10px] text-muted-foreground sm:text-xs">
              <span className="absolute inset-y-0 left-0 flex items-center [writing-mode:vertical-rl] rotate-180">۱۰ متر</span>
              <span className="ml-auto border-b border-border pb-1">۵ م</span>
              <span className="ml-auto border-t border-border pt-1">۵ م</span>
            </div>
            <div className="relative grid aspect-square grid-cols-2 grid-rows-2 overflow-hidden border-2 border-farm-edge">
              {(["M3", "M4", "M1", "M2"] as FarmZoneId[]).map((zoneId) => {
                const zone = farmlandZones.find((item) => item.id === zoneId);
                if (!zone) return null;

                return <ZoneButton active={activeZoneId === zoneId} key={zoneId} onSelect={selectZone} zone={zone} />;
              })}
              <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-farm-edge" />
              <span aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-farm-edge" />
            </div>
          </div>

          <div aria-hidden="true" className="mt-2 ml-9 grid grid-cols-2 text-center text-xs text-muted-foreground sm:ml-14">
            <span className="border-r border-border">۵ متر</span>
            <span>۵ متر</span>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground sm:mt-5 sm:text-sm">برای مشاهده وضعیت خاک، یک محدوده را انتخاب کنید.</p>
        </section>
      </div>

      <ZoneDetailsDialog zone={dialogZone} onDismiss={() => setDialogZoneId(null)} />
    </main>
  );
}
