import type { SecurityEvent, SecurityEventStatus } from './types';

function getRandomData() {
  const mockData = [
    {
      title: 'Door forced open at North Loading Bay',
      description:
        'Forced-entry sensor triggered on the North Loading Bay door without a valid access grant. No badge event recorded in the preceding 30 seconds. Verify on camera and dispatch security to confirm.',
    },
    {
      title: 'Motion detected after hours in Server Room B',
      description:
        'Motion analytics detected movement in Server Room B outside scheduled access hours. No corresponding work order or maintenance window found. Operator reviewing footage to confirm whether personnel are authorized.',
    },
    {
      title: 'Access denied for invalid credential at Main Lobby turnstile',
      description:
        'Credential presented at the Main Lobby turnstile was rejected (expired or unrecognized badge). Three consecutive failed attempts recorded. Resolved, cardholder redirected to reception for re-issuance.',
    },
    {
      title: 'Camera signal lost on Parking Level 3 (CAM-217)',
      description:
        'Video stream from CAM-217 on Parking Level 3 dropped and has not recovered. Possible network or power fault at the device. Maintenance ticket pending; area temporarily without coverage.',
    },
    {
      title: 'Tailgating detected at Employee Entrance West',
      description:
        'Analytics flagged two people entering on a single badge swipe at Employee Entrance West. Footage reviewed, second individual confirmed as authorized employee who forgot their badge. Closed, no further action.',
    },
  ];
  const randomValue = Math.random();

  if (randomValue < 1 / 5) return mockData[0];
  else if (randomValue < 2 / 5) return mockData[1];
  else if (randomValue < 3 / 5) return mockData[2];
  else if (randomValue < 4 / 5) return mockData[3];
  return mockData[4];
}

function getRandomStatus(): SecurityEventStatus {
  const randomValue = Math.random();

  if (randomValue < 1 / 5) return 'active';
  else if (randomValue < 2 / 5) return 'acknowledged';
  else if (randomValue < 3 / 5) return 'dismissed';
  else if (randomValue < 4 / 5) return 'in_progress';
  return 'resolved';
}

export function generateEvents(
  quantity: number,
  days: number,
): SecurityEvent[] {
  const startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * days);
  const endDate = new Date();

  const diff = endDate.getTime() - startDate.getTime();

  return Array.from({ length: quantity }, () => ({
    ...getRandomData(),
    id: crypto.randomUUID(),
    date: new Date(startDate.getTime() + Math.random() * diff).toISOString(),
    status: getRandomStatus(),
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
