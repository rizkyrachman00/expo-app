const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const getVisitLogs = async (token: string | null): Promise<any[]> => {
  if (!token) throw new Error("Token tidak tersedia");

  const response = await fetch(`${API_BASE_URL}/visit-logs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Gagal mengambil data visit log");
  }

  return json;
};
