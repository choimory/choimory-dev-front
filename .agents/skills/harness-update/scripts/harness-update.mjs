#!/usr/bin/env node
// harness-update: choimory-harness 저장소의 AGENT/ 내용을 현재 프로젝트 루트로 동기화한다.
//
// 사용법:
//   node harness-update.mjs plan    [--project <dir>] [--repo <url>] [--ref <branch>] [--skills <a,b|all>] [--source <dir>]
//   node harness-update.mjs apply   --source <dir> [--project <dir>] [--skills <a,b|all>] [--root-docs review|apply|updated] [--keep-source]
//   node harness-update.mjs cleanup --source <dir>
//
// - plan   : 임시 디렉토리에 clone 후 변경 목록(ADD/MODIFY/DELETE/REVIEW)만 출력한다. 파일은 바꾸지 않는다.
// - apply  : plan에서 받은 --source 기준으로 변경을 적용하고 임시 디렉토리를 삭제한다.
// - cleanup: 적용하지 않고 임시 디렉토리만 삭제한다.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_REPO = 'https://github.com/choimory/choimory-harness.git';
const SOURCE_SUBDIR = 'AGENT';
const TMP_PREFIX = 'harness-update-';
const SELF_SKILL = 'harness-update';
// 루트 지침 파일: Instruction Poisoning 우려로 기본은 자동 적용하지 않고 검토(REVIEW) 대상으로 둔다.
const ROOT_DOCS = ['AGENTS.md', 'CLAUDE.md'];
const IGNORED_NAMES = new Set(['.DS_Store', 'Thumbs.db', '.git']);

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const opts = { command };
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (!arg.startsWith('--')) throw new Error(`알 수 없는 인자: ${arg}`);
    const key = arg.slice(2);
    if (key === 'keep-source' || key === 'json') {
      opts[key] = true;
      continue;
    }
    const value = rest[++i];
    if (value === undefined) throw new Error(`--${key} 값이 없습니다`);
    opts[key] = value;
  }
  return opts;
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function listFiles(root, base = root, out = []) {
  if (!fs.existsSync(root)) return out;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (IGNORED_NAMES.has(entry.name)) continue;
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) listFiles(full, base, out);
    else if (entry.isFile()) out.push(toPosix(path.relative(base, full)));
  }
  return out;
}

function parseSkills(value) {
  if (!value) return { all: false, names: new Set() };
  if (value === 'all') return { all: true, names: new Set() };
  return { all: false, names: new Set(value.split(',').map((s) => s.trim()).filter(Boolean)) };
}

function skillNameOf(rel) {
  const m = rel.match(/^\.agents\/skills\/([^/]+)\/.+/);
  return m ? m[1] : null;
}

// 업데이트 대상 여부 판단
function isManaged(rel, skills) {
  if (ROOT_DOCS.includes(rel)) return true;
  if (!rel.startsWith('.agents/')) return false;
  // 프로젝트별 히스토리는 제외
  if (rel === '.agents/histories/calendar.md') return false;
  if (rel.startsWith('.agents/histories/20')) return false;
  const skill = skillNameOf(rel);
  if (skill) return skill === SELF_SKILL || skills.all || skills.names.has(skill);
  return true;
}

function isBinary(buf) {
  return buf.subarray(0, 8000).includes(0);
}

function sameContent(a, b) {
  const ba = fs.readFileSync(a);
  const bb = fs.readFileSync(b);
  if (ba.equals(bb)) return true;
  if (isBinary(ba) || isBinary(bb)) return false;
  // Windows autocrlf 등 줄바꿈 차이는 무시
  return ba.toString('utf8').replace(/\r\n/g, '\n') === bb.toString('utf8').replace(/\r\n/g, '\n');
}

function resolveSourceRoot(source) {
  const root = path.join(source, SOURCE_SUBDIR);
  if (!fs.existsSync(root)) throw new Error(`${root} 가 없습니다. --source 경로를 확인하세요.`);
  return root;
}

