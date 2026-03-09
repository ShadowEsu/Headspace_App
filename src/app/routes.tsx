import { createBrowserRouter } from "react-router";
import { Onboarding } from "./components/onboarding";
import { Home } from "./components/home";
import { LiveSession } from "./components/live-session";
import { WeeklyReport } from "./components/weekly-report";
import { GroupMode } from "./components/group-mode";
import { Interventions } from "./components/interventions";
import { Safeguards } from "./components/safeguards";
import { WearableWidget } from "./components/wearable-widget";
import { EnvironmentRadar } from "./components/environment-radar";
import { HospitalSearch } from "./components/hospital-search";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Onboarding,
  },
  {
    path: "/home",
    Component: Home,
  },
  {
    path: "/live-session",
    Component: LiveSession,
  },
  {
    path: "/weekly-report",
    Component: WeeklyReport,
  },
  {
    path: "/group",
    Component: GroupMode,
  },
  {
    path: "/interventions",
    Component: Interventions,
  },
  {
    path: "/safeguards",
    Component: Safeguards,
  },
  {
    path: "/widget",
    Component: WearableWidget,
  },
  {
    path: "/environment-radar",
    Component: EnvironmentRadar,
  },
  {
    path: "/hospitals",
    Component: HospitalSearch,
  },
]);
