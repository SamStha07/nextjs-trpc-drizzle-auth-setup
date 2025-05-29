import { checkIsDealer } from '@/lib/auth';

export default async function DealerPage() {
  await checkIsDealer();
  return <div>page</div>;
}
