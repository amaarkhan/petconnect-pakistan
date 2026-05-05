export const POST_TYPES = [
  { value: "lost", label: "Lost Pets" },
  { value: "found", label: "Found Pets" },
  { value: "adoption", label: "Adoption" },
  { value: "sale", label: "Sale" },
] as const;

export const CITIES = [
  "Peshawar",
] as const;

export const SERVICE_TYPES = [
  { value: "vet", label: "Vets" },
  { value: "groomer", label: "Groomers" },
  { value: "shop", label: "Pet Shops" },
] as const;
