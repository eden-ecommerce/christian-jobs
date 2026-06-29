"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSettingsQueryOptions } from "@hooks/settings/get-options";
import { settingsKeys } from "@hooks/settings/get-key";
import { updateSettings } from "@hooks/settings/fetch-settings";
import type { SettingsApiResponse } from "@lib/settings.schema";

export function useSettings() {
  return useQuery(getSettingsQueryOptions());
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SettingsApiResponse) => updateSettings(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
}
