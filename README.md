# SotK's D&D Adventures

This is a collection of Dungeons and Dragons 5e adventures, mostly in the
form of GM planning notes for now. These can all be run as one-shot adventures
with no previous context needed, or as connected adventures in an episodic
campaign.

This repo also contains a Next.js app which renders the notes for a pleasant
browsing experience. It is live at https://dnd.sotk.co.uk/.

All the code in this project is licensed under the [Apache-2.0 License][0], and
the adventures and any related art are licensed [CC-BY-SA 4.0][1].

[0]: https://www.apache.org/licenses/LICENSE-2.0
[1]: https://creativecommons.org/licenses/by-sa/4.0/

## Running locally

The app can be run locally using Node.

```shell
npm run dev
```

By default the dev server will be running on http://localhost:3000.

The app is a pretty simple Next.js app, the root page can be modified in
`pages/index.js`. This isn't a tutorial for writing Next.js apps, take
a look at [the documentation][2] to learn how things work properly.

[2]: https://nextjs.org/docs

## Adding content

To add a new adventure, create a new directory inside the `adventures`
directory named with whatever you want the URL slug for your adventure
to be. Lets say we're adding an adventure called `Lord Dumont's Disappearance`,

```shell
mkdir adventures/lord-dumonts-disappearance
```

Inside that directory, create a `sections` subdirectory and a `summary.md`
file.

```shell
mkdir adventures/lord-dumonts-disappearance/sections
touch adventures/lord-dumonts-disappearance/summary.md
```

This `summary.md` file needs to contain at least some basic metadata, and
ideally some markdown content summarising the concept of the adventure.

The format looks like this, with all keys in the frontmatter required.

```markdown
---
title: Lord Dumont's Disappearance
updated: 2021-12-14
order: 10
---

Lord Dumont has disappeared, along with his entire family. Thankfully, the
Ealdormen of Isle Dumont are largely competent folks, and the general
running of the place hasn't been affected.

Some of the populace are a bit concerned however, and rewards for information
have been posted around the towns. Lord Dumont was a relatively popular
figure, so public opinion is a bit confused about what caused this.
```

Finally, add an `overview.md` file to the `sections` subdirectory. This will
produce the "landing page" for your adventure, so a good few paragraphs
setting the scene will go well here. If you're feeling lazy, it can also just
be very similar to the summary.

The format looks like this, with the `subsections` key in the frontmatter
optional but the others required.

```markdown
---
title: Overview
order: 1
subsections:
  - title: Starting Situation
    anchor: starting-situation
---

## Overview

Lord Dumont has disappeared, along with his entire family. Thankfully, the
Ealdormen of Isle Dumont are largely competent folks, and the general
running of the place hasn't been affected.

Some of the populace are a bit concerned however, and rewards for information
have been posted around the towns. Lord Dumont was a relatively popular
figure, so public opinion is a bit confused about what caused this.

### Starting Situation {#starting-situation}

The party has entered a tavern in the town of Crowvale on the mainland. There's
a poster about the missing Lord on the wall, and in short order they'll be
confronted by a group of fishermen who don't like to see their sort around here.
```

Note the seemingly extra `#` for each header, that helps keep the heading
hierarchy in the rendered page sensible, since `<h1>` is taken up by the
actual adventure name.

The elements in the `subsections` list in the frontmatter will show up in
the contents sidebar, with the optional anchor making them clickable and
linkable. Note that the anchor needs to be manually included on a relevant
heading.

Further sections in the adventure follow the same format, with the `order`
key in the frontmatter being used to arrange them in the contents sidebar.
