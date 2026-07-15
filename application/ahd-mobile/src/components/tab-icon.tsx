import type { ColorValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const PATHS = {
  home: 'M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z',
  create: 'M12 5v14M5 12h14',
  daftari:
    'M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 5h7M8 12h7M8 16h5',
  settle:
    'M12 4v16M8 6h8M6 6 4 11a3 3 0 0 0 6 0L8 6m10 0-2 5a3 3 0 0 0 6 0l-2-5M9 20h6',
  more: 'M6 12h.01M12 12h.01M18 12h.01',
} as const;

export type TabIconName = keyof typeof PATHS;

type TabIconProps = {
  name: TabIconName;
  color: ColorValue;
  size?: number;
};

export function TabIcon({ name, color, size = 22 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d={PATHS[name]}
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
