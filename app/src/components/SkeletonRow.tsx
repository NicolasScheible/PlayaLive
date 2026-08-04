import { theme } from '../theme/theme';

import { HorizontalCardList } from './HorizontalCardList';
import { SkeletonBlock } from './SkeletonBlock';

// Ladezustand für horizontale Card-Karussells (Live Auslastung, Highlights heute, Aktuelle Acts,
// Happy Hours, Specials — alle nutzen dieselbe Skeleton-Row-Form, daher hier als ein geteilter
// Baustein statt fünffacher Duplikation, siehe CLAUDE.md → „ab der 3. Verwendung").
const CARD_WIDTH = 200;
const CARD_HEIGHT = 140;

type SkeletonRowProps = {
  accessibilityLabel: string;
  count?: number;
};

export function SkeletonRow({ accessibilityLabel, count = 3 }: SkeletonRowProps) {
  return (
    <HorizontalCardList accessibilityLabel={accessibilityLabel}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonBlock
          key={index}
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          borderRadius={theme.radius.card}
        />
      ))}
    </HorizontalCardList>
  );
}
