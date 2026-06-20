import { JobCard } from "@components/jobs/JobCard";
import { getJobById } from "@lib/algolia/jobs";

/** Server component: fetches a single job by id then renders a JobCard. */
export async function JobCardById({ jobId }: { jobId: string }) {
  const job = await getJobById(jobId);
  if (!job) return null;
  return <JobCard job={job} />;
}
