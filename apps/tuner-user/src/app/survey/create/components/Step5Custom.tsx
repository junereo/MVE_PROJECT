"use client";

export default function Step5Custom() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Step 5: 커스텀 설문</h2>
      <input type="text" placeholder="Custom" className="border p-2 w-full" />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">다음</button>
    </div>
  );
}
