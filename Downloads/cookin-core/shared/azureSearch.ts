import { AzureKeyCredential, SearchClient } from "@azure/search-documents";

/**
 * Azure Cognitive Search Setup — powered by Azure's semantic + keyword hybrid search.
 * 
 * Requires the following environment variables:
 * - AZURE_SEARCH_ENDPOINT (e.g. https://yournamespace.search.windows.net)
 * - AZURE_SEARCH_KEY (admin key or query key)
 * - AZURE_SEARCH_INDEX (name of your search index, e.g. supersal-index)
 */

const endpoint = process.env.AZURE_SEARCH_ENDPOINT!;
const apiKey = process.env.AZURE_SEARCH_KEY!;
const indexName = process.env.AZURE_SEARCH_INDEX!;

if (!endpoint || !apiKey || !indexName) {
  throw new Error("Missing one or more Azure Search env variables.");
}

const client = new SearchClient(
  endpoint,
  indexName,
  new AzureKeyCredential(apiKey)
);

export interface AzureSearchResult {
  text: string;
  score: number;
  source?: string;
  id?: string;
}

/**
 * Runs a hybrid semantic + keyword search against Azure Cognitive Search.
 * Optionally supports OData filters (e.g. "companion eq 'EbyTech'")
 * 
 * @param query The user’s question or input string
 * @param filter Optional OData filter string (e.g., "companion eq 'Athena'")
 * @returns Top 5 matching search results from the index
 */
export async function searchAzure(query: string, filter?: string): Promise<AzureSearchResult[]> {
  const searchResults = await client.search(query, {
    queryType: "semantic",
    semanticConfiguration: "default", // Define in your index
    top: 5,
    queryLanguage: "en-us",
    searchFields: ["content", "title"],
    filter,
    queryCaption: "extractive",
    queryAnswer: "extractive"
  });

  const output: AzureSearchResult[] = [];

  for await (const result of searchResults.results) {
    output.push({
      text: result.document.content ?? "",
      score: result.score ?? 0,
      source: result.document.source ?? "",
      id: result.document.id ?? undefined,
    });
  }

  return output;
}
