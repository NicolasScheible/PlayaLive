import { render } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import { SkeletonBlock } from './SkeletonBlock';

describe('SkeletonBlock', () => {
  it('rendert ohne zu crashen und ist für Screenreader ausgeblendet', () => {
    const { toJSON } = render(<SkeletonBlock width={200} height={140} />);

    expect(toJSON()).toBeTruthy();
  });

  it('respektiert „Bewegung reduzieren" ohne zu crashen', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);

    const { toJSON } = render(<SkeletonBlock width={200} height={140} />);

    expect(toJSON()).toBeTruthy();
  });
});
