import { Redirect } from 'expo-router';

import { usePilot } from '@/state';

export default function IndexRoute() {
  const { state } = usePilot();
  return <Redirect href={state.profile.welcomeAccepted ? '/home' : '/welcome'} />;
}
