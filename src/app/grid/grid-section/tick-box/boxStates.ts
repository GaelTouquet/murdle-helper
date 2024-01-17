export type BoxState = 'unticked' | 'true' | 'false';

export const boxStatePermutations: {
  unticked: BoxState;
  false: BoxState;
  true: BoxState;
} = {
  unticked: 'false',
  false: 'true',
  true: 'unticked',
};
