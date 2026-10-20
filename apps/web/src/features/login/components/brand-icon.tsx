export default function BrandIcon() {
  return (
    <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground" aria-hidden="true">
      <svg className="size-7" fill="none" viewBox="0 0 32 32">
        <path
          d="M16 25V13m0 8c-5.2 0-8.5-2.7-8.5-7.5 5.2 0 8.5 2.7 8.5 7.5Zm0-4c0-5.3 3-8.7 8.5-8.7 0 5.3-3 8.7-8.5 8.7Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path d="M9 27h14M12 30h8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    </span>
  );
}