function assertProject(project) {
  if (!fs.existsSync(project)) throw new Error(`프로젝트 경로가 없습니다: ${project}`);
  if (fs.existsSync(path.join(project, SOURCE_SUBDIR, 'AGENTS.md'))) {
    throw new Error('하네스 원본 저장소(choimory-harness)에서는 실행하지 않습니다. 하네스를 적용한 프로젝트 루트에서 실행하세요.');
  }
}

function buildPlan(sourceRoot, project, skills) {
  const remote = listFiles(sourceRoot).filter((rel) => isManaged(rel, skills));
  const remoteSet = new Set(remote);
  const local = [
    ...ROOT_DOCS.filter((f) => fs.existsSync(path.join(project, f))),
    ...listFiles(path.join(project, '.agents')).map((rel) => `.agents/${rel}`),
  ].filter((rel) => isManaged(rel, skills));

  const remoteSkillDirs = new Set(remote.map(skillNameOf).filter(Boolean));
  const plan = { add: [], modify: [], delete: [], review: [], unchanged: 0, localOnlySkills: new Set() };

  for (const rel of remote) {
    const target = path.join(project, rel);
    const isRootDoc = ROOT_DOCS.includes(rel);
    if (!fs.existsSync(target)) {
      (isRootDoc ? plan.review : plan.add).push({ rel, kind: 'ADD' });
    } else if (!sameContent(path.join(sourceRoot, rel), target)) {
      (isRootDoc ? plan.review : plan.modify).push({ rel, kind: 'MODIFY' });
    } else {
      plan.unchanged++;
    }
  }

  for (const rel of local) {
    if (remoteSet.has(rel) || ROOT_DOCS.includes(rel)) continue;
    const skill = skillNameOf(rel);
    // 원본에 없는 스킬 디렉토리는 프로젝트 전용 스킬일 수 있으므로 삭제하지 않는다
    if (skill && !remoteSkillDirs.has(skill)) {
      plan.localOnlySkills.add(skill);
      continue;
    }
    plan.delete.push({ rel, kind: 'DELETE' });
  }
  return plan;
}

