import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { PricingPlan } from "@/lib/supabase";
import { PaginatedResponse } from "@/lib/types";

// GET /api/pricing?page=<page>&limit=<limit>
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50); // Max 50 items per page
  const offset = (page - 1) * limit;

  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Get total count
    const { count, error: countError } = await supabase
      .from("pricing_plans")
      .select("*", { count: "exact", head: true });

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    // Get paginated data
    const { data, error } = await supabase
      .from("pricing_plans")
      .select("*")
      .order("price", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response: PaginatedResponse<PricingPlan> = {
      data: data as PricingPlan[],
      metadata: {
        total: count || 0,
        page,
        limit,
        hasMore: (count || 0) > offset + limit,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch pricing plans" },
      { status: 500 }
    );
  }
}

// GET /api/pricing/:id
export async function GET_BY_ID(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json(
      { error: "Pricing plan ID is required" },
      { status: 400 }
    );
  }

  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data, error } = await supabase
      .from("pricing_plans")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "Pricing plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch pricing plan" },
      { status: 500 }
    );
  }
}
