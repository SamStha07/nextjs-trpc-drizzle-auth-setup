export default async function Home() {
  return <div>Hello</div>;

  // return (
  //   <HydrateClient>
  //     <ErrorBoundary fallback={<div>Something went wrong</div>}>
  //       <Suspense fallback={<div>Loading...</div>}>
  //         <ClientGreeting />
  //       </Suspense>
  //     </ErrorBoundary>
  //   </HydrateClient>
  // );
}
