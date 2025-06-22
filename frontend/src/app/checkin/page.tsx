// app/checkin/page.tsx
import { auth } from "@/lib/auth.config";
import { redirect } from "next/navigation";
import CheckinForm from "@/components/CheckinForm";

type Props = {
  searchParams: { shopId?: string };
};

export default async function CheckinPage({ searchParams }: Props) {
  const session = await auth();

  if (!session?.user) {
    const shopId = searchParams.shopId;
    redirect(`/login?from=checkin${shopId ? `&shopId=${shopId}` : ""}`);
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">เช็คอินร้านอาหาร</h1>
      <CheckinForm />
    </div>
  );
}
