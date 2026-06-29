"use client";

import { isUserBeaconEnvConfigured } from "@lib/env-configured";
import { sendMvtTagManagerEvent } from "@lib/google-tag-manager/send-mvt-tag-manager-event";
import { getUserBeacon } from "@lib/user-beacon/get-user-beacon";
import { captureException } from "@sentry/nextjs";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type UserBeaconContextValue = {
  beaconFinished: boolean;
};

const UserBeaconContext = createContext<UserBeaconContextValue | undefined>(
  undefined,
);

type UserBeaconProviderProps = {
  children: ReactNode;
  enabledMVTTracking?: boolean;
};

export function UserBeaconProvider({
  children,
  enabledMVTTracking = false,
}: UserBeaconProviderProps) {
  const [beaconFinished, setBeaconFinished] = useState(false);

  useEffect(() => {
    if (!isUserBeaconEnvConfigured()) {
      return;
    }

    getUserBeacon(enabledMVTTracking)
      .then(() => setBeaconFinished(true))
      .then(() => {
        if (!enabledMVTTracking) {
          return;
        }

        return sendMvtTagManagerEvent();
      })
      .catch((error: unknown) => captureException(error));
  }, [enabledMVTTracking]);

  return (
    <UserBeaconContext.Provider value={{ beaconFinished }}>
      {children}
    </UserBeaconContext.Provider>
  );
}

export function useUserBeaconContext(): UserBeaconContextValue {
  const context = useContext(UserBeaconContext);

  if (context === undefined) {
    throw new Error(
      "useUserBeaconContext must be used inside UserBeaconProvider",
    );
  }

  return context;
}
