import { Device } from "@/types/device";

export async function apiFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

// ========== Device APIs ==========

export async function getDevices(): Promise<Device[]> {
  const json = await apiFetch("/device");
  return json.data || [];
}

export async function deleteDevice(id: number) {
  return apiFetch(`/device/${id}`, { method: "DELETE" });
}

export async function deleteDevices(ids: number[]) {
  return apiFetch(`/device/delete`, {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}

export async function toggleDeviceStatus(id: number) {
  return apiFetch(`/device/${id}/active`, { method: "PATCH" });
}