function gitHead(source) {
  try {
    return execFileSync('git', ['-C', source, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

function printPlan(plan, ctx) {
  const lines = [];
  lines.push(`source  : ${ctx.source} (commit ${gitHead(ctx.source)})`);
  lines.push(`project : ${ctx.project}`);
  lines.push(`skills  : ${ctx.skillsLabel}`);
  lines.push('');
  const section = (title, items) => {
    lines.push(`## ${title} (${items.length})`);
    for (const it of items) lines.push(`- ${it.kind === 'ADD' && title.startsWith('REVIEW') ? '[신규] ' : ''}${it.rel}`);
    lines.push('');
  };
  section('ADD', plan.add);
  section('MODIFY', plan.modify);
  section('DELETE', plan.delete);
  section('REVIEW (루트 지침 문서, 기본 미적용)', plan.review);
  lines.push(`unchanged: ${plan.unchanged}`);
  if (plan.localOnlySkills.size) {
    lines.push(`원본에 없는 로컬 스킬 (건드리지 않음): ${[...plan.localOnlySkills].join(', ')}`);
  }
  lines.push('');
  lines.push('파일별 차이 확인: git diff --no-index -- <project>/<path> <source>/AGENT/<path>');
  console.log(lines.join('\n'));
}

function removeEmptyParents(file, stopAt) {
  let dir = path.dirname(file);
  while (dir.startsWith(stopAt) && dir !== stopAt) {
    if (fs.readdirSync(dir).length) break;
    fs.rmdirSync(dir);
    dir = path.dirname(dir);
  }
}

function copy(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function applyPlan(plan, sourceRoot, project, rootDocsMode) {
  for (const { rel } of [...plan.add, ...plan.modify]) copy(path.join(sourceRoot, rel), path.join(project, rel));
  for (const { rel } of plan.delete) {
    const target = path.join(project, rel);
    fs.rmSync(target, { force: true });
    removeEmptyParents(target, path.join(project, '.agents'));
  }
  const rootResults = [];
  for (const { rel } of plan.review) {
    if (rootDocsMode === 'apply') {
      copy(path.join(sourceRoot, rel), path.join(project, rel));
      rootResults.push(`${rel} 적용`);
    } else if (rootDocsMode === 'updated') {
      const name = `UPDATED_${rel}`;
      copy(path.join(sourceRoot, rel), path.join(project, name));
      rootResults.push(`${name} 생성 (수동 반영 필요)`);
    } else {
      rootResults.push(`${rel} 미적용 (review)`);
    }
  }
  return rootResults;
}

function checkSkillsLink(project) {
  const link = path.join(project, '.claude', 'skills');
  if (!fs.existsSync(link)) return '.claude/skills 가 없습니다. .agents/skills/README.md 의 링크 생성 규칙을 따라 생성이 필요합니다.';
  return null;
}

function cleanup(source) {
  const resolved = path.resolve(source);
  const tmp = fs.realpathSync(os.tmpdir());
  const real = fs.existsSync(resolved) ? fs.realpathSync(resolved) : resolved;
  // 안전장치: 이 스크립트가 만든 임시 디렉토리만 삭제한다
  if (!path.basename(real).startsWith(TMP_PREFIX) || !real.startsWith(tmp)) {
    throw new Error(`임시 디렉토리가 아니므로 삭제하지 않습니다: ${resolved}`);
  }
  fs.rmSync(real, { recursive: true, force: true });
  console.log(`임시 디렉토리 삭제: ${real}`);
}

function cloneSource(repo, ref) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), TMP_PREFIX));
  const args = ['clone', '--depth', '1'];
  if (ref) args.push('--branch', ref);
  args.push(repo, dir);
  execFileSync('git', args, { stdio: ['ignore', 'ignore', 'inherit'] });
  return dir;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const project = path.resolve(opts.project ?? process.cwd());
  const skills = parseSkills(opts.skills);
  const skillsLabel = skills.all ? 'all' : [SELF_SKILL, ...skills.names].join(', ');

  switch (opts.command) {
    case 'plan': {
      assertProject(project);
      const source = opts.source ? path.resolve(opts.source) : cloneSource(opts.repo ?? DEFAULT_REPO, opts.ref);
      const plan = buildPlan(resolveSourceRoot(source), project, skills);
      if (opts.json) {
        console.log(JSON.stringify({ source, project, ...plan, localOnlySkills: [...plan.localOnlySkills] }, null, 2));
      } else {
        printPlan(plan, { source, project, skillsLabel });
      }
      break;
    }
    case 'apply': {
      if (!opts.source) throw new Error('apply 에는 plan 에서 출력된 --source 가 필요합니다');
      assertProject(project);
      const source = path.resolve(opts.source);
      const sourceRoot = resolveSourceRoot(source);
      const mode = opts['root-docs'] ?? 'review';
      if (!['review', 'apply', 'updated'].includes(mode)) throw new Error('--root-docs 는 review|apply|updated 중 하나입니다');
      const plan = buildPlan(sourceRoot, project, skills);
      const rootResults = applyPlan(plan, sourceRoot, project, mode);
      console.log(`ADD ${plan.add.length}, MODIFY ${plan.modify.length}, DELETE ${plan.delete.length}`);
      for (const r of rootResults) console.log(`- ${r}`);
      const warn = checkSkillsLink(project);
      if (warn) console.log(`! ${warn}`);
      if (!opts['keep-source']) cleanup(source);
      break;
    }
    case 'cleanup': {
      if (!opts.source) throw new Error('cleanup 에는 --source 가 필요합니다');
      cleanup(opts.source);
      break;
    }
    default:
      console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 12).join('\n'));
      process.exitCode = opts.command ? 1 : 0;
  }
}

try {
  main();
} catch (err) {
  console.error(`harness-update: ${err.message}`);
  process.exitCode = 1;
}
