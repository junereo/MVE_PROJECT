"use client";

export default function ProfileSection({
  title,
  actionLabel,
  onActionClick,
  children,
}: {
  title: string;
  actionLabel?: string;
  onActionClick?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white p-4 space-y-2">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        {actionLabel && (
          <button
            onClick={onActionClick}
            className="text-sm text-gray-500 border border-gray-300 rounded px-2 py-1 hover:bg-gray-50"
          >
            {actionLabel}
          </button>
        )}
      </div>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}
