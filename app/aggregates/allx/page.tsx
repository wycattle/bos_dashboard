//app\aggregates\page.tsx
"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AllxPage() {
  const { data, error, isLoading } = useSWR("/api/aggregates/allx", fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data.</div>;

  return (
    <main style={{ padding: 24 }}>
      <h1>Allx Table</h1>
      <table
        border={1}
        cellPadding={6}
        style={{ fontSize: 14, borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>WY_id</th>
            <th>status</th>
            <th>last_stop_date</th>
            <th>stop_calf_num</th>
            <th>last_calf_bdate</th>
            <th>last_calf_num</th>
            <th>days_milking</th>
            <th>i_calf_num</th>
            <th>i_date</th>
            <th>age_insem</th>
            <th>u_calf_num</th>
            <th>u_date</th>
            <th>u_read</th>
            <th>age_ultra</th>
            <th>expected_bdate</th>
            <th>exp_drydate</th>
            <th>i_check</th>
            <th>u_check1</th>
            <th>u_check2</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row: any) => (
              <tr key={row.WY_id}>
                <td>{row.WY_id}</td>
                <td>{row.status}</td>
                <td>{row.last_stop_date}</td>
                <td>{row.stop_calf_num}</td>
                <td>{row.last_calf_bdate}</td>
                <td>{row.last_calf_num}</td>
                <td>{row.days_milking}</td>
                <td>{row.i_calf_num}</td>
                <td>{row.i_date}</td>
                <td>{row.age_insem}</td>
                <td>{row.u_calf_num}</td>
                <td>{row.u_date}</td>
                <td>{row.u_read}</td>
                <td>{row.age_ultra}</td>
                <td>{row.expected_bdate}</td>
                <td>{row.exp_drydate}</td>
                <td>{row.i_check}</td>
                <td>{row.u_check1}</td>
                <td>{row.u_check2}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={19}>No data found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
