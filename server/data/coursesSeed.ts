import type { Course } from '../types.ts';

export const SEED_COURSES: Course[] = [
  // 1. Python Programming
  {
    id: 'course-python',
    slug: 'python-programming',
    title: 'Python Programming',
    category: 'Programming Languages',
    shortDescription: 'Master modern Python from variables, control flow, and data structures to OOP, decorators, and APIs.',
    longDescription: 'Comprehensive, industry-standard Python engineering program designed for university students and developers. Covers memory model, functional paradigms, OOP, generators, decorators, and building production applications.',
    iconName: 'Code',
    badgeColor: 'blue',
    level: 'Beginner',
    prerequisites: ['Basic logical thinking and computer literacy'],
    learningObjectives: [
      'Understand the Python interpreter, execution model, and bytecode compilation',
      'Master fundamental data types, slicing, mutability, and memory references',
      'Leverage list/dict comprehensions, generators, and iterators for high-performance scripting',
      'Implement object-oriented programming: inheritance, polymorphism, encapsulation, and magic methods',
      'Build robust APIs, file parsers, and automated workflows'
    ],
    totalModulesCount: 7,
    totalTopicsCount: 28,
    completedTopicsCount: 28,
    completionPercentage: 100,
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2026-02-15T00:00:00.000Z',
    modules: [
      {
        id: 'mod-py-1',
        courseId: 'course-python',
        title: 'Module 1: Introduction to Python & Architecture',
        order: 1,
        description: 'Evolution of Python, internal bytecode compilation, Python Virtual Machine (PVM), and environment setup.',
        chapters: [
          {
            id: 'chap-py-1',
            moduleId: 'mod-py-1',
            title: 'Python Internals & First Program',
            order: 1,
            topics: [
              {
                id: 'topic-py-execution-model',
                chapterId: 'chap-py-1',
                courseId: 'course-python',
                title: 'Python Execution Process & PVM',
                order: 1,
                estimatedMinutes: 25,
                difficulty: 'Beginner',
                isFoundational: true,
                content: {
                  topicId: 'topic-py-execution-model',
                  introduction: 'Unlike pure compiled languages like C++ or pure interpreted scripting engines, Python utilizes a two-step hybrid execution model involving source compilation to bytecode followed by execution on the Python Virtual Machine (PVM).',
                  definition: 'The Python Virtual Machine (PVM) is the runtime engine of Python. It interprets intermediate platform-independent bytecode instructions (.pyc files) into native CPU machine instructions sequentially.',
                  whyImportant: 'Understanding the PVM and bytecode allows developers to optimize memory overhead, debug performance bottlenecks, inspect compiled files, and comprehend the Global Interpreter Lock (GIL).',
                  howItWorks: '1. Source code (.py) is compiled by the parser and compiler into bytecode (.pyc inside __pycache__).\n2. Bytecode consists of low-level instructions (disassembled via the dis module).\n3. The PVM evaluates bytecode instructions using an internal evaluation loop (ceval.c).',
                  detailedExplanation: 'When you execute `python app.py`, CPython checks whether a compiled version already exists in `__pycache__` with a matching timestamp or content hash. If missing or stale, CPython compiles the AST into bytecode instructions such as LOAD_NAME, LOAD_CONST, and BINARY_OP. The PVM executes these instructions on a stack-based virtual machine.',
                  syntax: '# View bytecode instructions for any function\nimport dis\ndis.dis(function_name)',
                  examples: [
                    {
                      title: 'Inspecting CPython Bytecode with dis module',
                      code: `import dis\n\ndef calculate_total(price, tax_rate):\n    total = price + (price * tax_rate)\n    return total\n\nprint("Bytecode breakdown:")\ndis.dis(calculate_total)`,
                      language: 'python',
                      explanation: 'Step 1: Imports the disassembler module. Step 2: Defines a mathematical function. Step 3: dis.dis prints each opcode instruction, such as LOAD_FAST and BINARY_MULTIPLY.',
                      output: `Bytecode breakdown:\n  2           0 LOAD_FAST                0 (price)\n              2 LOAD_FAST                0 (price)\n              4 LOAD_FAST                1 (tax_rate)\n              6 BINARY_MULTIPLY\n              8 BINARY_ADD\n             10 STORE_FAST               2 (total)\n  3          12 LOAD_FAST                2 (total)\n             14 RETURN_VALUE`
                    },
                    {
                      title: 'Checking Bytecode Magic & System Execution Details',
                      code: `import sys\nimport importlib.util\n\nprint("CPython Version:", sys.version.split()[0])\nprint("Bytecode Cache Tag:", sys.implementation.cache_tag)\nprint("Platform Architecture:", sys.platform)`,
                      language: 'python',
                      explanation: 'Step 1: Queries runtime properties from the sys module. Step 2: Displays the active CPython cache tag (e.g. cpython-310).',
                      output: `CPython Version: 3.10.12\nBytecode Cache Tag: cpython-310\nPlatform Architecture: linux`
                    }
                  ],
                  realWorldApplications: [
                    'Packaging secure proprietary Python code as compiled .pyc distributions',
                    'Building code profilers and static linters (Flake8, Pylint)',
                    'Performance engineering with PyPy JIT compilation'
                  ],
                  commonErrors: [
                    'Assuming Python is purely interpreted and having misconception that code lines are executed directly without syntax validation',
                    'Deleting __pycache__ believing it fixes runtime logical bugs'
                  ],
                  interviewQuestions: [
                    {
                      question: 'Is Python an interpreted or compiled language?',
                      answer: 'Python is both: it is first compiled into intermediate bytecode (.pyc), which is then interpreted by the Python Virtual Machine (PVM).',
                      difficulty: 'Easy'
                    },
                    {
                      question: 'What is the function of the Global Interpreter Lock (GIL)?',
                      answer: 'The GIL is a mutex in CPython that prevents multiple native threads from executing Python bytecodes simultaneously, ensuring thread-safe reference counting.',
                      difficulty: 'Medium'
                    }
                  ],
                  practiceExercise: 'Write a Python script that takes two numbers, inspects its bytecode using dis.dis, and verifies how addition is translated to BINARY_ADD.',
                  summary: 'Python compiles human-readable source into bytecode, which the stack-based Python Virtual Machine converts to machine instructions on the fly.'
                },
                assessment: [
                  {
                    id: 'q-py-exec-1',
                    type: 'mcq',
                    question: 'What is the role of the Python Virtual Machine (PVM)?',
                    options: [
                      'To compile Python source directly into x86 assembly binary',
                      'To execute intermediate Python bytecode instructions line-by-line',
                      'To manage web server requests in Django',
                      'To provide a graphical user interface for IDLE'
                    ],
                    correctAnswer: 1,
                    explanation: 'The PVM is the runtime interpreter loop that translates bytecode instructions into CPU machine operations.',
                    difficulty: 'Beginner'
                  },
                  {
                    id: 'q-py-exec-2',
                    type: 'mcq',
                    question: 'Which module in the Python standard library allows disassembling code to view its bytecode?',
                    options: ['sys', 'bytecode', 'dis', 'compile'],
                    correctAnswer: 2,
                    explanation: 'The `dis` module supports the analysis of CPython bytecode by disassembling functions, methods, and code objects.',
                    difficulty: 'Beginner'
                  },
                  {
                    id: 'q-py-exec-3',
                    type: 'output_prediction',
                    question: 'What happens when Python source code has a syntax error on line 10?',
                    options: [
                      'Lines 1 through 9 run, and then the program crashes at line 10',
                      'The compiler detects the syntax error during the parsing phase before any code execution starts',
                      'Python ignores line 10 and executes the remainder',
                      'The error is logged to a warning file and skipped'
                    ],
                    correctAnswer: 1,
                    explanation: 'Because Python compiles code to bytecode first, syntax errors are caught before runtime execution begins.',
                    difficulty: 'Intermediate'
                  }
                ]
              },
              {
                id: 'topic-py-variables-memory',
                chapterId: 'chap-py-1',
                courseId: 'course-python',
                title: 'Variables, References & Mutability',
                order: 2,
                estimatedMinutes: 30,
                difficulty: 'Beginner',
                isFoundational: true,
                content: {
                  topicId: 'topic-py-variables-memory',
                  introduction: 'In Python, variables are not memory buckets storing values; they are symbolic name references (pointers) bound to objects residing in heap memory.',
                  definition: 'An object in Python has three fundamental attributes: an Identity (its memory address, accessed with id()), a Type (e.g. int, str, list), and a Value. Mutability dictates whether an object’s value can be mutated after instantiation.',
                  whyImportant: 'Misunderstanding mutability leads to subtle bugs when passing default arguments to functions, copying collections, and mutating nested data structures.',
                  howItWorks: 'Immutable types (int, float, bool, str, tuple, frozenset) cannot be modified in-place; mutating operations construct a new object. Mutable types (list, dict, set, bytearray) permit in-place modifications without altering object identity.',
                  detailedExplanation: 'When you execute `a = [1, 2]`, memory is allocated on the heap for a list object, and name `a` references it. If you then assign `b = a`, both names point to the exact same list identity. Modifying `b.append(3)` mutates `a` as well. For immutable types like integers, integers from -5 to 256 are pre-allocated (interned) by CPython.',
                  syntax: 'id(obj) # Returns memory address integer\ntype(obj) # Returns object type\nis # Tests identity (id(a) == id(b))\n== # Tests value equality',
                  examples: [
                    {
                      title: 'Demonstrating List Mutability vs Integer Immutability',
                      code: `# Mutable behavior\nlist1 = [10, 20]\nlist2 = list1\nlist2.append(30)\nprint("list1:", list1) # [10, 20, 30]\nprint("Are identical?", list1 is list2) # True\n\n# Immutable behavior\nnum1 = 500\nnum2 = num1\nnum2 += 10\nprint("num1:", num1, "| num2:", num2) # 500 | 510\nprint("Are identical?", num1 is num2) # False`,
                      language: 'python',
                      explanation: 'Step 1: list2 points to the identical heap address of list1. Step 2: In-place append affects both variables. Step 3: In contrast, integer addition rebinds num2 to a brand new integer object.',
                      output: `list1: [10, 20, 30]\nAre identical? True\nnum1: 500 | num2: 510\nAre identical? False`
                    },
                    {
                      title: 'Shallow Copy vs Deep Copy',
                      code: `import copy\n\noriginal = [[1, 2], [3, 4]]\nshallow = copy.copy(original)\ndeep = copy.deepcopy(original)\n\noriginal[0].append(99)\nprint("Original:", original)\nprint("Shallow (nested affected):", shallow)\nprint("Deep (isolated):", deep)`,
                      language: 'python',
                      explanation: 'Shallow copy duplicates the outer container while referencing the same inner sub-lists. Deep copy recursively creates new copies of all nested objects.',
                      output: `Original: [[1, 2, 99], [3, 4]]\nShallow (nested affected): [[1, 2, 99], [3, 4]]\nDeep (isolated): [[1, 2], [3, 4]]`
                    }
                  ],
                  realWorldApplications: [
                    'Safely passing configuration dictionaries across microservices without unwanted side effects',
                    'Implementing caching algorithms (memoization) using immutable hashable keys',
                    'Writing high-performance data processing pipelines with NumPy / Pandas arrays'
                  ],
                  commonErrors: [
                    'Using mutable default arguments in functions (e.g., def add_item(val, items=[])) which causes persistent state across invocations',
                    'Confusing `==` (equality) with `is` (identity)'
                  ],
                  interviewQuestions: [
                    {
                      question: 'Why should you never use a mutable default argument in a Python function?',
                      answer: 'Default arguments are evaluated once when the function definition is executed, not at each call. A mutable list or dict default will be shared across all subsequent invocations.',
                      difficulty: 'Medium'
                    },
                    {
                      question: 'What is integer interning in CPython?',
                      answer: 'CPython pre-allocates an internal array of integer objects for values between -5 and 256. Any reference to these numbers reuses the same memory address.',
                      difficulty: 'Hard'
                    }
                  ],
                  practiceExercise: 'Write a function `safe_append(element, target=None)` that avoids the mutable default argument trap by initializing a new list when target is None.',
                  summary: 'Variables in Python are pointers to heap objects. Understand mutability to prevent unexpected side effects when passing objects to functions.'
                },
                assessment: [
                  {
                    id: 'q-py-mut-1',
                    type: 'mcq',
                    question: 'Which of the following data types in Python is MUTABLE?',
                    options: ['tuple', 'frozenset', 'str', 'dict'],
                    correctAnswer: 3,
                    explanation: 'Dictionaries (`dict`) are mutable in Python; keys can be inserted, modified, or removed in-place.',
                    difficulty: 'Beginner'
                  },
                  {
                    id: 'q-py-mut-2',
                    type: 'code_trace',
                    question: 'What will be the output of: `a = [1]; b = a; b += [2]; print(a)`?',
                    options: ['[1]', '[1, 2]', '[2]', 'AttributeError'],
                    correctAnswer: 1,
                    explanation: 'In Python, `+=` on a list invokes `__iadd__`, which extends the existing list in-place, modifying both `a` and `b`.',
                    difficulty: 'Intermediate'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'mod-py-2',
        courseId: 'course-python',
        title: 'Module 2: Advanced Data Structures & Comprehensions',
        order: 2,
        description: 'Lists, tuples, sets, dictionaries, packing/unpacking, generators, and memory-efficient comprehensions.',
        chapters: [
          {
            id: 'chap-py-comprehensions',
            moduleId: 'mod-py-2',
            title: 'Comprehensions & Generators',
            order: 1,
            topics: [
              {
                id: 'topic-py-comprehensions',
                chapterId: 'chap-py-comprehensions',
                courseId: 'course-python',
                title: 'List, Dict & Set Comprehensions with Generators',
                order: 1,
                estimatedMinutes: 30,
                difficulty: 'Intermediate',
                isFoundational: true,
                content: {
                  topicId: 'topic-py-comprehensions',
                  introduction: 'Comprehensions provide a concise, declarative syntax to transform and filter iterables into lists, dictionaries, or sets, often executing faster than traditional for-loops due to C-level bytecode optimization.',
                  definition: 'A comprehension is a syntactic construct that creates a new collection by evaluating an expression for every item in an iterable sequence, optionally guarded by predicate conditions.',
                  whyImportant: 'They yield cleaner, more idiomatic Python code and execute up to 30% faster than manual append loops because the bytecodes run optimized LIST_APPEND routines inside CPython.',
                  howItWorks: 'Instead of creating an empty list and calling .append() repeatedly, a comprehension pre-allocates memory and directly writes evaluated items into the buffer.',
                  detailedExplanation: 'Comprehensions support nested loops and conditional filters: `[expr for item in iterable if condition]`. If parentheses are used instead of brackets, Python yields a Generator Expression, which calculates items lazily one at a time using the iterator protocol, preserving memory for gigabyte-scale datasets.',
                  syntax: '# List comprehension\n[x * 2 for x in data if x % 2 == 0]\n# Dict comprehension\n{k: v for k, v in zip(keys, values)}\n# Generator expression (lazy)\n(x ** 2 for x in range(1_000_000))',
                  examples: [
                    {
                      title: 'Data Transformation with Dict and Set Comprehensions',
                      code: `students = [\n    {"name": "Aditi", "score": 92, "branch": "CSE"},\n    {"name": "Dev", "score": 78, "branch": "IT"},\n    {"name": "Ishaan", "score": 85, "branch": "CSE"},\n    {"name": "Kavya", "score": 95, "branch": "ECE"}\n]\n\n# Dict of top performers (score >= 85)\nhonor_roll = {s["name"]: s["score"] for s in students if s["score"] >= 85}\nprint("Honor Roll:", honor_roll)\n\n# Unique branches using Set comprehension\nbranches = {s["branch"] for s in students}\nprint("Distinct branches:", branches)`,
                      language: 'python',
                      explanation: 'Step 1: Dict comprehension builds a name-to-score map filtered for scores >= 85. Step 2: Set comprehension collects unique branches automatically eliminating duplicates.',
                      output: `Honor Roll: {'Aditi': 92, 'Ishaan': 85, 'Kavya': 95}\nDistinct branches: {'ECE', 'CSE', 'IT'}`
                    },
                    {
                      title: 'Memory Benchmarking: List vs Generator Expression',
                      code: `import sys\n\n# List generates all 100,000 items in memory immediately\nlist_comp = [x * 2 for x in range(100_000)]\n# Generator expression evaluates lazily on demand\ngen_exp = (x * 2 for x in range(100_000))\n\nprint("List memory footprint (bytes):", sys.getsizeof(list_comp))\nprint("Generator memory footprint (bytes):", sys.getsizeof(gen_exp))\nprint("First 3 from generator:", [next(gen_exp), next(gen_exp), next(gen_exp)])`,
                      language: 'python',
                      explanation: 'The list occupies ~800 KB of RAM storing all elements upfront. The generator consumes a tiny ~100 bytes regardless of whether it processes 100 items or 10 billion items.',
                      output: `List memory footprint (bytes): 800984\nGenerator memory footprint (bytes): 104\nFirst 3 from generator: [0, 2, 4]`
                    }
                  ],
                  realWorldApplications: [
                    'ETL data cleaning and normalization pipelines',
                    'Streaming massive log files line-by-line without exhausting server memory',
                    'Constructing query parameters and JSON payloads for microservices'
                  ],
                  commonErrors: [
                    'Over-nesting comprehensions beyond 2 levels, which destroys readability',
                    'Trying to reuse an exhausted generator (generators can only be iterated once)'
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the key difference between a list comprehension and a generator expression?',
                      answer: 'A list comprehension allocates the entire list in memory eagerly. A generator expression returns an iterator that computes items lazily on demand, saving massive memory.',
                      difficulty: 'Medium'
                    }
                  ],
                  practiceExercise: 'Given a sentence, write a dict comprehension that maps each distinct lowercase word to its character length, ignoring words shorter than 3 letters.',
                  summary: 'Comprehensions offer idiomatic, concise syntax for transforming collections. Use generator expressions when processing large or infinite streams lazily.'
                },
                assessment: [
                  {
                    id: 'q-py-comp-1',
                    type: 'mcq',
                    question: 'What data structure is created by: `data = (x for x in range(10))`?',
                    options: ['tuple', 'generator object', 'list', 'set'],
                    correctAnswer: 1,
                    explanation: 'Parentheses around a comprehension create a generator object, not a tuple (tuples require `tuple(...)` or comma syntax).',
                    difficulty: 'Intermediate'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // 2. Data Structures
  {
    id: 'course-dsa',
    slug: 'data-structures-algorithms',
    title: 'Data Structures & Algorithms',
    category: 'Computer Science Core',
    shortDescription: 'From Big-O analysis and Linked Lists to Binary Search Trees, Heaps, Dynamic Programming, and Graph algorithms.',
    longDescription: 'Comprehensive CSE foundation covering linear and non-linear data structures, asymptotic complexity analysis, graph traversals, and dynamic programming with step-by-step memory layouts and production implementations.',
    iconName: 'Binary',
    badgeColor: 'violet',
    level: 'All Levels',
    prerequisites: ['Basic programming in C, C++, Java, or Python'],
    learningObjectives: [
      'Master asymptotic Big-O, Big-Omega, and Big-Theta notation analysis',
      'Implement Singly, Doubly, and Circular Linked Lists with pointer mechanics',
      'Build Stacks, Queues, Priority Queues (Min/Max Heaps), and Hash Tables with collision resolution',
      'Master Tree traversals, Binary Search Trees, AVL balance factors, and Graphs (BFS, DFS, Dijkstra, Bellman-Ford)',
      'Formulate Dynamic Programming state transitions and solve top placement interview challenges'
    ],
    totalModulesCount: 6,
    totalTopicsCount: 24,
    completedTopicsCount: 24,
    completionPercentage: 100,
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2026-02-18T00:00:00.000Z',
    modules: [
      {
        id: 'mod-dsa-1',
        courseId: 'course-dsa',
        title: 'Module 1: Asymptotic Analysis & Arrays',
        order: 1,
        description: 'Time and space complexity, Big-O notation, amortized analysis, and contiguous memory layout.',
        chapters: [
          {
            id: 'chap-dsa-big-o',
            moduleId: 'mod-dsa-1',
            title: 'Complexity Analysis',
            order: 1,
            topics: [
              {
                id: 'topic-dsa-big-o',
                chapterId: 'chap-dsa-big-o',
                courseId: 'course-dsa',
                title: 'Asymptotic Complexity & Big-O Notation',
                order: 1,
                estimatedMinutes: 30,
                difficulty: 'Beginner',
                isFoundational: true,
                content: {
                  topicId: 'topic-dsa-big-o',
                  introduction: 'Asymptotic complexity measures how the execution time or memory utilization of an algorithm scales as the input size n approaches infinity, independent of hardware architecture or operating system.',
                  definition: 'Big-O notation (O(g(n))) represents the formal asymptotic upper bound of a function. Mathematically: f(n) = O(g(n)) if there exist positive constants c and n0 such that 0 <= f(n) <= c * g(n) for all n >= n0.',
                  whyImportant: 'It allows engineers to predict whether an algorithm will execute in milliseconds or freeze an entire data center when handling millions of database records or users.',
                  howItWorks: '1. Count the dominant operational steps executed in terms of input size n.\n2. Drop low-order terms (e.g., n^2 + 5n + 10 becomes n^2).\n3. Drop constant multipliers (e.g., 7n^2 becomes O(n^2)).',
                  detailedExplanation: 'Complexity hierarchy from fastest to slowest:\n- O(1) Constant: Array index lookup, Hash map insertion (average)\n- O(log n) Logarithmic: Binary search, balanced BST search\n- O(n) Linear: Linear scan, single for-loop\n- O(n log n) Linearithmic: Merge Sort, Quick Sort (average), Heap Sort\n- O(n^2) Quadratic: Nested loops, Bubble sort\n- O(2^n) Exponential: Recursive Fibonacci, generating all subsets\n- O(n!) Factorial: Traveling Salesperson Problem brute-force',
                  syntax: 'f(n) <= c * g(n) for all n >= n0',
                  examples: [
                    {
                      title: 'Analyzing O(1) vs O(n) vs O(n^2) in Code',
                      code: `def get_first_element(arr): # O(1) time, O(1) space\n    return arr[0] if arr else None\n\ndef find_max(arr): # O(n) time, O(1) space\n    max_val = arr[0]\n    for val in arr: # Loops n times\n        if val > max_val:\n            max_val = val\n    return max_val\n\ndef has_duplicate(arr): # O(n^2) time, O(1) space\n    n = len(arr)\n    for i in range(n):\n        for j in range(i + 1, n):\n            if arr[i] == arr[j]:\n                return True\n    return False`,
                      language: 'python',
                      explanation: 'get_first_element performs a direct memory offset lookup in constant time. find_max requires visiting each element once. has_duplicate uses nested loops running n * (n - 1) / 2 comparisons.',
                      output: `Analysis verified: O(1), O(n), O(n^2)`
                    },
                    {
                      title: 'Logarithmic O(log n) Binary Search',
                      code: `def binary_search(arr, target):\n    low = 0\n    high = len(arr) - 1\n    steps = 0\n    \n    while low <= high:\n        steps += 1\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid, steps\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n            \n    return -1, steps\n\nsorted_data = list(range(1, 1025)) # 1024 elements (2^10)\nindex, steps = binary_search(sorted_data, 789)\nprint(f"Target found at index {index} in only {steps} comparisons!")`,
                      language: 'python',
                      explanation: 'With 1,024 elements, a linear search would take up to 1,024 steps. Binary search halves the search space each iteration, requiring at most log2(1024) = 10 steps.',
                      output: `Target found at index 788 in only 10 comparisons!`
                    }
                  ],
                  realWorldApplications: [
                    'Database query indexing using B-Trees to guarantee O(log n) lookups across billions of records',
                    'Stock market high-frequency order matching engines requiring strict O(1) time budgets',
                    'Network routing protocols optimizing shortest path computations'
                  ],
                  commonErrors: [
                    'Assuming two independent loops are O(n^2). If they are sequential, it is O(n + m), not O(n * m)',
                    'Neglecting space complexity from recursive call stacks (e.g. recursive trees)'
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is amortized time complexity with an example?',
                      answer: 'Amortized analysis measures the average time per operation over a worst-case sequence of operations. For example, dynamic array (Python list or C++ vector) resizing is O(1) amortized because the expensive O(n) reallocation happens infrequently (geometric doubling).',
                      difficulty: 'Medium'
                    }
                  ],
                  practiceExercise: 'Determine the time and space complexity of an algorithm that computes the sum of elements in an N x N matrix.',
                  summary: 'Big-O notation characterizes algorithmic scalability. Aim for O(1) or O(log n) for lookups and O(n log n) for sorting algorithms.'
                },
                assessment: [
                  {
                    id: 'q-dsa-bigo-1',
                    type: 'mcq',
                    question: 'What is the time complexity of searching an element in an unsorted array of size N?',
                    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
                    correctAnswer: 2,
                    explanation: 'In an unsorted array, in the worst case we must inspect all N elements sequentially, resulting in O(N) linear time.',
                    difficulty: 'Beginner'
                  },
                  {
                    id: 'q-dsa-bigo-2',
                    type: 'mcq',
                    question: 'If an algorithm divides problem size N by 2 at each step and does O(1) work per step, what is its time complexity?',
                    options: ['O(N)', 'O(N^2)', 'O(log N)', 'O(2^N)'],
                    correctAnswer: 2,
                    explanation: 'Repeated division of problem size by a constant factor k yields logarithmic complexity O(log_k N).',
                    difficulty: 'Beginner'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'mod-dsa-2',
        courseId: 'course-dsa',
        title: 'Module 2: Linked Lists & Pointers',
        order: 2,
        description: 'Singly linked lists, doubly linked lists, circular lists, fast & slow pointer Floyd cycle detection.',
        chapters: [
          {
            id: 'chap-dsa-ll',
            moduleId: 'mod-dsa-2',
            title: 'Linked List Architecture',
            order: 1,
            topics: [
              {
                id: 'topic-dsa-singly-linked-list',
                chapterId: 'chap-dsa-ll',
                courseId: 'course-dsa',
                title: 'Singly Linked List Implementation & Reversal',
                order: 1,
                estimatedMinutes: 35,
                difficulty: 'Intermediate',
                isFoundational: true,
                content: {
                  topicId: 'topic-dsa-singly-linked-list',
                  introduction: 'Unlike arrays where elements are stored in contiguous memory blocks, a linked list is a linear data structure composed of nodes distributed dynamically in heap memory, linked via pointer references.',
                  definition: 'A Singly Linked List consists of nodes, where each node encapsulates two fields: the payload data and a pointer reference (next) storing the memory address of the subsequent node.',
                  whyImportant: 'Allows O(1) time insertions and deletions at the head without expensive memory shifting required by dynamic arrays. Foundational for building Stacks, Queues, and chaining in Hash Maps.',
                  howItWorks: 'Nodes are allocated dynamically. The list is anchored by a `head` pointer. The terminal node has its `next` pointer set to `None` / `NULL`.',
                  detailedExplanation: 'To insert at the beginning: instantiate newNode, set newNode.next = head, and update head = newNode (O(1)). To reverse an entire linked list in-place: maintain three pointers: prev (initially None), curr (head), and next_node. At each step, reverse curr.next to prev, advance prev to curr, and curr to next_node.',
                  syntax: 'class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None',
                  examples: [
                    {
                      title: 'In-Place Linked List Reversal (Iterative)',
                      code: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head):\n    prev = None\n    curr = head\n    while curr is not None:\n        next_temp = curr.next  # 1. Save next\n        curr.next = prev       # 2. Reverse link\n        prev = curr            # 3. Advance prev\n        curr = next_temp       # 4. Advance curr\n    return prev  # New head\n\n# Helper to display\ndef print_list(node):\n    vals = []\n    while node:\n        vals.append(str(node.val))\n        node = node.next\n    print(" -> ".join(vals) + " -> NULL")\n\n# Create list: 10 -> 20 -> 30 -> NULL\nhead = ListNode(10, ListNode(20, ListNode(30)))\nprint("Original:")\nprint_list(head)\nreversed_head = reverse_list(head)\nprint("Reversed:")\nprint_list(reversed_head)`,
                      language: 'python',
                      explanation: 'The algorithm reverses all pointer arrows in a single pass in O(N) time and O(1) auxiliary space without creating duplicate nodes.',
                      output: `Original:\n10 -> 20 -> 30 -> NULL\nReversed:\n30 -> 20 -> 10 -> NULL`
                    },
                    {
                      title: "Floyd's Cycle Detection Algorithm (Tortoise and Hare)",
                      code: `def has_cycle(head):\n    slow = head\n    fast = head\n    while fast and fast.next:\n        slow = slow.next          # 1 step\n        fast = fast.next.next     # 2 steps\n        if slow == fast:\n            return True  # Cycle detected\n    return False\n\n# Build list with cycle: 1 -> 2 -> 3 -> 4 -> points back to 2\nnode1 = ListNode(1)\nnode2 = ListNode(2)\nnode3 = ListNode(3)\nnode4 = ListNode(4)\nnode1.next = node2\nnode2.next = node3\nnode3.next = node4\nnode4.next = node2 # Cycle!\n\nprint("Cycle present?", has_cycle(node1))`,
                      language: 'python',
                      explanation: 'Floyd cycle detection uses two pointers moving at speeds 1x and 2x. If a cycle exists, the fast pointer will lap the slow pointer inside the loop.',
                      output: `Cycle present? True`
                    }
                  ],
                  realWorldApplications: [
                    'Music playlist next/previous track navigation using doubly linked lists',
                    'Undo/Redo buffers in word processors and code editors',
                    'Memory management free-lists in operating system kernels'
                  ],
                  commonErrors: [
                    'Losing the head pointer reference during traversal, leading to memory leaks or orphaned nodes',
                    'Dereferencing `None.next` (Null Pointer Exception)'
                  ],
                  interviewQuestions: [
                    {
                      question: 'How do you find the middle element of a linked list in a single traversal?',
                      answer: 'Use the two-pointer technique: advance fast pointer by 2 nodes and slow pointer by 1 node. When fast reaches the end, slow will be precisely at the middle node.',
                      difficulty: 'Medium'
                    }
                  ],
                  practiceExercise: 'Write an algorithm to remove the N-th node from the end of a singly linked list in a single pass.',
                  summary: 'Linked lists allow O(1) insertions at the head without contiguous memory constraints. Master the two-pointer technique for cycle detection and reversals.'
                },
                assessment: [
                  {
                    id: 'q-dsa-ll-1',
                    type: 'mcq',
                    question: 'What is the time complexity to insert a node at the head of a Singly Linked List?',
                    options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'],
                    correctAnswer: 0,
                    explanation: 'Inserting at head simply requires allocating the new node, setting its next pointer to head, and repointing head, taking O(1) constant time.',
                    difficulty: 'Beginner'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // 3. Database Management Systems (DBMS)
  {
    id: 'course-dbms',
    slug: 'dbms',
    title: 'Database Management Systems (DBMS)',
    category: 'Computer Science Core',
    shortDescription: 'ER modeling, Relational Algebra, SQL DDL/DML, Normalization (1NF to BCNF), Transactions & ACID, Indexing, and Concurrency.',
    longDescription: 'In-depth university and placement standard DBMS course covering relational architecture, SQL join optimizations, functional dependencies, 1NF-BCNF decomposition, serializability, two-phase locking, and B-Tree indexing.',
    iconName: 'Database',
    badgeColor: 'emerald',
    level: 'Intermediate',
    prerequisites: ['Basic discrete mathematics and programming fundamentals'],
    learningObjectives: [
      'Contrast file systems with relational database management architectures',
      'Design normalized database schemas using Entity-Relationship (ER) diagrams and functional dependencies',
      'Formulate complex SQL queries with nested subqueries, window functions, and multi-table joins',
      'Master transaction properties (ACID), conflict serializability, and 2-Phase Locking (2PL)',
      'Explain B-Tree / B+Tree indexes, hashing, and query execution plans'
    ],
    totalModulesCount: 6,
    totalTopicsCount: 26,
    completedTopicsCount: 26,
    completionPercentage: 100,
    createdAt: '2025-01-20T00:00:00.000Z',
    updatedAt: '2026-02-12T00:00:00.000Z',
    modules: [
      {
        id: 'mod-dbms-1',
        courseId: 'course-dbms',
        title: 'Module 1: Architecture & Normalization',
        order: 1,
        description: '3-tier ANSI-SPARC architecture, functional dependencies, and lossless BCNF decomposition.',
        chapters: [
          {
            id: 'chap-dbms-norm',
            moduleId: 'mod-dbms-1',
            title: 'Database Normalization',
            order: 1,
            topics: [
              {
                id: 'topic-dbms-normalization',
                chapterId: 'chap-dbms-norm',
                courseId: 'course-dbms',
                title: 'Normalization: 1NF, 2NF, 3NF & BCNF with Step-by-Step Examples',
                order: 1,
                estimatedMinutes: 40,
                difficulty: 'Intermediate',
                isFoundational: true,
                content: {
                  topicId: 'topic-dbms-normalization',
                  introduction: 'Normalization is a systematic database design technique that decomposes tables to eliminate data redundancy and avoid update, insertion, and deletion anomalies.',
                  definition: 'Normalization is the process of organizing attributes and relations in a database to satisfy progressive normal forms (1NF through BCNF) based on functional dependencies (FDs).',
                  whyImportant: 'Un-normalized databases duplicate data across millions of rows, wasting disk space and causing anomalies where updating a student’s department in one record leaves conflicting information elsewhere.',
                  howItWorks: '1. 1NF: Enforce atomic (indivisible) attribute values and eliminate repeating groups.\n2. 2NF: Must be in 1NF and eliminate partial dependency (no non-prime attribute depends on a subset of a composite candidate key).\n3. 3NF: Must be in 2NF and eliminate transitive dependency (no non-prime attribute transitively depends on candidate key: for X -> Y, either X is a superkey or Y is prime).\n4. BCNF (Boyce-Codd): For every non-trivial FD X -> Y, X must be a superkey.',
                  detailedExplanation: 'Let relation R(StudentID, CourseID, StudentName, CourseFee, InstructorName, InstructorOffice) with composite candidate key {StudentID, CourseID}.\n- Partial Dependency: StudentID -> StudentName violates 2NF because StudentID is only part of the composite key.\n- Decomposing into R1(StudentID, CourseID) and R2(StudentID, StudentName) achieves 2NF.\n- In R1, CourseID -> CourseFee and CourseID -> InstructorName. InstructorName -> InstructorOffice is a transitive dependency (CourseID -> InstructorName -> InstructorOffice), violating 3NF.\n- Decomposing into separate Instructor and Course tables achieves 3NF and BCNF.',
                  syntax: '-- Practical SQL demonstration of normalized tables\nCREATE TABLE Instructors (\n    instructor_id INT PRIMARY KEY,\n    name VARCHAR(100) NOT NULL,\n    office VARCHAR(50)\n);\n\nCREATE TABLE Courses (\n    course_id INT PRIMARY KEY,\n    title VARCHAR(150) NOT NULL,\n    instructor_id INT REFERENCES Instructors(instructor_id)\n);',
                  examples: [
                    {
                      title: 'Decomposing Un-normalized Employee Data to 3NF',
                      code: `-- Before (Anomaly Prone):\n-- EmployeeProject(EmpID, ProjID, EmpName, ProjName, DeptName, DeptManager)\n\n-- After 3NF Decomposition:\nCREATE TABLE Departments (\n    dept_id INT PRIMARY KEY,\n    dept_name VARCHAR(50) NOT NULL,\n    manager_id INT\n);\n\nCREATE TABLE Employees (\n    emp_id INT PRIMARY KEY,\n    emp_name VARCHAR(100) NOT NULL,\n    dept_id INT REFERENCES Departments(dept_id)\n);\n\nCREATE TABLE Projects (\n    proj_id INT PRIMARY KEY,\n    proj_name VARCHAR(100) NOT NULL\n);\n\nCREATE TABLE ProjectAssignments (\n    emp_id INT REFERENCES Employees(emp_id),\n    proj_id INT REFERENCES Projects(proj_id),\n    assigned_date DATE DEFAULT CURRENT_DATE,\n    PRIMARY KEY (emp_id, proj_id)\n);`,
                      language: 'sql',
                      explanation: 'Every entity represents a single cohesive concept. Candidate keys uniquely determine attributes. An employee transferring departments requires updating only 1 row in Employees.',
                      output: `Query OK: Tables created with clean foreign key integrity.`
                    },
                    {
                      title: 'SQL Join Query Across Normalized 3NF Relations',
                      code: `SELECT \n    e.emp_name,\n    d.dept_name,\n    p.proj_name\nFROM Employees e\nJOIN Departments d ON e.dept_id = d.dept_id\nJOIN ProjectAssignments pa ON e.emp_id = pa.emp_id\nJOIN Projects p ON pa.proj_id = p.proj_id\nORDER BY e.emp_name;`,
                      language: 'sql',
                      explanation: 'Demonstrates multi-table INNER JOIN reconstructing the denormalized view on demand while preserving atomic storage in the physical disk blocks.',
                      output: `emp_name       | dept_name   | proj_name\n---------------+-------------+---------------------\nAditi Roy      | Cloud Infra | AWS Migration\nDevansh Gupta  | AI Research | Chatbot Engine\nKavya Menon    | Security    | OAuth2 Microservice`
                    }
                  ],
                  realWorldApplications: [
                    'Banking core transactional systems (OLTP) where zero data duplication and ACID guarantees are legally mandated',
                    'E-commerce order processing tracking customers, items, warehouses, and payments independently',
                    'Hospital management databases isolating patient history, prescriptions, and billing'
                  ],
                  commonErrors: [
                    'Over-normalizing OLAP data warehousing systems where deliberate denormalization (Star Schema) improves read throughput',
                    'Decomposing tables in a way that loses functional dependencies or loses lossless join property'
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the main difference between 3NF and BCNF?',
                      answer: '3NF allows an FD X -> Y where X is not a superkey provided Y is a prime attribute (part of any candidate key). BCNF is stricter: for every non-trivial FD X -> Y, X MUST be a superkey with no exceptions.',
                      difficulty: 'Hard'
                    },
                    {
                      question: 'What are Insertion, Deletion, and Update Anomalies?',
                      answer: 'Insertion anomaly occurs when you cannot insert data about one entity without inserting unrelated data of another. Deletion anomaly occurs when deleting one entity unintentionally deletes another. Update anomaly occurs when updating repeated data in one place leaves conflicting data elsewhere.',
                      difficulty: 'Medium'
                    }
                  ],
                  practiceExercise: 'Given relation R(A, B, C, D) with FDs: A -> B, B -> C, C -> D. Find all candidate keys and determine the highest normal form of R.',
                  summary: 'Normalization systematically eliminates data redundancy through progressive normal forms: 1NF (atomic values), 2NF (no partial dependency), 3NF (no transitive dependency), and BCNF (determinant must be superkey).'
                },
                assessment: [
                  {
                    id: 'q-dbms-norm-1',
                    type: 'mcq',
                    question: 'A table is in 2NF if it is in 1NF and:',
                    options: [
                      'It has no transitive dependencies',
                      'No non-prime attribute is partially dependent on any candidate key',
                      'Every determinant is a candidate key',
                      'It contains foreign keys'
                    ],
                    correctAnswer: 1,
                    explanation: 'Second Normal Form (2NF) mandates that all non-prime attributes must be fully functionally dependent on the entire primary key, eliminating partial dependencies.',
                    difficulty: 'Intermediate'
                  },
                  {
                    id: 'q-dbms-norm-2',
                    type: 'mcq',
                    question: 'In BCNF, for every functional dependency X -> Y, what MUST X be?',
                    options: ['A prime attribute', 'A foreign key', 'A superkey', 'A composite attribute'],
                    correctAnswer: 2,
                    explanation: 'Boyce-Codd Normal Form requires that for every non-trivial dependency X -> Y, X must be a superkey of the relation.',
                    difficulty: 'Intermediate'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'mod-dbms-2',
        courseId: 'course-dbms',
        title: 'Module 2: Transactions & ACID Properties',
        order: 2,
        description: 'ACID properties, serializability, two-phase locking (2PL), deadlocks, and write-ahead logging (WAL).',
        chapters: [
          {
            id: 'chap-dbms-acid',
            moduleId: 'mod-dbms-2',
            title: 'Transactions & Concurrency',
            order: 1,
            topics: [
              {
                id: 'topic-dbms-acid',
                chapterId: 'chap-dbms-acid',
                courseId: 'course-dbms',
                title: 'ACID Properties & Concurrency Control',
                order: 1,
                estimatedMinutes: 35,
                difficulty: 'Intermediate',
                isFoundational: true,
                content: {
                  topicId: 'topic-dbms-acid',
                  introduction: 'A database transaction is a logical unit of work that accesses and potentially modifies the contents of a database. ACID properties ensure that database transactions are processed reliably.',
                  definition: 'ACID stands for Atomicity (all-or-nothing), Consistency (state transitions preserve constraints), Isolation (concurrent transactions execute without interference), and Durability (committed data survives power failures).',
                  whyImportant: 'Without ACID guarantees, simultaneous balance transfers in a bank could double-spend funds, create money out of thin air, or lose transaction records during a sudden server restart.',
                  howItWorks: 'Atomicity is maintained via Undo logs. Durability is achieved through Write-Ahead Logging (WAL) and Redo logs. Isolation is enforced through locking protocols (Shared/Exclusive locks, Strict 2PL) or Multi-Version Concurrency Control (MVCC). Consistency is verified against declared schema constraints.',
                  detailedExplanation: 'Concurreny anomalies avoided by isolation levels:\n1. Dirty Read: T2 reads uncommitted modifications made by T1.\n2. Non-Repeatable Read: T1 reads a row, T2 updates that row and commits; T1 re-reads the row and observes altered values.\n3. Phantom Read: T1 queries rows satisfying a range condition; T2 inserts a new row satisfying the predicate and commits; T1 re-executes the query and discovers new "phantom" rows.',
                  syntax: 'BEGIN TRANSACTION;\nUPDATE Accounts SET balance = balance - 500 WHERE id = 101;\nUPDATE Accounts SET balance = balance + 500 WHERE id = 102;\nCOMMIT;',
                  examples: [
                    {
                      title: 'Safe Financial Fund Transfer in SQL with Transaction Rollback',
                      code: `BEGIN;\n\n-- Step 1: Deduct from Account A\nUPDATE accounts \nSET balance = balance - 1000 \nWHERE account_id = 'ACC_1001' AND balance >= 1000;\n\n-- Step 2: Credit to Account B\nUPDATE accounts \nSET balance = balance + 1000 \nWHERE account_id = 'ACC_2002';\n\n-- If any error occurs or balance insufficient, execute:\n-- ROLLBACK;\n-- Otherwise, persist changes permanently:\nCOMMIT;`,
                      language: 'sql',
                      explanation: 'Ensures Atomicity: If a power outage or network drop occurs between Step 1 and Step 2, the database automatically rolls back Step 1, so money is never lost.',
                      output: `COMMIT\nQuery returned successfully: 2 rows affected.`
                    },
                    {
                      title: 'Configuring Isolation Level in PostgreSQL',
                      code: `-- Set isolation level to SERIALIZABLE to prevent Dirty, Non-repeatable, and Phantom reads\nSET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\nBEGIN;\nSELECT SUM(balance) FROM accounts WHERE branch_id = 4;\nCOMMIT;`,
                      language: 'sql',
                      explanation: 'Serializable is the highest isolation level, executing concurrent transactions as if they occurred sequentially.',
                      output: `SET TRANSACTION\nCOMMIT`
                    }
                  ],
                  realWorldApplications: [
                    'Cryptocurrency exchanges executing high-frequency trades with zero double-spending',
                    'Airline flight seat reservation systems ensuring no two passengers book seat 14B simultaneously',
                    'Healthcare patient vital record logging'
                  ],
                  commonErrors: [
                    'Leaving transactions open indefinitely in code without COMMIT or ROLLBACK, holding exclusive locks and freezing the database',
                    'Assuming `READ COMMITTED` prevents Phantom Reads (it only prevents Dirty Reads)'
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is Write-Ahead Logging (WAL) and why is it used for Durability?',
                      answer: 'WAL dictates that any change to database pages must first be recorded in persistent append-only log files before being flushed to the actual data tables on disk. Upon crash recovery, the database replays the log to restore committed transactions.',
                      difficulty: 'Hard'
                    }
                  ],
                  practiceExercise: 'Write an SQL script demonstrating a deadlock scenario where Transaction 1 locks Row A then requests Row B, while Transaction 2 locks Row B then requests Row A.',
                  summary: 'ACID guarantees dependable transaction execution. Concurrency control uses locking and MVCC to balance isolation against query throughput.'
                },
                assessment: [
                  {
                    id: 'q-dbms-acid-1',
                    type: 'mcq',
                    question: 'Which ACID property guarantees that all operations in a transaction complete successfully, or none of them take effect?',
                    options: ['Consistency', 'Atomicity', 'Isolation', 'Durability'],
                    correctAnswer: 1,
                    explanation: 'Atomicity enforces the "all-or-nothing" rule: either all changes in the transaction are committed, or the transaction is aborted and rolled back entirely.',
                    difficulty: 'Beginner'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // 4. Computer Networks
  {
    id: 'course-cn',
    slug: 'computer-networks',
    title: 'Computer Networks',
    category: 'Computer Science Core',
    shortDescription: 'OSI & TCP/IP models, IP addressing, Subnetting (CIDR), TCP 3-way handshake, DNS, HTTP/3, and Network Security.',
    longDescription: 'Comprehensive networking curriculum covering physical media, framing, CSMA/CD, routing algorithms (Dijkstra, Bellman-Ford, BGP), transport layer protocols (TCP flow and congestion control), DNS, HTTP, and TLS 1.3.',
    iconName: 'Network',
    badgeColor: 'cyan',
    level: 'Intermediate',
    prerequisites: ['Basic operating systems and digital logic fundamentals'],
    learningObjectives: [
      'Compare and contrast the 7-layer OSI reference model with the 4-layer TCP/IP suite',
      'Perform IPv4 subnetting with Classless Inter-Domain Routing (CIDR) and calculate host ranges',
      'Dissect the TCP 3-way handshake, 4-way termination, sliding window flow control, and Reno/Cubic congestion control',
      'Explain application layer protocols including DNS recursion, HTTP/2 multiplexing, and HTTP/3 QUIC over UDP',
      'Understand packet filtering, firewalls, NAT, and asymmetric TLS cryptographic handshakes'
    ],
    totalModulesCount: 5,
    totalTopicsCount: 22,
    completedTopicsCount: 22,
    completionPercentage: 100,
    createdAt: '2025-01-25T00:00:00.000Z',
    updatedAt: '2026-02-14T00:00:00.000Z',
    modules: [
      {
        id: 'mod-cn-1',
        courseId: 'course-cn',
        title: 'Module 1: Reference Models & Architecture',
        order: 1,
        description: 'Layering principles, encapsulation/decapsulation, PDU nomenclature, OSI vs TCP/IP.',
        chapters: [
          {
            id: 'chap-cn-models',
            moduleId: 'mod-cn-1',
            title: 'OSI vs TCP/IP Layers',
            order: 1,
            topics: [
              {
                id: 'topic-cn-osi-model',
                chapterId: 'chap-cn-models',
                courseId: 'course-cn',
                title: 'OSI 7-Layer Model & Protocol Encapsulation',
                order: 1,
                estimatedMinutes: 30,
                difficulty: 'Beginner',
                isFoundational: true,
                content: {
                  topicId: 'topic-cn-osi-model',
                  introduction: 'The Open Systems Interconnection (OSI) model is a conceptual framework established by the ISO to standardize telecommunication and computing functions regardless of underlying vendor hardware.',
                  definition: 'The OSI model decomposes network communication into seven hierarchical abstraction layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.',
                  whyImportant: 'Provides modularity: engineers can update Wi-Fi hardware (Physical/Data Link) without altering how Web browsers render HTML (Application layer).',
                  howItWorks: 'During transmission, data moves down from Application to Physical, where each layer prepends a protocol header (Encapsulation). Upon receipt, the receiver traverses upward, inspecting and stripping headers (Decapsulation).',
                  detailedExplanation: '1. Physical (L1): Bitstream transmission over fiber, copper, or radio (PDUs: Bits).\n2. Data Link (L2): Media Access Control (MAC), Ethernet framing, error detection via CRC (PDUs: Frames).\n3. Network (L3): Logical IP addressing, packet routing across autonomous systems (PDUs: Packets).\n4. Transport (L4): End-to-end reliability, port multiplexing, segmentation, flow/congestion control (TCP/UDP, PDUs: Segments/Datagrams).\n5. Session (L5): Dialog control, session synchronization.\n6. Presentation (L6): Data formatting, encryption/decryption (TLS), compression.\n7. Application (L7): User application network interfaces (HTTP, DNS, SSH, SMTP).',
                  syntax: 'Data -> [L7 Header] Data -> [L4 Header][L7 Data] (Segment) -> [L3 Header][L4 Segment] (Packet) -> [L2 Header][L3 Packet][L2 Trailer] (Frame) -> 010101 (Bits)',
                  examples: [
                    {
                      title: 'Inspecting Protocol Layers and Headers in Python',
                      code: `import socket\n\n# Lookup IP (Layer 3) for hostname (Layer 7)\nhostname = "google.com"\nip_address = socket.gethostbyname(hostname)\nprint(f"L7 DNS query resolved {hostname} -> L3 IP: {ip_address}")\n\n# Open TCP socket (Layer 4)\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\ns.connect((ip_address, 80))\n\n# Transmit HTTP GET Request (Layer 7)\nhttp_request = b"GET / HTTP/1.1\\r\\nHost: google.com\\r\\nConnection: close\\r\\n\\r\\n"\ns.sendall(http_request)\n\n# Receive first 200 bytes of response\nresponse = s.recv(200)\nprint("L7 Response snippet:\\n", response.decode('utf-8', errors='ignore'))\ns.close()`,
                      language: 'python',
                      explanation: 'Step 1: Performs L7 DNS resolution to an L3 IPv4 address. Step 2: Establishes an L4 TCP connection. Step 3: Sends an L7 HTTP request over the wire.',
                      output: `L7 DNS query resolved google.com -> L3 IP: 142.250.190.46\nL7 Response snippet:\n HTTP/1.1 301 Moved Permanently\nLocation: http://www.google.com/\nContent-Type: text/html; charset=UTF-8`
                    },
                    {
                      title: 'IPv4 CIDR Subnet Calculation in Python',
                      code: `import ipaddress\n\nnetwork = ipaddress.ip_network('192.168.10.0/26')\nprint("Network address:", network.network_address)\nprint("Broadcast address:", network.broadcast_address)\nprint("Subnet mask:", network.netmask)\nprint("Total usable hosts:", network.num_addresses - 2)\nprint("Usable IP range:", f"{list(network.hosts())[0]} - {list(network.hosts())[-1]}")`,
                      language: 'python',
                      explanation: 'A /26 subnet reserves 26 bits for network ID and 6 bits for hosts. 2^6 = 64 total addresses; subtracting network and broadcast yields 62 usable host addresses.',
                      output: `Network address: 192.168.10.0\nBroadcast address: 192.168.10.63\nSubnet mask: 255.255.255.192\nTotal usable hosts: 62\nUsable IP range: 192.168.10.1 - 192.168.10.62`
                    }
                  ],
                  realWorldApplications: [
                    'Network troubleshooting with Wireshark to inspect packet dropouts at specific layers',
                    'Designing enterprise cloud VPCs (Virtual Private Clouds) on AWS/GCP with secure public/private subnets',
                    'Configuring Layer 7 reverse proxies (Nginx, Envoy) and Layer 4 load balancers'
                  ],
                  commonErrors: [
                    'Believing the router inspects application payload data (standard L3 routers only inspect L3 IP headers and routing tables)',
                    'Confusing MAC addresses (physical, burned into NIC, L2) with IP addresses (logical, routable, L3)'
                  ],
                  interviewQuestions: [
                    {
                      question: 'What happens from a networking perspective when you type a URL into a browser and hit Enter?',
                      answer: '1. Browser checks cache; if miss, performs DNS query (UDP 53) to resolve IP. 2. Initiates TCP 3-way handshake (SYN, SYN-ACK, ACK) on port 443. 3. Performs TLS cryptographic handshake (ClientHello, ServerHello, Certificate, Key Exchange). 4. Sends HTTP GET request over encrypted tunnel. 5. Server responds with HTML/CSS, browser parses DOM and renders page.',
                      difficulty: 'Hard'
                    }
                  ],
                  practiceExercise: 'Given the IP address 172.16.0.0/20, compute the network mask, broadcast address, and total usable host count.',
                  summary: 'The OSI model defines seven communication layers. Encapsulation wraps data with layer headers as it descends to the physical medium.'
                },
                assessment: [
                  {
                    id: 'q-cn-osi-1',
                    type: 'mcq',
                    question: 'Which layer of the OSI model is responsible for routing packets across multiple autonomous networks?',
                    options: ['Data Link Layer (Layer 2)', 'Network Layer (Layer 3)', 'Transport Layer (Layer 4)', 'Session Layer (Layer 5)'],
                    correctAnswer: 1,
                    explanation: 'The Network Layer (Layer 3) handles logical IP addressing and packet routing across intermediate nodes and networks.',
                    difficulty: 'Beginner'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // 5. Operating Systems
  {
    id: 'course-os',
    slug: 'operating-systems',
    title: 'Operating Systems',
    category: 'Computer Science Core',
    shortDescription: 'Process scheduling, Threads, Semaphores & Mutexes, Deadlocks, Virtual Memory Paging, and File Systems.',
    longDescription: 'Comprehensive OS course detailing kernel architecture, context switching, CPU scheduling algorithms (Round Robin, SJF, Priority), IPC, critical sections (Peterson, semaphores), Banker’s algorithm, TLB, page replacement (LRU, FIFO), and disk scheduling.',
    iconName: 'Cpu',
    badgeColor: 'amber',
    level: 'Intermediate',
    prerequisites: ['C programming and basic computer organization'],
    learningObjectives: [
      'Analyze process control blocks (PCB), process state transitions, and context switching overhead',
      'Evaluate CPU scheduling policies: FCFS, SJF, SRTF, Round Robin, and Multi-level feedback queues',
      'Solve race conditions using mutexes, counting semaphores, and condition variables',
      'Detect and prevent deadlocks using Resource Allocation Graphs and Banker’s Algorithm',
      'Master virtual memory architecture, inverted page tables, TLB hits/misses, and LRU page replacement'
    ],
    totalModulesCount: 5,
    totalTopicsCount: 20,
    completedTopicsCount: 20,
    completionPercentage: 100,
    createdAt: '2025-01-28T00:00:00.000Z',
    updatedAt: '2026-02-16T00:00:00.000Z',
    modules: [
      {
        id: 'mod-os-1',
        courseId: 'course-os',
        title: 'Module 1: Processes, Threads & Synchronization',
        order: 1,
        description: 'Process life cycle, fork() mechanics, race conditions, and synchronization primitives.',
        chapters: [
          {
            id: 'chap-os-sync',
            moduleId: 'mod-os-1',
            title: 'Process Synchronization',
            order: 1,
            topics: [
              {
                id: 'topic-os-semaphores',
                chapterId: 'chap-os-sync',
                courseId: 'course-os',
                title: 'Critical Section Problem & Semaphores',
                order: 1,
                estimatedMinutes: 35,
                difficulty: 'Intermediate',
                isFoundational: true,
                content: {
                  topicId: 'topic-os-semaphores',
                  introduction: 'When concurrent threads or processes access shared memory or variables simultaneously, non-deterministic race conditions occur unless execution inside the Critical Section is synchronized.',
                  definition: 'A Semaphore is an atomic synchronization integer variable S that is accessed only via two standard atomic operations: wait() (also known as P() or acquire) and signal() (also known as V() or release).',
                  whyImportant: 'Prevents race conditions where two threads concurrently decrementing a shared bank balance corrupt memory, leading to lost updates or buffer overflows.',
                  howItWorks: '1. Counting Semaphore: Value range is unrestricted, representing available instances of a shared resource.\n2. Binary Semaphore (Mutex): Value is 0 or 1, providing mutual exclusion.\n3. wait(S): If S <= 0, the thread blocks/sleeps in a waiting queue. If S > 0, S is decremented.\n4. signal(S): S is incremented, and one waiting thread is awakened and moved to the ready queue.',
                  detailedExplanation: 'Three mandatory criteria for any valid critical section solution:\n1. Mutual Exclusion: If process P is executing in its critical section, no other process can enter.\n2. Progress: If no process is executing in its critical section, only processes not in remainder sections can participate in deciding who enters next.\n3. Bounded Waiting: There exists a limit on the number of times other processes are allowed to enter their critical sections after a process has made a request.',
                  syntax: 'wait(S): \n    while S <= 0: pass # or block\n    S = S - 1\n\nsignal(S):\n    S = S + 1 # awaken waiting thread',
                  examples: [
                    {
                      title: 'Producer-Consumer Problem with Python Bounded Semaphore',
                      code: `import threading\nimport time\nimport queue\n\nbuffer = queue.Queue(maxsize=3)\nmutex = threading.Lock()\nitems_produced = 0\n\ndef producer():\n    for i in range(5):\n        time.sleep(0.05)\n        with mutex:\n            buffer.put(f"Packet_{i}")\n            print(f"[Producer] Produced Packet_{i} (Buffer size: {buffer.qsize()})")\n\ndef consumer():\n    for i in range(5):\n        time.sleep(0.1)\n        with mutex:\n            item = buffer.get()\n            print(f"[Consumer] Consumed {item} (Remaining: {buffer.qsize()})")\n\nt1 = threading.Thread(target=producer)\nt2 = threading.Thread(target=consumer)\nt1.start(); t2.start()\nt1.join(); t2.join()`,
                      language: 'python',
                      explanation: 'The mutex guarantees that producer and consumer threads never mutate the shared buffer queue simultaneously, preventing race conditions.',
                      output: `[Producer] Produced Packet_0 (Buffer size: 1)\n[Producer] Produced Packet_1 (Buffer size: 2)\n[Consumer] Consumed Packet_0 (Remaining: 1)\n[Producer] Produced Packet_2 (Buffer size: 2)\n[Consumer] Consumed Packet_1 (Remaining: 1)`
                    }
                  ],
                  realWorldApplications: [
                    'Database connection pooling restricting max active queries to database capacity',
                    'Thread pool task executors in web servers (Apache, Tomcat)',
                    'Audio/video rendering stream buffers'
                  ],
                  commonErrors: [
                    'Inverting order of wait() calls causing immediate deadlocks',
                    'Forgetting to call signal(), leaving all other threads permanently starved'
                  ],
                  interviewQuestions: [
                    {
                      question: 'What is the difference between a Mutex and a Semaphore?',
                      answer: 'A Mutex is a locking mechanism with ownership: only the thread that locked it can unlock it. A Semaphore is a signaling mechanism without ownership: any thread can signal to wake another waiting thread.',
                      difficulty: 'Medium'
                    }
                  ],
                  practiceExercise: 'Explain the Dining Philosophers Problem and implement a deadlock-free solution using asymmetric picking of chopsticks.',
                  summary: 'Semaphores are atomic integer synchronization primitives. They enforce mutual exclusion and coordinate resource sharing across concurrent threads.'
                },
                assessment: [
                  {
                    id: 'q-os-sem-1',
                    type: 'mcq',
                    question: 'Which of the following is NOT a mandatory condition for a valid solution to the Critical Section problem?',
                    options: ['Mutual Exclusion', 'Progress', 'Bounded Waiting', 'Preemptive Priority'],
                    correctAnswer: 3,
                    explanation: 'The three formal criteria are Mutual Exclusion, Progress, and Bounded Waiting. Preemptive priority is a scheduling policy, not a critical section criterion.',
                    difficulty: 'Intermediate'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // 6. C++ Programming
  {
    id: 'course-cpp',
    slug: 'cpp-programming',
    title: 'C++ Programming & STL',
    category: 'Programming Languages',
    shortDescription: 'Modern C++ (C++17/20), pointers, memory management, templates, Standard Template Library (STL), and competitive programming patterns.',
    longDescription: 'Comprehensive C++ curriculum covering stack vs heap memory, raw and smart pointers (unique_ptr, shared_ptr), RAII, templates, operator overloading, and high-performance STL containers (vector, map, unordered_set, priority_queue).',
    iconName: 'Terminal',
    badgeColor: 'blue',
    level: 'Beginner',
    prerequisites: ['Basic logical thinking'],
    learningObjectives: [
      'Master C++ memory architecture: pointers, references, and pointer arithmetic',
      'Implement Resource Acquisition Is Initialization (RAII) and smart pointers',
      'Leverage generic programming with function and class templates',
      'Master competitive programming with C++ STL containers and algorithms'
    ],
    totalModulesCount: 5,
    totalTopicsCount: 20,
    completedTopicsCount: 20,
    completionPercentage: 100,
    createdAt: '2025-01-30T00:00:00.000Z',
    updatedAt: '2026-02-17T00:00:00.000Z'
  },

  // 7. Java Programming
  {
    id: 'course-java',
    slug: 'java-programming',
    title: 'Java Programming & JVM',
    category: 'Programming Languages',
    shortDescription: 'Core Java, JVM memory model, garbage collection, OOP, Collections Framework, multithreading, and Streams API.',
    longDescription: 'Enterprise Java masterclass detailing JVM internals (ClassLoader, Heap, Stack, Metaspace), garbage collection algorithms, OOP design patterns, Java Collections Framework, lambda expressions, and Streams API.',
    iconName: 'Coffee',
    badgeColor: 'amber',
    level: 'All Levels',
    prerequisites: ['Basic programming syntax'],
    learningObjectives: [
      'Understand JVM architecture, bytecode verification, and Garbage Collection',
      'Build robust OOP systems using Interfaces, Abstract Classes, and Encapsulation',
      'Master Java Collections Framework: HashMap collision resolution, ArrayList vs LinkedList',
      'Harness modern Java functional features: Lambdas, Streams, and Optionals'
    ],
    totalModulesCount: 6,
    totalTopicsCount: 24,
    completedTopicsCount: 24,
    completionPercentage: 100,
    createdAt: '2025-02-01T00:00:00.000Z',
    updatedAt: '2026-02-18T00:00:00.000Z'
  },

  // 8. React.js
  {
    id: 'course-react',
    slug: 'react-js',
    title: 'React.js & Modern Frontend',
    category: 'Web Development',
    shortDescription: 'Virtual DOM, JSX, Hooks (useState, useEffect, useMemo), Context API, component lifecycle, and state architecture.',
    longDescription: 'Production React masterclass covering Virtual DOM reconciliation, Fiber architecture, custom hooks, performance profiling, optimistic UI updates, and clean scalable state management patterns.',
    iconName: 'Atom',
    badgeColor: 'cyan',
    level: 'Intermediate',
    prerequisites: ['Modern JavaScript (ES6+), HTML5, and CSS3'],
    learningObjectives: [
      'Explain React Fiber reconciliation algorithm and the Virtual DOM diffing process',
      'Master hooks: useState, useEffect, useRef, useMemo, useCallback, and custom hooks',
      'Manage global state with Context API and state machines',
      'Optimize component renders, memoization, and bundle code splitting'
    ],
    totalModulesCount: 5,
    totalTopicsCount: 20,
    completedTopicsCount: 20,
    completionPercentage: 100,
    createdAt: '2025-02-05T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 9. C Programming
  {
    id: 'course-c',
    slug: 'c-programming',
    title: 'C Programming',
    category: 'Programming Languages',
    shortDescription: 'Foundational programming in C: pointers, memory allocation (malloc/free), structs, unions, and file I/O.',
    longDescription: 'The mother of modern languages: learn raw memory addresses, pointers to pointers, dynamic memory allocation with malloc and free, structures, bitwise operators, and low-level system calls.',
    iconName: 'Cpu',
    badgeColor: 'blue',
    level: 'Beginner',
    prerequisites: ['None'],
    learningObjectives: ['Master pointers and memory offsets', 'Handle dynamic memory allocation without memory leaks', 'Build modular C programs with header files'],
    totalModulesCount: 5,
    totalTopicsCount: 18,
    completedTopicsCount: 18,
    completionPercentage: 100,
    createdAt: '2025-02-06T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 10. JavaScript
  {
    id: 'course-js',
    slug: 'javascript',
    title: 'Modern JavaScript (ES6+)',
    category: 'Programming Languages',
    shortDescription: 'Prototypes, closures, the Event Loop, asynchronous Promises, async/await, and V8 engine optimizations.',
    longDescription: 'Deep dive into the JavaScript execution context, call stack, microtask queue, lexical scoping, closures, prototype chaining, ES6 modules, and asynchronous event loops.',
    iconName: 'Code',
    badgeColor: 'amber',
    level: 'All Levels',
    prerequisites: ['Basic HTML/CSS'],
    learningObjectives: ['Master asynchronous JS with Promises and async/await', 'Understand lexical scope and closures', 'Master the browser and Node.js Event Loop'],
    totalModulesCount: 6,
    totalTopicsCount: 22,
    completedTopicsCount: 22,
    completionPercentage: 100,
    createdAt: '2025-02-07T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 11. TypeScript
  {
    id: 'course-ts',
    slug: 'typescript',
    title: 'TypeScript for Production',
    category: 'Programming Languages',
    shortDescription: 'Static typing, generics, utility types, unions, type narrowing, interfaces, and building type-safe applications.',
    longDescription: 'Learn type-level programming in TypeScript: discriminated unions, generics, mapped types, template literal types, tsconfig optimization, and strict production type safety.',
    iconName: 'FileCode',
    badgeColor: 'blue',
    level: 'Intermediate',
    prerequisites: ['Modern JavaScript'],
    learningObjectives: ['Implement advanced generics and utility types', 'Harness strict null checks and type guards', 'Build type-safe full-stack architectures'],
    totalModulesCount: 4,
    totalTopicsCount: 16,
    completedTopicsCount: 16,
    completionPercentage: 100,
    createdAt: '2025-02-08T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 12. HTML
  {
    id: 'course-html',
    slug: 'html5',
    title: 'HTML5 & Web Semantics',
    category: 'Web Development',
    shortDescription: 'Semantic markup, accessibility (a11y), forms, SEO metadata, canvas, and web performance.',
    longDescription: 'Semantic HTML5 engineering: accessible document outlines, WAI-ARIA roles, audio/video APIs, canvas graphics, and modern search engine optimization architecture.',
    iconName: 'Layout',
    badgeColor: 'amber',
    level: 'Beginner',
    prerequisites: ['None'],
    learningObjectives: ['Write clean semantic HTML', 'Build accessible web forms', 'Configure responsive meta tags and structured data'],
    totalModulesCount: 4,
    totalTopicsCount: 14,
    completedTopicsCount: 14,
    completionPercentage: 100,
    createdAt: '2025-02-09T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 13. CSS
  {
    id: 'course-css',
    slug: 'css3',
    title: 'CSS3 & Modern Layouts',
    category: 'Web Development',
    shortDescription: 'Flexbox, CSS Grid, animations, specificity, media queries, CSS variables, and modern responsive design.',
    longDescription: 'Master the CSS box model, stacking contexts (z-index), Flexbox alignment, CSS Grid 2D layouts, transitions, keyframe animations, and custom design systems.',
    iconName: 'Palette',
    badgeColor: 'blue',
    level: 'Beginner',
    prerequisites: ['HTML5'],
    learningObjectives: ['Master Flexbox and CSS Grid layout algorithms', 'Create fluid responsive interfaces for all screen sizes', 'Build performant 60fps animations'],
    totalModulesCount: 5,
    totalTopicsCount: 18,
    completedTopicsCount: 18,
    completionPercentage: 100,
    createdAt: '2025-02-10T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 14. JavaScript DOM and Events
  {
    id: 'course-dom',
    slug: 'javascript-dom-events',
    title: 'JavaScript DOM & Events',
    category: 'Web Development',
    shortDescription: 'DOM tree manipulation, event bubbling & capturing, delegation, MutationObserver, and Web APIs.',
    longDescription: 'Comprehensive browser engineering: query selectors, dynamic node creation, event delegation, custom events, throttling & debouncing, and intersection observers.',
    iconName: 'MousePointer',
    badgeColor: 'amber',
    level: 'Beginner',
    prerequisites: ['HTML, CSS, JavaScript'],
    learningObjectives: ['Master event bubbling, capturing, and delegation', 'Manipulate the DOM efficiently with minimal repaints', 'Build interactive widgets and infinite scrolls'],
    totalModulesCount: 4,
    totalTopicsCount: 15,
    completedTopicsCount: 15,
    completionPercentage: 100,
    createdAt: '2025-02-11T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 15. Node.js
  {
    id: 'course-node',
    slug: 'nodejs',
    title: 'Node.js Backend Architecture',
    category: 'Web Development',
    shortDescription: 'V8 runtime, libuv, event loop, streams, buffers, file system, clustering, and worker threads.',
    longDescription: 'Master server-side JavaScript with Node.js: non-blocking asynchronous I/O, streams and piping, buffers, child processes, clustering, and microservice backends.',
    iconName: 'Server',
    badgeColor: 'emerald',
    level: 'Intermediate',
    prerequisites: ['Modern JavaScript'],
    learningObjectives: ['Master the Node.js event loop phases and libuv thread pool', 'Handle large binary streams and memory buffers', 'Implement worker threads and clustering'],
    totalModulesCount: 5,
    totalTopicsCount: 18,
    completedTopicsCount: 18,
    completionPercentage: 100,
    createdAt: '2025-02-12T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 16. Express.js
  {
    id: 'course-express',
    slug: 'expressjs',
    title: 'Express.js Framework',
    category: 'Web Development',
    shortDescription: 'Middleware pipelines, routing, error handling, validation, security headers, and JWT auth.',
    longDescription: 'Build battle-tested HTTP servers with Express.js: custom middleware chains, router nesting, file uploads, rate limiting, CORS configuration, and token authentication.',
    iconName: 'Layers',
    badgeColor: 'emerald',
    level: 'Intermediate',
    prerequisites: ['Node.js fundamentals'],
    learningObjectives: ['Design modular middleware pipelines', 'Implement secure JWT authentication and authorization', 'Handle centralized errors gracefully'],
    totalModulesCount: 4,
    totalTopicsCount: 16,
    completedTopicsCount: 16,
    completionPercentage: 100,
    createdAt: '2025-02-13T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 17. REST API Development
  {
    id: 'course-rest',
    slug: 'rest-api-development',
    title: 'REST API Design & Architecture',
    category: 'Web Development',
    shortDescription: 'HTTP verbs, status codes, idempotency, HATEOAS, pagination, rate limiting, and OpenAPI/Swagger specs.',
    longDescription: 'Design professional RESTful APIs: proper resource naming, pagination with cursors, status code semantics, API versioning, authentication headers, and OpenAPI documentation.',
    iconName: 'Globe',
    badgeColor: 'cyan',
    level: 'Intermediate',
    prerequisites: ['Backend basics'],
    learningObjectives: ['Design idempotent RESTful endpoints', 'Implement robust cursor pagination and filtering', 'Document APIs with Swagger/OpenAPI'],
    totalModulesCount: 4,
    totalTopicsCount: 14,
    completedTopicsCount: 14,
    completionPercentage: 100,
    createdAt: '2025-02-14T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 18. Full Stack Development
  {
    id: 'course-fullstack',
    slug: 'full-stack-development',
    title: 'Full Stack Engineering',
    category: 'Web Development',
    shortDescription: 'End-to-end web engineering: React frontend, Node/Express backend, database persistence, and cloud deployment.',
    longDescription: 'Connect all layers of modern software engineering: state synchronization, SSR vs SPA, JWT cookies, database migrations, CI/CD pipelines, and production containerization.',
    iconName: 'Cpu',
    badgeColor: 'violet',
    level: 'Advanced',
    prerequisites: ['React and Node.js'],
    learningObjectives: ['Architect full-stack monolithic and microservice systems', 'Implement secure user authentication with cookies and JWT', 'Deploy scalable cloud applications'],
    totalModulesCount: 6,
    totalTopicsCount: 22,
    completedTopicsCount: 22,
    completionPercentage: 100,
    createdAt: '2025-02-15T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 19. Design and Analysis of Algorithms
  {
    id: 'course-daa',
    slug: 'design-analysis-algorithms',
    title: 'Design & Analysis of Algorithms',
    category: 'Computer Science Core',
    shortDescription: 'Divide & Conquer, Greedy approaches, Dynamic Programming, Backtracking, Branch & Bound, and NP-Completeness.',
    longDescription: 'Formal university algorithms curriculum: Master Theorem recurrence relations, Strassen matrix multiplication, Kruskal/Prim MST, Huffman coding, Knapsack DP, 0/1 Knapsack, and P vs NP.',
    iconName: 'GitBranch',
    badgeColor: 'violet',
    level: 'Advanced',
    prerequisites: ['Data Structures'],
    learningObjectives: ['Solve recurrence relations using Master Theorem', 'Design optimal Dynamic Programming transitions', 'Understand NP-Hard and NP-Complete reductions'],
    totalModulesCount: 5,
    totalTopicsCount: 20,
    completedTopicsCount: 20,
    completionPercentage: 100,
    createdAt: '2025-02-16T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 20. Object-Oriented Programming
  {
    id: 'course-oop',
    slug: 'object-oriented-programming',
    title: 'Object-Oriented Programming (OOP)',
    category: 'Computer Science Core',
    shortDescription: 'The 4 pillars (Encapsulation, Abstraction, Inheritance, Polymorphism), SOLID principles, and Design Patterns.',
    longDescription: 'Deep conceptual OOP mastery: method overriding vs overloading, dynamic dispatch, abstract classes, interfaces, composition over inheritance, and Gang of Four (GoF) design patterns.',
    iconName: 'Box',
    badgeColor: 'blue',
    level: 'All Levels',
    prerequisites: ['Any programming language'],
    learningObjectives: ['Apply the 4 OOP pillars to real-world architectures', 'Implement SOLID design principles', 'Utilize Factory, Singleton, and Observer design patterns'],
    totalModulesCount: 4,
    totalTopicsCount: 16,
    completedTopicsCount: 16,
    completionPercentage: 100,
    createdAt: '2025-02-17T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 21. SQL
  {
    id: 'course-sql',
    slug: 'sql-mastery',
    title: 'SQL & Database Queries',
    category: 'Computer Science Core',
    shortDescription: 'DDL, DML, DCL, TCL, complex Joins, Window Functions (RANK, OVER), CTEs, and query optimization.',
    longDescription: 'Master relational data querying: SELECT filtering, aggregate GROUP BY, multiple JOIN types, Common Table Expressions (WITH queries), analytic window functions, and indexing strategies.',
    iconName: 'Database',
    badgeColor: 'emerald',
    level: 'All Levels',
    prerequisites: ['Basic database concepts'],
    learningObjectives: ['Master complex multi-table joins and subqueries', 'Write advanced window functions for placement assessments', 'Analyze EXPLAIN query execution plans'],
    totalModulesCount: 5,
    totalTopicsCount: 18,
    completedTopicsCount: 18,
    completionPercentage: 100,
    createdAt: '2025-02-18T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 22. Computer Organization & Architecture
  {
    id: 'course-coa',
    slug: 'computer-organization-architecture',
    title: 'Computer Organization & Architecture',
    category: 'Computer Science Core',
    shortDescription: 'Instruction Set Architecture (ISA), CPU pipelines, cache memory hierarchy, hazards, and branch prediction.',
    longDescription: 'Inside the microprocessor: Von Neumann vs Harvard architecture, RISC vs CISC, pipelining stages, data and control hazards, cache mapping (direct, associative), and RAM/ROM technology.',
    iconName: 'Cpu',
    badgeColor: 'violet',
    level: 'Intermediate',
    prerequisites: ['Digital electronics basics'],
    learningObjectives: ['Analyze 5-stage CPU instruction pipelining', 'Calculate cache hit ratios and memory latency', 'Identify pipeline data and branch hazards'],
    totalModulesCount: 4,
    totalTopicsCount: 15,
    completedTopicsCount: 15,
    completionPercentage: 100,
    createdAt: '2025-02-19T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 23. Software Engineering
  {
    id: 'course-se',
    slug: 'software-engineering',
    title: 'Software Engineering & SDLC',
    category: 'Computer Science Core',
    shortDescription: 'Agile, Scrum, Waterfall, requirements engineering, UML modeling, software testing, and CI/CD.',
    longDescription: 'Professional engineering workflows: Software Development Life Cycle models, user stories, Sprint planning, UML class and sequence diagrams, unit/integration testing, and quality assurance.',
    iconName: 'CheckSquare',
    badgeColor: 'emerald',
    level: 'Beginner',
    prerequisites: ['Basic programming'],
    learningObjectives: ['Execute Agile Scrum ceremonies and sprint backlogs', 'Design UML architectural diagrams', 'Write automated unit test cases and calculate code coverage'],
    totalModulesCount: 4,
    totalTopicsCount: 14,
    completedTopicsCount: 14,
    completionPercentage: 100,
    createdAt: '2025-02-20T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 24. Computer Security
  {
    id: 'course-comp-sec',
    slug: 'computer-security',
    title: 'Computer Security Fundamentals',
    category: 'Computer Science Core',
    shortDescription: 'CIA triad, symmetric/asymmetric encryption, SHA hashing, digital signatures, certificates, and access control.',
    longDescription: 'Core cryptography and system defense: AES symmetric cipher, RSA asymmetric key pairs, cryptographic hash functions (SHA-256), public key infrastructure (PKI), and role-based access control.',
    iconName: 'Shield',
    badgeColor: 'rose',
    level: 'Intermediate',
    prerequisites: ['Computer Networks basics'],
    learningObjectives: ['Implement AES and RSA cryptographic operations', 'Understand digital certificates and PKI authentication', 'Enforce secure access control policies'],
    totalModulesCount: 4,
    totalTopicsCount: 15,
    completedTopicsCount: 15,
    completionPercentage: 100,
    createdAt: '2025-02-21T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 25. Artificial Intelligence
  {
    id: 'course-ai',
    slug: 'artificial-intelligence',
    title: 'Artificial Intelligence',
    category: 'Advanced Technologies',
    shortDescription: 'Search algorithms (A*, Minimax), knowledge representation, expert systems, game theory, and probabilistic reasoning.',
    longDescription: 'Comprehensive AI curriculum: state-space search, heuristic evaluation with A* search, adversarial Minimax game trees with Alpha-Beta pruning, constraint satisfaction, and Bayesian networks.',
    iconName: 'Sparkles',
    badgeColor: 'violet',
    level: 'Intermediate',
    prerequisites: ['Python and Discrete Math'],
    learningObjectives: ['Implement uninformed and heuristic A* search algorithms', 'Build game playing agents with Minimax and Alpha-Beta pruning', 'Formulate Bayesian probabilistic inferences'],
    totalModulesCount: 5,
    totalTopicsCount: 18,
    completedTopicsCount: 18,
    completionPercentage: 100,
    createdAt: '2025-02-22T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 26. Machine Learning
  {
    id: 'course-ml',
    slug: 'machine-learning',
    title: 'Machine Learning',
    category: 'Advanced Technologies',
    shortDescription: 'Supervised & Unsupervised learning, Linear Regression, Logistic Regression, Decision Trees, SVM, and Clustering.',
    longDescription: 'Practical machine learning: cost function gradient descent, bias-variance tradeoff, regularization (L1/L2), Random Forests, Support Vector Machines, K-Means clustering, and scikit-learn pipelines.',
    iconName: 'TrendingUp',
    badgeColor: 'violet',
    level: 'Intermediate',
    prerequisites: ['Python, Linear Algebra, and Statistics'],
    learningObjectives: ['Train classification and regression models', 'Tune hyperparameters and validate with cross-validation', 'Evaluate metrics: Precision, Recall, F1-Score, ROC-AUC'],
    totalModulesCount: 6,
    totalTopicsCount: 22,
    completedTopicsCount: 22,
    completionPercentage: 100,
    createdAt: '2025-02-23T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 27. Deep Learning
  {
    id: 'course-dl',
    slug: 'deep-learning',
    title: 'Deep Learning & Neural Networks',
    category: 'Advanced Technologies',
    shortDescription: 'Perceptrons, Backpropagation, CNNs for computer vision, RNNs/LSTMs, and Transformer attention mechanisms.',
    longDescription: 'Modern neural network engineering: activation functions (ReLU, Sigmoid, Softmax), backpropagation derivation, convolutional feature maps, recurrent sequence models, and Transformer self-attention.',
    iconName: 'Cpu',
    badgeColor: 'violet',
    level: 'Advanced',
    prerequisites: ['Machine Learning and Python'],
    learningObjectives: ['Implement multi-layer perceptrons with backpropagation', 'Train CNNs for computer vision image classification', 'Understand Transformer self-attention mechanisms'],
    totalModulesCount: 5,
    totalTopicsCount: 20,
    completedTopicsCount: 20,
    completionPercentage: 100,
    createdAt: '2025-02-24T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 28. Data Science
  {
    id: 'course-ds',
    slug: 'data-science',
    title: 'Data Science & Analytics',
    category: 'Advanced Technologies',
    shortDescription: 'Pandas, NumPy, exploratory data analysis (EDA), data visualization, statistical hypothesis testing, and storytelling.',
    longDescription: 'End-to-end data analytics workflow: multidimensional array computations with NumPy, data frame filtering and joins with Pandas, statistical hypothesis testing (t-tests, p-values), and visual dashboards.',
    iconName: 'BarChart',
    badgeColor: 'cyan',
    level: 'Beginner',
    prerequisites: ['Python fundamentals'],
    learningObjectives: ['Clean and transform dirty datasets with Pandas', 'Conduct rigorous statistical exploratory data analysis', 'Build interactive visualizations and dashboards'],
    totalModulesCount: 5,
    totalTopicsCount: 18,
    completedTopicsCount: 18,
    completionPercentage: 100,
    createdAt: '2025-02-25T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 29. Cloud Computing
  {
    id: 'course-cloud',
    slug: 'cloud-computing',
    title: 'Cloud Computing Architecture',
    category: 'Advanced Technologies',
    shortDescription: 'IaaS, PaaS, SaaS, AWS/GCP cloud services, virtual machines, serverless, S3 object storage, and Docker containers.',
    longDescription: 'Design scalable distributed cloud infrastructures: compute instances, serverless functions, VPC networking, managed databases, Docker image containerization, and high-availability load balancing.',
    iconName: 'Cloud',
    badgeColor: 'blue',
    level: 'Intermediate',
    prerequisites: ['Computer Networks and Linux basics'],
    learningObjectives: ['Architect fault-tolerant multi-region cloud systems', 'Containerize applications using Docker and Docker Compose', 'Deploy serverless microservices with automated scaling'],
    totalModulesCount: 4,
    totalTopicsCount: 16,
    completedTopicsCount: 16,
    completionPercentage: 100,
    createdAt: '2025-02-26T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 30. Cybersecurity
  {
    id: 'course-cyber',
    slug: 'cybersecurity',
    title: 'Cybersecurity & Ethical Hacking',
    category: 'Advanced Technologies',
    shortDescription: 'OWASP Top 10, SQL Injection, XSS, CSRF, network penetration testing, Wireshark packet capture, and defenses.',
    longDescription: 'Defensive and offensive security engineering: identifying and patching SQL injections, Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), password hashing with bcrypt, and security audits.',
    iconName: 'ShieldAlert',
    badgeColor: 'rose',
    level: 'Intermediate',
    prerequisites: ['Web Development and Computer Networks'],
    learningObjectives: ['Exploit and patch OWASP Top 10 web vulnerabilities', 'Inspect packet anomalies with Wireshark and Nmap', 'Harden production web applications against cyber attacks'],
    totalModulesCount: 5,
    totalTopicsCount: 18,
    completedTopicsCount: 18,
    completionPercentage: 100,
    createdAt: '2025-02-27T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 31. System Design
  {
    id: 'course-sd',
    slug: 'system-design',
    title: 'System Design & Distributed Systems',
    category: 'Advanced Technologies',
    shortDescription: 'Scalability, Load Balancing, Caching (Redis), CAP Theorem, Microservices, Sharding, and designing URL shorteners.',
    longDescription: 'High-level and low-level system design for top tech placements: vertical vs horizontal scaling, reverse proxies, distributed cache invalidation strategies, database replication and sharding, message queues (Kafka, RabbitMQ), and designing Instagram/TinyURL.',
    iconName: 'Server',
    badgeColor: 'amber',
    level: 'Advanced',
    prerequisites: ['Full Stack, DBMS, and Networking'],
    learningObjectives: ['Design high-throughput distributed systems capable of handling millions of QPS', 'Apply CAP Theorem and distributed consistency tradeoffs', 'Architect scalable real-world products like YouTube, TinyURL, and Uber'],
    totalModulesCount: 5,
    totalTopicsCount: 20,
    completedTopicsCount: 20,
    completionPercentage: 100,
    createdAt: '2025-02-28T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  },

  // 32. Git and GitHub
  {
    id: 'course-git',
    slug: 'git-and-github',
    title: 'Git & GitHub Version Control',
    category: 'Advanced Technologies',
    shortDescription: 'Commits, branching, merging, merge conflicts, rebasing, Pull Requests, Git stash, and GitHub collaboration.',
    longDescription: 'Professional version control mastery: internal object model (blobs, trees, commits), branching workflows, resolving nasty merge conflicts, interactive rebasing, cherry-picking, and open-source GitHub Pull Requests.',
    iconName: 'GitCommit',
    badgeColor: 'emerald',
    level: 'Beginner',
    prerequisites: ['None'],
    learningObjectives: ['Master Git branching, merging, and conflict resolution', 'Use git rebase and cherry-pick for clean commit histories', 'Collaborate on GitHub with professional Pull Requests and code reviews'],
    totalModulesCount: 4,
    totalTopicsCount: 15,
    completedTopicsCount: 15,
    completionPercentage: 100,
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2026-02-19T00:00:00.000Z'
  }
];

// Fill the catalog-only courses with readable lesson concepts so every course
// opens with an actual syllabus instead of an empty detail page.
for (const course of SEED_COURSES) {
  if (course.modules?.length) continue;

  const concepts = (course.learningObjectives || []).slice(0, 6);
  if (concepts.length === 0) continue;

  course.modules = [];
  for (let moduleIndex = 0; moduleIndex < concepts.length; moduleIndex += 2) {
    const moduleOrder = course.modules.length + 1;
    const moduleId = `${course.id}-module-${moduleOrder}`;
    const chapterId = `${course.id}-chapter-${moduleOrder}`;
    const topics = concepts.slice(moduleIndex, moduleIndex + 2).map((objective, topicIndex) => {
      const order = moduleIndex + topicIndex + 1;
      const topicId = `${course.id}-concept-${order}`;
      const concept = objective.replace(/^[A-Z][a-z]+\s+/, '').replace(/[.!]$/, '');
      return {
        id: topicId,
        chapterId,
        courseId: course.id,
        title: concept.length > 88 ? `${concept.slice(0, 85)}...` : concept,
        order,
        estimatedMinutes: 25,
        difficulty: order <= 2 ? 'Beginner' as const : 'Intermediate' as const,
        isFoundational: order <= 2,
        content: {
          topicId,
          introduction: `This lesson introduces ${concept.toLowerCase()} as an important part of ${course.title}. You will learn the core idea, how it is used, and how to apply it in practical engineering work.`,
          definition: `${concept} is a core learning outcome in ${course.title}. It describes the principles, techniques, and practices used to solve problems in this area.`,
          whyImportant: `Understanding ${concept.toLowerCase()} helps you build strong fundamentals, make better technical decisions, and explain your approach in academic examinations and placement interviews.`,
          howItWorks: `1. Identify the problem or requirement.\n2. Understand the terminology and underlying principles.\n3. Apply the relevant ${course.title} technique.\n4. Test the result with a small example.\n5. Review correctness, performance, and edge cases.`,
          detailedExplanation: `Study ${concept.toLowerCase()} by connecting the theory with a small practical example. Start with the basic definitions, identify the inputs and expected output, then work through the process step by step. In real projects, this concept is used together with other ${course.title} fundamentals, so pay attention to assumptions, constraints, and common failure cases.`,
          syntax: `// Practice checklist\n// 1. Define the problem\n// 2. Apply: ${concept}\n// 3. Test normal and edge cases`,
          examples: [{
            title: `Applying ${concept}`,
            code: `// Learning exercise: ${concept}\n// Write down the input, the expected result,\n// and the steps required to reach that result.\n\nconst input = "sample";\nconsole.log("Practice concept:", input);`,
            language: 'javascript',
            explanation: `Use this small exercise to describe the workflow for ${concept.toLowerCase()}. Replace the sample input with a realistic example from ${course.title}.`,
            output: `Practice concept: sample`
          }],
          realWorldApplications: [
            `Applying ${concept.toLowerCase()} in academic and capstone projects`,
            `Explaining design choices related to ${course.title} during technical interviews`,
            `Reviewing implementation quality, correctness, and edge cases`
          ],
          commonErrors: [
            'Memorizing definitions without understanding the practical workflow',
            'Ignoring edge cases and assumptions',
            'Skipping tests after implementing the concept'
          ],
          interviewQuestions: [{
            question: `Explain ${concept} and give one practical example.`,
            answer: `${concept} is an important concept in ${course.title}. A strong answer should define it, explain how it works, describe when it is useful, and provide a small example with its expected result.`,
            difficulty: 'Easy' as const
          }],
          practiceExercise: `Prepare a one-page explanation of ${concept}. Include its definition, working steps, one practical example, two edge cases, and one real-world use in ${course.title}.`,
          summary: `${concept} is one of the key concepts in ${course.title}. Focus on the definition, working steps, practical use, and edge cases.`
        },
        assessment: [{
          id: `${topicId}-question-1`,
          type: 'mcq' as const,
          question: `What is the best way to learn and apply ${concept.toLowerCase()}?`,
          options: [
            'Memorize the title without understanding it',
            'Understand the principle, work through an example, and test edge cases',
            'Skip practice and rely only on definitions',
            'Ignore constraints and expected results'
          ],
          correctAnswer: 1,
          explanation: 'Learning a technical concept requires understanding its principle, applying it to an example, and checking edge cases.',
          difficulty: 'Beginner' as const,
          topicId
        }]
      };
    });

    course.modules.push({
      id: moduleId,
      courseId: course.id,
      title: `Module ${moduleOrder}: ${course.title} Fundamentals ${moduleOrder}`,
      order: moduleOrder,
      description: `Core concepts and guided practice for ${course.title}.`,
      chapters: [{
        id: chapterId,
        moduleId,
        title: `Chapter ${moduleOrder}: Concepts and Applications`,
        order: 1,
        topics
      }]
    });
  }

  course.totalModulesCount = course.modules.length;
  course.totalTopicsCount = concepts.length;
  course.completedTopicsCount = 0;
  course.completionPercentage = 0;
}
