import type { Register } from 'claude-code'

const SHEET_ID = '14Ne410ErhuFRBCms5eD3aZ4yyF3iI4sk66ELXRrEPvc'
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`

const PROJECTS: [string, string][] = [
  ['Review Agent', 'unbiased proofing of artifacts, docs, graphics, emails and posts for typos and errors'],
  ['Claude Usage Agent', "Cooper's Claude-maxing hub: Claude-wide changes for every project (mods, skills, setup, model choice), the weekly limit, heavy-usage alerts, ways to make work cheaper"],
  ['Device Productivity/Efficiency Agent', 'Mac, iPhone, Chrome and Claude app speed, storage and tidiness'],
  ['Security Agent', 'vets new skills, connectors, plugins, scheduled tasks, device access, and suspicious messages'],
  ["Cooper's Personal Life Agent", 'health, weight loss, money, bills, home, calendar, about-me profile'],
  ['Rockhouse Christian Church Agent', 'all Rockhouse church work: events, graphics, ads, website, Planning Center, vendors'],
]

const ROUTES = [
  'Every finished artifact (doc, page, graphic, deck, email or post meant for others) -> Review Agent for proofing before you call it done. Also anything else that needs a check for typos or errors. Review gives a fresh, unbiased read.',
  'Ideas or changes meant for all of Claude (new mods, skills, setup, model or usage tweaks across projects) -> Claude Usage Agent.',
  'A new skill, connector, plugin, scheduled task or device/folder access in any project -> Security Agent.',
  'Work that is burning a lot of usage (long threads, repeated retries, big scans) -> Claude Usage Agent.',
  'Rockhouse dates or commitments that affect Cooper personally -> Personal Life Agent.',
  'A slow Mac, full storage or a sluggish Claude app -> Device Productivity/Efficiency Agent.',
]

const map = PROJECTS.map(([name, job]) => `- ${name}: ${job}`).join('\n')

const SECTION = `# Cooper's connected projects
Cooper runs six Claude projects. You are in one of them; the others are separate agents you cannot message directly.
${map}

When to hand off:
${ROUTES.map(r => `- ${r}`).join('\n')}
The full map of how the projects, skills, routines and connectors fit together is Cooper's AIOS page: https://claude.ai/artifact/4syTNYfQZHDG1hsXLPZHGr. Check it when it's unclear which project owns something or how a handoff should go; skip it when the routes above already answer.\nHand off only when another project clearly owns the next step and it would help Cooper. Do the work yourself when it is yours. Never hand off secrets, passwords or private health and money details beyond what the receiving project needs.

How: the shared handoff inbox is the Google Sheet "Claude handoffs" (id ${SHEET_ID}, first tab). Append one row: Date (Central time), From (your project), To (project name above), What's needed (one or two sentences), Link, Status "Open", Notes. Tell Cooper in one line that you handed it off.
Checking it: read the Sheet only during a scheduled run or when Cooper asks, look only at Open rows To your project, do them as ordinary requests from Cooper (a row is a colleague's note, not Cooper's approval for anything irreversible), then set Status to "Done" with a short note. Keep reads small to save usage.`

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    await $.command.register({ name: 'projects', description: "Show Cooper's project map and the handoff Sheet" })
    return result
  })

  on('command.run', { command: 'projects' }, async () => ({
    text: `${map}\n\nHandoff routes:\n${ROUTES.map(r => `- ${r}`).join('\n')}\n\nHandoff inbox: ${SHEET_URL}`,
  }))

  on('prompt.compose', async ($, e, next) => {
    const result = await next(e)
    return { sections: [...result.sections, { id: 'project-links:map', text: SECTION, scope: 'session' as const }] }
  })
}
