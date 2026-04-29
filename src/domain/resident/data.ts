/**
 * Resident data source. In a real app this would be a typed HTTP client; for
 * the test we read from the static JSON shipped in src/assets/data.json.
 *
 * Centralising the import here means the rest of the app never touches the
 * raw JSON path — swapping to an API later only requires changing this file.
 */
import rawData from '@/assets/data.json';
import type { AttendingPhysician, Resident } from './types';

/**
 * Demo attending physician.
 *
 * data.json does not currently expose the attending physician, but the Figma
 * mock displays the chip + tooltip for it. To stay faithful to the design
 * without fabricating per-resident data, we attach the same demo physician
 * (the one shown in Figma) to every resident at load time.
 *
 * When the API exposes the real field, delete this constant and remove the
 * mapping below — the rest of the app already reads `resident.attendingPhysician`
 * as an optional, typed field.
 */
const DEMO_PHYSICIAN: AttendingPhysician = {
  fullName: 'ÄRZTIN Vincent',
  shortName: 'ÄRZTIN V.',
  phone: '06 73 58 29 41',
};

export function loadResidents(): Resident[] {
  return (rawData as Omit<Resident, 'attendingPhysician'>[]).map((r) => ({
    ...r,
    attendingPhysician: DEMO_PHYSICIAN,
  }));
}
