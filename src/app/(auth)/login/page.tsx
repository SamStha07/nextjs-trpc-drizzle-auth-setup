import { checkIsPublic } from '@/lib/auth';
import { LoginView } from '@/modules/auth/ui/views/login-view';

// type Params = Promise<{ redirect?: string }>;
type SearchParams = Promise<{ redirect?: string }>;

export default async function LoginPage({
  searchParams
}: {
  // params: Params;
  searchParams: SearchParams;
}) {
  // const { redirect } = await params;
  const { redirect } = await searchParams;
  await checkIsPublic();

  return <LoginView redirect={redirect} />;
}
