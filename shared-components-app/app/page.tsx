import { readFile } from "fs/promises";
import { join } from "path";

const getSharedExportNames = async () => {
  const componentIndexPath = join(
    process.cwd(),
    "..",
    "shared",
    "src",
    "components",
    "index.ts"
  );
  const fileContent = await readFile(componentIndexPath, "utf-8");

  return fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("export *"))
    .map((line) => line.replace(/^export \* from\s+['\"](.*)['\"];?$/, "$1"))
    .sort((left, right) => left.localeCompare(right));
};

export default async function HomePage() {
  const sharedExportNames = await getSharedExportNames();

  return (
    <main className="page">
      <h1>Shared Components Boilerplate</h1>
      <p>
        This page reads the shared component index and lists every exported
        shared component module.
      </p>
      <p className="count">Total exports in use: {sharedExportNames.length}</p>
      <ul>
        {sharedExportNames.map((exportName) => (
          <li key={exportName}>{exportName}</li>
        ))}
      </ul>
    </main>
  );
}
