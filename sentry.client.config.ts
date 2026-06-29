import { init } from "@sentry/nextjs";
import {
  PROFILES_SAMPLE_RATE,
  SAMPLE_RATE,
  SENTRY_IGNORE_ERRORS,
  TRACE_SAMPLE_RATE,
} from "@eden-ecommerce/lib/sentry";

init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_DATASET,
  tracesSampleRate: TRACE_SAMPLE_RATE,
  sampleRate: SAMPLE_RATE,
  profilesSampleRate: PROFILES_SAMPLE_RATE,
  debug: false,
  ignoreErrors: SENTRY_IGNORE_ERRORS,
});
