// Copyright 2021 Adam Coldrick
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";
import headingId from "remark-heading-id";

// Path to the adventure files. Eventually this will be on a per-setting
// and/or per-campaign basis, but for now its hardcoded to `./adventures`.
// TODO(SotK): more variable adventure paths
const adventuresDirPath = path.join(process.cwd(), "adventures");

export async function getAllAdventures() {
  // Get subdirectory names. Each directory contains an adventure.
  const adventureNames = fs.readdirSync(adventuresDirPath);

  // Asynchronously parse the summary.md file for each adventure, and
  // eventually resolve the promise with an array of parsed adventure
  // summaries.
  const adventureSummariesPromise = Promise.all(
    adventureNames.map(async (id) => {
      const summaryPath = path.join(adventuresDirPath, id, "summary.md");
      const fileContents = fs.readFileSync(summaryPath, "utf8");
      const matterResult = matter(fileContents);

      const processedContent = await remark()
        .use(headingId)
        .use(html)
        .process(matterResult.content);
      const summary = processedContent.toString();

      return {
        id,
        summary,
        ...matterResult.data,
      };
    })
  );

  // Wait for parsing to complete, then return the array of adventure
  // summaries ordered by the `order` key in the summary.md frontmatter.
  const adventureSummaries = await adventureSummariesPromise;
  return adventureSummaries.sort((a, b) => {
    if (a.order > b.order) {
      return 1;
    } else {
      return -1;
    }
  });
}

// This function is expected to be used in a `getStaticPaths` function, hence
// the slightly weird structure of the return value
export function getAllSectionPaths() {
  // Get subdirectory names. Each directory contains an adventure.
  const adventureNames = fs.readdirSync(adventuresDirPath);

  // For each adventure, gather all the section names and populate
  // an array with either an object containing the adventure name
  // and section name for each section, or null.
  let adventurePaths = adventureNames.map((adventure) => {
    const sectionsPath = path.join(adventuresDirPath, adventure, "sections");
    if (fs.existsSync(sectionsPath)) {
      return fs.readdirSync(sectionsPath).map((section) => {
        return {
          params: {
            id: adventure,
            sectionId: section.replace(/\.md$/, ""),
          },
        };
      });
    } else {
      return null;
    }
  });

  // Filter out the null entries. This removes any adventures that
  // aren't broken down into sections.
  adventurePaths = adventurePaths.filter((entry) => {
    return entry != null;
  });

  return adventurePaths.flat();
}

async function parseMarkdown(markdownInput) {
  // Process any YAML frontmatter
  const matterResult = matter(markdownInput);

  // Process the actual markdown content
  const processedContent = await remark()
    .use(headingId)
    .use(html)
    .process(matterResult.content);

  return [matterResult.data, processedContent.toString()];
}

async function parseSection(sectionPath) {
  // Parse an adventure section. This reads the file at `sectionPath`
  // and passes its contents to the markdown parser.
  const fileContents = fs.readFileSync(sectionPath, "utf8");
  const [metadata, content] = await parseMarkdown(fileContents);
  return {
    content,
    ...metadata,
  };
}

export async function getAdventure(id) {
  // Parse the summary.md file for this adventure
  const fullPath = path.join(adventuresDirPath, `${id}/summary.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const [metadata, contentHtml] = await parseMarkdown(fileContents);

  // Parse each section in this adventure asynchronously, and then order
  // them based on the `order` key in the section's YAML frontmatter.
  const sectionsPath = path.join(adventuresDirPath, id, "sections");
  let sections = [];
  if (fs.existsSync(sectionsPath)) {
    sections = await Promise.all(
      fs.readdirSync(sectionsPath).map(async (section) => {
        const sectionId = section.replace(/\.md$/, "");
        const sectionPath = path.join(sectionsPath, section);
        const sectionData = await parseSection(sectionPath);
        return {
          id: sectionId,
          ...sectionData,
        };
      })
    );
    sections = sections.sort((a, b) => {
      if (a.order > b.order) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  return {
    id,
    contentHtml,
    sections,
    ...metadata,
  };
}
