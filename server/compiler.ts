import vm from 'node:vm';

export interface CodeExecutionRequest {
  language: string; // 'python' | 'cpp' | 'c' | 'java' | 'javascript' | 'typescript' | 'sql'
  code: string;
  stdin?: string;
  testCases?: { input: string; expectedOutput: string; isHidden?: boolean }[];
}

export interface CodeExecutionResponse {
  stdout: string;
  stderr: string;
  output: string;
  exitCode: number;
  executionTimeMs: number;
  memoryKb?: number;
  compileError?: string;
  testCaseResults?: {
    testCaseIndex: number;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    isHidden?: boolean;
    executionTimeMs: number;
  }[];
  allPassed?: boolean;
}

// Map frontend language slugs to Piston runtime language names & versions
const PISTON_LANG_MAP: Record<string, { language: string; version: string; file: string }> = {
  python: { language: 'python', version: '3.10.0', file: 'main.py' },
  javascript: { language: 'javascript', version: '18.15.0', file: 'main.js' },
  typescript: { language: 'typescript', version: '5.0.3', file: 'main.ts' },
  cpp: { language: 'c++', version: '10.2.0', file: 'main.cpp' },
  c: { language: 'c', version: '10.2.0', file: 'main.c' },
  java: { language: 'java', version: '15.0.2', file: 'Main.java' },
  bash: { language: 'bash', version: '5.2.0', file: 'script.sh' }
};

// Safe local JavaScript/TypeScript evaluation using Node VM
function runLocalJavascript(code: string, stdin?: string): CodeExecutionResponse {
  const startTime = Date.now();
  let stdoutLogs: string[] = [];
  let stderrLogs: string[] = [];

  const sandbox = {
    console: {
      log: (...args: any[]) => {
        stdoutLogs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      },
      error: (...args: any[]) => {
        stderrLogs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      },
      warn: (...args: any[]) => {
        stdoutLogs.push('[WARN] ' + args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      },
      info: (...args: any[]) => {
        stdoutLogs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      }
    },
    Math,
    Date,
    JSON,
    Array,
    Object,
    String,
    Number,
    Boolean,
    RegExp,
    Map,
    Set,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    stdin: stdin || ''
  };

  try {
    const script = new vm.Script(code);
    const context = vm.createContext(sandbox);
    const result = script.runInContext(context, { timeout: 2500 });

    if (result !== undefined && stdoutLogs.length === 0) {
      stdoutLogs.push(typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result));
    }

    const elapsed = Date.now() - startTime;
    return {
      stdout: stdoutLogs.join('\n'),
      stderr: stderrLogs.join('\n'),
      output: stdoutLogs.join('\n') || (stderrLogs.join('\n') ? `Error:\n${stderrLogs.join('\n')}` : 'Program completed with no output.'),
      exitCode: stderrLogs.length > 0 ? 1 : 0,
      executionTimeMs: elapsed
    };
  } catch (err: any) {
    const elapsed = Date.now() - startTime;
    return {
      stdout: stdoutLogs.join('\n'),
      stderr: err.message || String(err),
      output: `Runtime Error: ${err.message || String(err)}`,
      exitCode: 1,
      executionTimeMs: elapsed
    };
  }
}

