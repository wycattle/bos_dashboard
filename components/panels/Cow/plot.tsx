"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function NetRevenuePlotPanel() {
  const searchParams = useSearchParams();
  const wyId = searchParams.get("wy_id");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!wyId);
  const [error, setError] = useState<string | null>(
    wyId ? null : "Missing WY ID"
  );

  useEffect(() => {
    if (!wyId) return;

    fetch(`/api/plots?wy_id=${encodeURIComponent(wyId)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setImgUrl(data.url);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, [wyId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!imgUrl) return <p>No plot found for WY ID: {wyId}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ color: "#f8fafc" }}>Net Revenue Plot for {wyId}</h2>
      <img
        src={imgUrl}
        alt={`Net revenue plot for WY ${wyId}`}
        style={{ maxWidth: "100%", border: "1px solid #475569" }}
      />
    </div>
  );
}