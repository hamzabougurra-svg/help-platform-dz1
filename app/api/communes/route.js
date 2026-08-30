import { NextResponse } from "next/server";

const COMMUNES_URL = "https://raw.githubusercontent.com/el-amin-dev/algeria-wilayas-communes/main/data/communes.json";

export async function GET() {
  try {
    const response = await fetch(COMMUNES_URL, { next: { revalidate: 86400 } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const communes = Array.isArray(data) ? data : data.communes;
    if (!Array.isArray(communes) || communes.length === 0) throw new Error("بيانات البلديات فارغة");
    return NextResponse.json({ communes, count: communes.length });
  } catch (error) {
    console.error("Communes API error:", error);
    return NextResponse.json({ error: "تعذر تحميل بيانات البلديات" }, { status: 503 });
  }
}