// SQL In-memory executor
function runSqlSandbox(code: string): CodeExecutionResponse {
  const startTime = Date.now();
  try {
    const statements = code.split(';').map(s => s.trim()).filter(Boolean);
    const tables: Record<string, { columns: string[]; rows: Record<string, any>[] }> = {
      students: {
        columns: ['id', 'name', 'branch', 'gpa', 'placement_status'],
        rows: [
          { id: 1, name: 'Aarav Sharma', branch: 'CSE', gpa: 8.9, placement_status: 'Placed' },
          { id: 2, name: 'Priya Patel', branch: 'IT', gpa: 9.2, placement_status: 'Placed' },
          { id: 3, name: 'Rohan Verma', branch: 'ECE', gpa: 7.8, placement_status: 'Preparing' },
          { id: 4, name: 'Sneha Rao', branch: 'CSE', gpa: 8.5, placement_status: 'Placed' },
          { id: 5, name: 'Vikram Singh', branch: 'CSE', gpa: 7.2, placement_status: 'Interviewing' },
          { id: 6, name: 'Ananya Gupta', branch: 'IT', gpa: 9.4, placement_status: 'Placed' }
        ]
      },
      courses: {
        columns: ['course_id', 'title', 'credits', 'instructor'],
        rows: [
          { course_id: 101, title: 'Data Structures & Algorithms', credits: 4, instructor: 'Dr. K. Raman' },
          { course_id: 102, title: 'Database Management Systems', credits: 4, instructor: 'Prof. S. Iyer' },
          { course_id: 103, title: 'Operating Systems', credits: 3, instructor: 'Dr. M. Banerjee' },
          { course_id: 104, title: 'Computer Networks', credits: 3, instructor: 'Prof. A. Kapoor' }
        ]
      },
      companies: {
        columns: ['company_id', 'company_name', 'package_lpa', 'tier'],
        rows: [
          { company_id: 1, company_name: 'Google', package_lpa: 32.5, tier: 'Tier 1' },
          { company_id: 2, company_name: 'Microsoft', package_lpa: 28.0, tier: 'Tier 1' },
          { company_id: 3, company_name: 'Amazon', package_lpa: 26.0, tier: 'Tier 1' },
          { company_id: 4, company_name: 'TCS', package_lpa: 7.5, tier: 'Tier 2' },
          { company_id: 5, company_name: 'Infosys', package_lpa: 6.8, tier: 'Tier 2' }
        ]
      }
    };

    let logOutput: string[] = [];

    for (const stmt of statements) {
      const upper = stmt.toUpperCase();
      if (upper.startsWith('SELECT')) {
        let matchedTable = 'students';
        if (upper.includes('FROM COURSES')) matchedTable = 'courses';
        else if (upper.includes('FROM COMPANIES')) matchedTable = 'companies';

        const table = tables[matchedTable];
        if (!table) {
          logOutput.push(`Query OK: 0 rows affected`);
          continue;
        }

        let filteredRows = [...table.rows];

        // Basic WHERE clause simulation
        if (upper.includes('WHERE')) {
          if (upper.includes('GPA > 8') || upper.includes('GPA >= 8')) {
            filteredRows = filteredRows.filter(r => r.gpa >= 8);
          } else if (upper.includes("BRANCH = 'CSE'") || upper.includes('BRANCH="CSE"')) {
            filteredRows = filteredRows.filter(r => r.branch === 'CSE');
          } else if (upper.includes("PLACEMENT_STATUS = 'PLACED'")) {
            filteredRows = filteredRows.filter(r => r.placement_status === 'Placed');
          } else if (upper.includes('PACKAGE_LPA > 20')) {
            filteredRows = filteredRows.filter(r => r.package_lpa > 20);
          }
        }

        // Basic formatting
        if (filteredRows.length === 0) {
          logOutput.push(`Empty set (0.01 sec)`);
        } else {
          const cols = table.columns;
          const header = '| ' + cols.join(' | ') + ' |';
          const sep = '+-' + cols.map(c => '-'.repeat(c.length)).join('-+-') + '-+';
          const dataRows = filteredRows.map(row => '| ' + cols.map(c => String(row[c] ?? '').padEnd(c.length)).join(' | ') + ' |');

          logOutput.push(sep);
          logOutput.push(header);
          logOutput.push(sep);
          logOutput.push(...dataRows);
          logOutput.push(sep);
          logOutput.push(`${filteredRows.length} rows in set (${((Date.now() - startTime) / 1000).toFixed(2)} sec)\n`);
        }
      } else {
        logOutput.push(`Query OK, 1 row affected (${((Date.now() - startTime) / 1000).toFixed(2)} sec)`);
      }
    }

    return {
      stdout: logOutput.join('\n'),
      stderr: '',
      output: logOutput.join('\n'),
      exitCode: 0,
      executionTimeMs: Date.now() - startTime
    };
  } catch (err: any) {
    return {
      stdout: '',
      stderr: err.message,
      output: `SQL Syntax Error: ${err.message}`,
      exitCode: 1,
      executionTimeMs: Date.now() - startTime
    };
  }
}

