import { NextResponse } from "next/server";

type ProcessCsvRequestBody = {
  file: string; // Base64-encoded CSV content or file path
  weights: {
    voice: number;
    sms: number;
    data: number;
  };
  timeGap: number;
  dateFilter?: {
    startDate: string;
    endDate: string;
  };
};

export async function POST(req: Request): Promise<Response> {
  try {
    const { file, weights, timeGap, dateFilter } =
      (await req.json()) as ProcessCsvRequestBody;

    console.log("Request body parsed:", { weights, timeGap, dateFilter });

    const backendUrl =
      process.env.BACKEND_URL ||
      "https://tower-jumps-backend-production.up.railway.app";

    // Forward the request to the backend
    const backendResponse = await fetch(`${backendUrl}/process-csv`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file, weights, timeGap, dateFilter }),
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      return NextResponse.json(
        { error: "Failed to process CSV", details: error },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log("Response from backend:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 }
    );
  }
}
