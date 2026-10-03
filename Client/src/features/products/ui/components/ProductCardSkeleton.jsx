import Skeleton from "@/shared/ui/components/Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/3" />
      </div>
    </div>
  );
}
