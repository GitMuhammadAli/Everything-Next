import { NextResponse } from "next/server";

type DemoPayload = {
  ts: string;
  value: number;
  message: string;
};

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload: DemoPayload = {
      ts: new Date().toISOString(),
      value: Math.floor(Math.random() * 1000),
      message: "This is a demo API endpoint for SSR/CSR examples",
    };
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in demo route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
