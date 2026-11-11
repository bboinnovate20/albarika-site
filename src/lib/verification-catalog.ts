export type VerificationKind = "nin" | "bvn";

export type VerificationService = {
  id: string;
  kind: VerificationKind;
  label: string;
  slip: string;
  slipLabel: string;
  path: string;
  fields: Array<"nin" | "phone" | "bvn" | "demographic">;
};

export const verificationServices: VerificationService[] = [
  { id: "nin-regular", kind: "nin", label: "NIN Verification (NIN Number)", slip: "regular", slipLabel: "Normal slip", path: "nin_regular_slip.php", fields: ["nin"] },
  { id: "nin-standard", kind: "nin", label: "NIN Verification (NIN Number)", slip: "standard", slipLabel: "Standard slip", path: "nin_standard_slip.php", fields: ["nin"] },
  { id: "nin-premium", kind: "nin", label: "NIN Verification (NIN Number)", slip: "premium", slipLabel: "Premium slip", path: "nin_by_nin.php", fields: ["nin"] },
  { id: "nin-vnin", kind: "nin", label: "NIN Verification (NIN Number)", slip: "vnin", slipLabel: "VNIN slip", path: "vnin_slip.php", fields: ["nin"] },
  { id: "phone-regular", kind: "nin", label: "NIN Verification (Phone Number)", slip: "regular", slipLabel: "Normal slip", path: "nin_by_phone_regular.php", fields: ["phone"] },
  { id: "phone-standard", kind: "nin", label: "NIN Verification (Phone Number)", slip: "standard", slipLabel: "Standard slip", path: "nin_by_phone_standard.php", fields: ["phone"] },
  { id: "phone-premium", kind: "nin", label: "NIN Verification (Phone Number)", slip: "premium", slipLabel: "Premium slip", path: "nin_by_phone_premium.php", fields: ["phone"] },
  { id: "phone-vnin", kind: "nin", label: "NIN Verification (Phone Number)", slip: "vnin", slipLabel: "VNIN slip", path: "vnin_slip.php", fields: ["phone"] },
  { id: "demo-premium", kind: "nin", label: "NIN Verification (Demographic)", slip: "premium", slipLabel: "Premium slip", path: "nin_by_demo.php", fields: ["demographic"] },
  { id: "bvn-premium", kind: "bvn", label: "BVN Verification (BVN Number)", slip: "premium", slipLabel: "Premium slip", path: "bvn_premium_slip.php", fields: ["bvn"] },
  { id: "bvn-standard", kind: "bvn", label: "BVN Verification (BVN Number)", slip: "standard", slipLabel: "Standard slip", path: "bvn_full_details_slip.php", fields: ["bvn"] },
];

export function verificationService(id: string) {
  return verificationServices.find((service) => service.id === id);
}

const personLabels: Record<string, string> = {
  nin: "NIN",
  bvn: "BVN",
  first_name: "First name",
  firstname: "First name",
  last_name: "Last name",
  lastname: "Last name",
  surname: "Last name",
  middle_name: "Middle name",
  middlename: "Middle name",
  other_name: "Middle name",
  othername: "Middle name",
  full_name: "Name",
  fullname: "Name",
  customer_name: "Name",
  account_name: "Name",
  gender: "Gender",
  date_of_birth: "Date of birth",
  dob: "Date of birth",
  birthdate: "Date of birth",
  phone_number: "Phone",
  phone: "Phone",
  mobile: "Phone",
  address: "Address",
  residential_address: "Address",
  residence_address: "Address",
};

export type VerificationPerson = Record<string, string>;

export function personFrom(data: unknown): VerificationPerson {
  const person: VerificationPerson = {};
  const visit = (value: unknown, depth = 0) => {
    if (!value || typeof value !== "object" || depth > 5) return;
    const entries = Array.isArray(value) ? value.entries() : Object.entries(value as Record<string, unknown>);
    for (const [key, item] of entries) {
      const label = personLabels[String(key).toLowerCase()];
      if (label && typeof item === "string") {
        const text = item.trim();
        if (text && text.length <= 240 && !person[label]) person[label] = text;
      }
      if (item && typeof item === "object") visit(item, depth + 1);
    }
  };
  visit(data);
  return person;
}
