// app/dashboard/page.tsx
import { auth } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import NewArticleContentPage from "./NewArticleContent";

export default async function NewArticlePage() {
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?from=dashboard/articles/new`);
  }

  return <NewArticleContentPage />
}