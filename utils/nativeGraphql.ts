import type { z } from "zod";
import { UpdateEntryOptionsSchema } from "./schemas.js";

const ANILIST_GRAPHQL_URL = "https://graphql.anilist.co";

type UpdateEntryOptions = z.infer<typeof UpdateEntryOptionsSchema>;

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string; status?: number }>;
};

const SAVE_MEDIA_LIST_ENTRY = `
  mutation SaveMediaListEntry(
    $id: Int
    $mediaId: Int
    $status: MediaListStatus
    $score: Float
    $progress: Int
    $progressVolumes: Int
    $repeat: Int
    $priority: Int
    $private: Boolean
    $notes: String
    $hiddenFromStatusLists: Boolean
    $customLists: [String]
    $advancedScores: [Float]
    $startedAt: FuzzyDateInput
    $completedAt: FuzzyDateInput
  ) {
    SaveMediaListEntry(
      id: $id
      mediaId: $mediaId
      status: $status
      score: $score
      progress: $progress
      progressVolumes: $progressVolumes
      repeat: $repeat
      priority: $priority
      private: $private
      notes: $notes
      hiddenFromStatusLists: $hiddenFromStatusLists
      customLists: $customLists
      advancedScores: $advancedScores
      startedAt: $startedAt
      completedAt: $completedAt
    ) {
      id
      mediaId
      status
      score
      progress
      progressVolumes
      repeat
      priority
      private
      notes
      hiddenFromStatusLists
      customLists
      advancedScores
      startedAt { year month day }
      completedAt { year month day }
    }
  }
`;

function definedVariables(
  entryId: number | undefined,
  mediaId: number | undefined,
  options: UpdateEntryOptions,
) {
  const variables: Record<string, unknown> = {};
  if (entryId !== undefined) variables.id = entryId;
  if (mediaId !== undefined) variables.mediaId = mediaId;

  for (const key of [
    "status",
    "score",
    "progress",
    "progressVolumes",
    "repeat",
    "priority",
    "private",
    "notes",
    "hiddenFromStatusLists",
    "customLists",
    "advancedScores",
    "startedAt",
    "completedAt",
  ] as const) {
    if (options[key] !== undefined) variables[key] = options[key];
  }

  return variables;
}

export async function saveMediaListEntry(
  token: string,
  entryId: number | undefined,
  mediaId: number | undefined,
  options: UpdateEntryOptions,
) {
  const response = await fetch(ANILIST_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: SAVE_MEDIA_LIST_ENTRY,
      variables: definedVariables(entryId, mediaId, options),
    }),
  });

  const body = (await response.json()) as GraphQLResponse<{
    SaveMediaListEntry: unknown;
  }>;
  const messages = body.errors
    ?.map((error) => error.message)
    .filter(Boolean)
    .join("; ");

  if (!response.ok || messages || !body.data?.SaveMediaListEntry) {
    throw new Error(
      `AniList GraphQL request failed (${response.status}): ${
        messages || "no mutation result returned"
      }`,
    );
  }

  return body.data.SaveMediaListEntry;
}
