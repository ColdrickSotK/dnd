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
import { getAllAdventures } from "../lib/adventures";

export async function getStaticProps() {
  const adventures = await getAllAdventures();
  return {
    props: {
      adventures,
    },
  };
}

export default function Home({ adventures }) {
  return (
    <div className="">
      <Head>
        <title>D&D 5e Oneshots</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid grid-cols-4 mb-20">
        <h1 className="col-span-3 col-start-2 pt-16 pb-20 text-6xl">
          Adventures in the Foran Empire
        </h1>

        <section className="col-span-3 col-start-2">
          <p className="max-w-2xl mb-16 prose">
            This is a loosely connected set of 3-4 hour adventures that take
            place in the same world in the same time period. They're all
            self-contained enough to be run as one-shots, whilst having enough
            shared context that they can work as entries in an episodic
            campaign.
          </p>
          <ul>
            {adventures.map((adventure) => (
              <li className="pb-10">
                <div>
                  <Link href={`adventures/${adventure.id}/overview`}>
                    <h2 className="pb-2 text-2xl font-semibold text-red-700 cursor-pointer hover:underline">
                      {adventure.title}
                    </h2>
                  </Link>
                  <div
                    className="max-w-2xl prose"
                    dangerouslySetInnerHTML={{ __html: adventure.summary }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className=""></footer>
    </div>
  );
}
