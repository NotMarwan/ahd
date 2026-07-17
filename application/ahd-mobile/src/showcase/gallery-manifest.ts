import type { ScreenKey } from '../navigation/screen-registry';

export type GalleryProofState = 'verified' | 'tampered';

export type MobileReadmeGalleryAsset = {
  readonly filename: `${number}-${string}.png`;
  readonly screens: readonly ScreenKey[];
  readonly states?: readonly GalleryProofState[];
};

export const MOBILE_README_GALLERY: readonly MobileReadmeGalleryAsset[] = [
  { filename: '01-home.png', screens: ['home'] },
  { filename: '02-create-refusal.png', screens: ['create', 'refusal'] },
  { filename: '03-daftari-timeline.png', screens: ['daftari', 'timeline'] },
  {
    filename: '04-proof.png',
    screens: ['proof'],
    states: ['verified', 'tampered'],
  },
  { filename: '05-settlement.png', screens: ['settle'] },
  { filename: '06-capabilities.png', screens: ['more'] },
  { filename: '07-open-loan.png', screens: ['open'] },
  { filename: '08-mine.png', screens: ['mine'] },
  { filename: '09-request.png', screens: ['request'] },
  { filename: '10-standing.png', screens: ['standing'] },
  { filename: '11-circle.png', screens: ['circle'] },
  { filename: '12-circle-advanced.png', screens: ['circle-adv'] },
  { filename: '13-jamiya.png', screens: ['jamiya'] },
  { filename: '14-daily.png', screens: ['daily'] },
  { filename: '15-maroof.png', screens: ['maroof'] },
  { filename: '16-dispute.png', screens: ['dispute'] },
  { filename: '17-impact.png', screens: ['impact'] },
  { filename: '18-bounds-shariah.png', screens: ['bounds', 'shariah'] },
  { filename: '19-plans-org.png', screens: ['plans', 'org'] },
  { filename: '20-settings.png', screens: ['settings'] },
] as const;