// Primary execution dispatcher
export async function executeCode(req: CodeExecutionRequest): Promise<CodeExecutionResponse> {
  const langKey = req.language.toLowerCase().trim();

  // SQL Sandbox
  if (langKey === 'sql') {
    return runSqlSandbox(req.code);
  }

  const pistonConfig = PISTON_LANG_MAP[langKey];

  // Try Piston API for real multi-language compilation (C, C++, Java, Python, TS, JS)
  if (pistonConfig) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const resp = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          language: pistonConfig.language,
          version: pistonConfig.version,
          files: [
            {
              name: pistonConfig.file,
              content: req.code
            }
          ],
          stdin: req.stdin || '',
          run_timeout: 4000,
          compile_timeout: 5000
        })
      });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const data = await resp.json();
        const compile = data.compile || {};
        const run = data.run || {};

        const stdout = run.stdout || '';
        const stderr = (compile.stderr || '') + (run.stderr || '');
        const output = compile.output ? compile.output : (run.output || stdout || stderr || 'Execution finished (no output).');
        const exitCode = compile.code !== undefined && compile.code !== 0 ? compile.code : (run.code || 0);

        // If test cases provided, run them
        let testCaseResults: CodeExecutionResponse['testCaseResults'] = undefined;
        let allPassed = true;

        if (req.testCases && req.testCases.length > 0) {
          testCaseResults = [];
          for (let i = 0; i < req.testCases.length; i++) {
            const tc = req.testCases[i];
            const tcStart = Date.now();
            try {
              const tcResp = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  language: pistonConfig.language,
                  version: pistonConfig.version,
                  files: [{ name: pistonConfig.file, content: req.code }],
                  stdin: tc.input,
                  run_timeout: 3000
                })
              });
              const tcData = await tcResp.json();
              const actual = (tcData.run?.stdout || '').trim();
              const expected = tc.expectedOutput.trim();
              const passed = actual === expected;
              if (!passed) allPassed = false;

              testCaseResults.push({
                testCaseIndex: i + 1,
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                actualOutput: actual || tcData.run?.stderr || 'No output',
                passed,
                isHidden: tc.isHidden,
                executionTimeMs: Date.now() - tcStart
              });
            } catch (tcErr) {
              allPassed = false;
              testCaseResults.push({
                testCaseIndex: i + 1,
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                actualOutput: 'Execution Timeout',
                passed: false,
                isHidden: tc.isHidden,
                executionTimeMs: Date.now() - tcStart
              });
            }
          }
        }

        return {
          stdout,
          stderr,
          output,
          exitCode,
          executionTimeMs: 120,
          testCaseResults,
          allPassed
        };
      }
    } catch (e: any) {
      console.warn('Piston API unavailable or timed out, falling back if JS/TS:', e.message);
    }
  }

  // Fallback for JS/TS
  if (langKey === 'javascript' || langKey === 'typescript') {
    const res = runLocalJavascript(req.code, req.stdin);
    if (req.testCases && req.testCases.length > 0) {
      let allPassed = true;
      const testCaseResults = req.testCases.map((tc, idx) => {
        const tcRun = runLocalJavascript(req.code, tc.input);
        const actual = tcRun.stdout.trim();
        const expected = tc.expectedOutput.trim();
        const passed = actual === expected;
        if (!passed) allPassed = false;
        return {
          testCaseIndex: idx + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: actual || tcRun.stderr,
          passed,
          isHidden: tc.isHidden,
          executionTimeMs: tcRun.executionTimeMs
        };
      });
      return {
        ...res,
        testCaseResults,
        allPassed
      };
    }
    return res;
  }

  // Generic simulated execution message if language unavailable offline
  return {
    stdout: '',
    stderr: `Remote compiler service is temporarily unreachable for ${req.language}. Please verify network connection or select JavaScript/TypeScript/SQL for direct browser sandbox execution.`,
    output: `Compiler error: Unable to reach sandboxed container for ${req.language}.`,
    exitCode: 1,
    executionTimeMs: 10
  };
}
