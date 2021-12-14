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

import Head from "next/head";
import Link from "next/link";
import { getAllSectionPaths, getAdventure } from "../../../lib/adventures";

export default function Section({ adventure, section }) {
  return (
    <div>
      <Head>
        <title>{adventure.title}</title>
      </Head>
      <div className="grid grid-cols-4 mb-20">
        <div className="flex items-center justify-end px-12">
          <Link href="/">
            <div className="p-6 text-red-700 rounded-full cursor-pointer hover:text-red-900 hover:bg-red-50">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </div>
          </Link>
        </div>
        <h1 className="col-span-3 pt-16 pb-20 text-6xl">{adventure.title}</h1>
        <div className="relative px-12 text-right">
          <ul className="sticky top-10">
            {adventure.sections.map((s) => (
              <>
                <Link href={`/adventures/${adventure.id}/${s.id}`}>
                  <li
                    className={
                      "w-full px-6 py-2 border-r-2 font-semibold cursor-pointer hover:bg-red-50 hover:text-red-900 " +
                      (section.id === s.id
                        ? "text-red-900 bg-red-50 border-red-700"
                        : "text-red-700")
                    }
                  >
                    <p>{s.title}</p>
                  </li>
                </Link>
                {section.id === s.id &&
                  s.subsections?.map((subsection) => (
                    <Link
                      href={`/adventures/${adventure.id}/${s.id}#${subsection.anchor}`}
                    >
                      <li className="px-6 py-1 text-sm font-normal text-red-900 border-r-2 border-red-700 cursor-pointer hover:bg-yellow-50">
                        {subsection.title}
                      </li>
                    </Link>
                  ))}
              </>
            ))}
          </ul>
        </div>
        <div className="col-span-3">
          <div
            className="max-w-2xl prose"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = getAllSectionPaths();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const adventure = await getAdventure(params.id);
  const section = adventure.sections.find((entry) => {
    return entry.id === params.sectionId;
  });
  return {
    props: {
      adventure,
      section,
    },
  };
}
