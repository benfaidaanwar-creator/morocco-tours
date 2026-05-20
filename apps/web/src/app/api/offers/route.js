import { getSupabaseAdmin, throwIfSupabaseError } from "@/app/api/utils/supabase";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const activeOnly = url.searchParams.get("active") !== "false";
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from("offers")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (activeOnly) {
      query = query.eq("is_active", true);
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    throwIfSupabaseError(error);
    return Response.json(data || []);
  } catch (error) {
    console.error("Error fetching offers:", error);
    return Response.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      category,
      title_en,
      title_es,
      title_fr,
      title_ar,
      subtitle_en,
      subtitle_es,
      subtitle_fr,
      subtitle_ar,
      description_en,
      description_es,
      description_fr,
      description_ar,
      price,
      currency,
      duration,
      included_features_en,
      included_features_es,
      included_features_fr,
      included_features_ar,
      image_url,
      is_active,
      sort_order,
    } = body;

    const { data, error } = await getSupabaseAdmin()
      .from("offers")
      .insert({
        category,
        title_en,
        title_es: title_es || null,
        title_fr: title_fr || null,
        title_ar: title_ar || null,
        subtitle_en: subtitle_en || null,
        subtitle_es: subtitle_es || null,
        subtitle_fr: subtitle_fr || null,
        subtitle_ar: subtitle_ar || null,
        description_en: description_en || null,
        description_es: description_es || null,
        description_fr: description_fr || null,
        description_ar: description_ar || null,
        price: price || 0,
        currency: currency || "EUR",
        duration: duration || null,
        included_features_en: included_features_en || null,
        included_features_es: included_features_es || null,
        included_features_fr: included_features_fr || null,
        included_features_ar: included_features_ar || null,
        image_url: image_url || null,
        is_active: is_active !== false,
        sort_order: sort_order || 0,
      })
      .select()
      .single();
    throwIfSupabaseError(error);
    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating offer:", error);
    return Response.json({ error: "Failed to create offer" }, { status: 500 });
  }
}
