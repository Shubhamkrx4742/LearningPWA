import React, { useEffect, useMemo, useState } from "react";
import ReloadPrompt from "./ReloadPrompt";
import AITutor from "./components/AITutor";
import Login from "./components/Login";
import Register from "./components/Register";
import BrainGames from "./games/BrainGames";
import "./App.css";


const FALLBACK_BOOKS = [
  { id: 1, title: "JavaScript: The Good Parts", author: "Douglas Crockford", category: "JavaScript", type: "Programming", level: "Intermediate", icon: "JS", color: "#f7df1e", description: "Learn core JavaScript concepts and write cleaner, maintainable code.", topics: ["Variables", "Functions", "Objects", "Arrays", "Closures"], xpCost: 100 },
  { id: 2, title: "Eloquent JavaScript", author: "Marijn Haverbeke", category: "JavaScript", type: "Programming", level: "Beginner", icon: "JS", color: "#f59e0b", description: "A practical introduction to JavaScript, programming fundamentals, and the web.", topics: ["Basics", "DOM", "Functions", "Objects", "Async"], xpCost: 100 },
  { id: 3, title: "You Don't Know JS", author: "Kyle Simpson", category: "JavaScript", type: "Programming", level: "Advanced", icon: "JS", color: "#111827", description: "Build a deeper understanding of scope, closures, objects, types, and async JavaScript.", topics: ["Scope", "Closures", "Objects", "Types", "Async"], xpCost: 200 },
  { id: 4, title: "Clean Code", author: "Robert C. Martin", category: "Programming", type: "Programming", level: "Intermediate", icon: "</>", color: "#2563eb", description: "Learn principles for writing readable, maintainable, professional software.", topics: ["Naming", "Functions", "Classes", "Errors", "Testing"], xpCost: 150 },
  { id: 5, title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", category: "Programming", type: "Programming", level: "Intermediate", icon: "</>", color: "#7c3aed", description: "Learn practical software development habits, design thinking, debugging, and delivery.", topics: ["Architecture", "DRY", "Debugging", "Testing", "Delivery"], xpCost: 150 },
  { id: 6, title: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "Algorithms", type: "Programming", level: "Advanced", icon: "AL", color: "#dc2626", description: "Study algorithms, data structures, complexity, sorting, graphs, and dynamic programming.", topics: ["Complexity", "Sorting", "Trees", "Graphs", "DP"], xpCost: 250 },
  { id: 7, title: "Head First Design Patterns", author: "Eric Freeman", category: "Design Patterns", type: "Programming", level: "Intermediate", icon: "DP", color: "#0891b2", description: "Learn common object-oriented design patterns and when to use them.", topics: ["Strategy", "Observer", "Factory", "Decorator", "Singleton"], xpCost: 200 },
  { id: 8, title: "Learning React", author: "Alex Banks & Eve Porcello", category: "React", type: "Programming", level: "Beginner", icon: "⚛", color: "#06b6d4", description: "Learn React fundamentals and build modern interactive web applications.", topics: ["Components", "JSX", "Props", "Hooks", "APIs"], xpCost: 150 },
  { id: 9, title: "Python Crash Course", author: "Eric Matthes", category: "Python", type: "Programming", level: "Beginner", icon: "PY", color: "#3776ab", description: "A beginner-friendly introduction to Python programming with practical projects.", topics: ["Syntax", "Lists", "Conditions", "Functions", "Classes"], xpCost: 100 },
  { id: 10, title: "Effective Java", author: "Joshua Bloch", category: "Java", type: "Programming", level: "Advanced", icon: "JV", color: "#ef4444", description: "Learn practical Java best practices for robust and maintainable applications.", topics: ["Classes", "Generics", "Collections", "Streams", "Concurrency"], xpCost: 200 },
  { id: 11, title: "A Short History of Nearly Everything", author: "Bill Bryson", category: "General Knowledge", type: "Knowledge", level: "Beginner", icon: "🌍", color: "#16a34a", description: "Explore science, history, discoveries, Earth, and humanity's understanding of the world.", topics: ["Science", "Earth", "Life", "Humans", "Space"], xpCost: 50 },
  { id: 12, title: "Sapiens", author: "Yuval Noah Harari", category: "History", type: "Knowledge", level: "Intermediate", icon: "🧠", color: "#92400e", description: "Explore major developments in human history, culture, society, and civilization.", topics: ["Origins", "Agriculture", "Cities", "Culture", "Science"], xpCost: 100 },
  { id: 13, title: "Cosmos", author: "Carl Sagan", category: "Science", type: "Knowledge", level: "Beginner", icon: "🌌", color: "#4f46e5", description: "Discover astronomy, stars, planets, science, and humanity's place in the universe.", topics: ["Universe", "Stars", "Planets", "Time", "Life"], xpCost: 100 },
  { id: 14, title: "The Psychology of Money", author: "Morgan Housel", category: "Finance", type: "Knowledge", level: "Beginner", icon: "💰", color: "#059669", description: "Learn how behavior, emotions, and decisions influence financial outcomes.", topics: ["Behavior", "Saving", "Compounding", "Risk", "Planning"], xpCost: 100 },
  { id: 15, title: "Atomic Habits", author: "James Clear", category: "Self Development", type: "Knowledge", level: "Beginner", icon: "🎯", color: "#db2777", description: "Learn practical ideas for building better habits and improving consistently.", topics: ["Habits", "Cues", "Motivation", "Friction", "Consistency"], xpCost: 100 },
  { id: 16, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Psychology", type: "Knowledge", level: "Advanced", icon: "🧩", color: "#9333ea", description: "Explore how people think, make decisions, use mental shortcuts, and experience bias.", topics: ["Thinking", "Heuristics", "Availability", "Anchoring", "Bias"], xpCost: 200 },
];

const FALLBACK_CHAPTERS = {
  1: [
    ["Values, Variables & Types", "Learn how JavaScript stores information.", "JavaScript works with strings, numbers, booleans, objects, null and undefined. Use const when a binding should not be reassigned and let when it needs reassignment.", `const name = "LearnHub";\nlet score = 0;\nscore += 10;\nconsole.log(name, score);`, "Which keyword is best when a binding will not be reassigned?", ["var", "let", "const", "value"], "const"],
    ["Functions & Parameters", "Create reusable blocks of behavior.", "Functions reduce repetition. Parameters receive input and return can send a result back to the caller.", `function add(a, b) {\n  return a + b;\n}\nconsole.log(add(10, 20));`, "What does return do?", ["Starts a loop", "Sends a value back", "Deletes a variable", "Imports a module"], "Sends a value back"],
    ["Objects", "Group related data and behavior.", "Objects store properties as key-value pairs and are commonly used to model real-world entities.", `const student = {\n  name: "Alex",\n  course: "React"\n};\nconsole.log(student.course);`, "How do you read course?", ["student->course", "student.course", "course.student", "student/course"], "student.course"],
    ["Arrays & Methods", "Work with collections efficiently.", "Arrays store ordered values. map, filter and find are useful for transforming and searching collections.", `const numbers = [1, 2, 3];\nconst doubled = numbers.map(n => n * 2);`, "Which method transforms every item into a new array?", ["map", "push", "pop", "findIndex"], "map"],
    ["Scope & Closures", "Understand lexical scope and remembered state.", "Scope controls where variables are visible. A closure allows a function to retain access to surrounding variables.", `function counter() {\n  let count = 0;\n  return () => ++count;\n}\nconst next = counter();`, "What does a closure retain access to?", ["Surrounding variables", "CSS", "A database", "HTML only"], "Surrounding variables"],
    ["Promises & Async/Await", "Handle work that finishes later.", "Promises represent future results. async and await provide a readable way to work with asynchronous operations.", `async function load() {\n  const response = await fetch("/api/data");\n  return response.json();\n}`, "Which keyword waits for a promise?", ["pause", "await", "waitFor", "later"], "await"],
  ],
  2: [
    ["Program Structure", "Understand expressions and statements.", "JavaScript programs are made from expressions and statements. A clear structure makes code easier to read and debug.", `const greeting = "Hello";\nconsole.log(greeting);`, "Which function prints output?", ["console.log()", "print()", "echo()", "write()"], "console.log()"],
    ["Functions", "Organize reusable logic.", "Functions let you name a piece of behavior and call it whenever needed.", `function square(n) {\n  return n * n;\n}`, "What does square(5) return?", ["10", "15", "25", "50"], "25"],
    ["Objects & Data", "Represent structured information.", "Objects group related properties while arrays represent ordered collections.", `const user = { name: "Sam", age: 22 };\nconsole.log(user.name);`, "Which expression reads name?", ["user.name", "name.user", "user->name", "user/name"], "user.name"],
    ["Higher-Order Functions", "Use functions with other functions.", "A higher-order function accepts a function or returns one. Array methods commonly use this idea.", `const nums = [1, 2, 3];\nconst result = nums.map(n => n * 3);`, "What does map return?", ["A new array", "A string only", "A boolean only", "Nothing"], "A new array"],
    ["Browser & DOM", "Connect JavaScript to web pages.", "The DOM represents the document as objects. JavaScript can read and change elements and respond to events.", `const heading = document.querySelector("h1");\nheading.textContent = "Hello!";`, "What does querySelector do?", ["Finds an element", "Starts a server", "Creates SQL", "Compiles JSX"], "Finds an element"],
    ["Asynchronous Programming", "Work with promises and network requests.", "Asynchronous code lets the browser continue while waiting for operations such as network requests.", `fetch("/api/users")\n  .then(res => res.json())\n  .then(users => console.log(users));`, "What does a Promise represent?", ["A future result", "A CSS class", "A database table", "A loop"], "A future result"],
  ],
  3: [
    ["Scope & Hoisting", "Understand how the JS engine compiles code.", "Hoisting moves declarations to the top of their scope during compilation. Let and const declarations are hoisted but remain uninitialized.", `console.log(x);\nvar x = 5;`, "What value is logged before initialization when using var?", ["undefined", "ReferenceError", "5", "null"], "undefined"],
    ["Closures Deep Dive", "Master lexical environment persistence.", "A closure gives inner functions access to an outer function's scope even after the outer function has closed.", `function outer() {\n  let secret = "hidden";\n  return () => secret;\n}`, "Can inner functions access outer variables after return?", ["Yes, via closure", "No, scope is destroyed", "Only with eval", "Only globally"], "Yes, via closure"],
    ["The 'this' Keyword", "Unravel execution context bindings.", "The value of this depends on how a function is called: global, object method, constructor, or explicit binding.", `const obj = { id: 42, print() { console.log(this.id); } };`, "What determines 'this'?", ["Call site execution", "File name", "Variable spelling", "Import order"], "Call site execution"],
    ["Prototypes & Behavior Delegation", "Explore JavaScript object linkage.", "Every object has a hidden internal property ([[Prototype]]) linking it to another object for property lookup.", `const proto = { greet() { return "hi"; } };\nconst obj = Object.create(proto);`, "What links objects together in JS?", ["Prototype chain", "Classes only", "Java inheritance", "CSS inheritance"], "Prototype chain"],
    ["Types & Coercion", "Handle implicit value type transformations.", "JavaScript performs implicit type coercion when operators encounter mixed types, such as string concatenation with '+' symbol.", `console.log(1 + "2");`, "What is the result of 1 + '2'?", ["'12'", "3", "NaN", "TypeError"], "'12'"],
    ["Async Patterns & Event Loop", "Comprehend concurrency models.", "The event loop coordinates call stack execution, microtasks (promises), and macrotasks (timers).", `setTimeout(() => console.log('timer'), 0);\nPromise.resolve().then(() => console.log('micro'));`, "Which task queue runs first?", ["Microtasks (Promises)", "Macrotasks (Timers)", "DOM events", "Console logs"], "Microtasks (Promises)"],
  ],
  4: [
    ["Meaningful Names", "Write self-documenting code.", "Choose names that reveal intent. Avoid cryptic abbreviations and misleading nomenclature across codebase variables.", `// Bad: int d;\n// Good: int daysSinceCreation;`, "Why use descriptive variable names?", ["Reveals programmer intent", "Compiles faster", "Saves storage", "Required by CPU"], "Reveals programmer intent"],
    ["Functions Small & Single Purpose", "Limit function responsibilities.", "Functions should do one thing, do it well, and do it only. Keep argument counts low to maintain clarity.", `function processUser(user) { /* ... */ }`, "How many tasks should a clean function perform?", ["One", "Five", "Unlimited", "Zero"], "One"],
    ["Comments as Failures", "Let code explain itself.", "Good code rarely needs comments. Use code structure and names rather than explaining messy logic.", `// Bad: Check if active\nif (user.isActive)`, "What is preferred over writing explanatory comments?", ["Clean descriptive code", "Deleting tests", "Long variable names", "More comments"], "Clean descriptive code"],
    ["Proper Error Handling", "Handle exceptions gracefully without clutter.", "Don't return null on failure; throw exceptions or use specialized wrapper results to keep code structures pristine.", `if (!data) throw new Error("Missing data");`, "What should you avoid returning upon failure?", ["Null pointers", "Custom exceptions", "Result objects", "Error codes"], "Null pointers"],
    ["Boundaries & Clean Tests", "Maintain rigorous test suites.", "Keep tests clean, readable, and independent. Maintain a single assertion concept per test block.", `test("adds numbers", () => { expect(add(1,2)).toBe(3); });`, "How many concepts should a test target?", ["One concept per test", "As many as possible", "Ten per function", "None"], "One concept per test"],
    ["Classes & Encapsulation", "Keep classes small and cohesive.", "Classes should have a single responsibility and encapsulate internal states properly.", `class UserAccount { constructor(name) { this.name = name; } }`, "What principle governs class design size?", ["Single Responsibility Principle", "Global Access", "Maximum inheritance", "Code duplication"], "Single Responsibility Principle"],
  ],
  5: [
    ["A Pragmatic Philosophy", "Take responsibility for your career.", "Care about your craft, think critically about your work, and avoid making excuses when code breaks.", `console.log("Provide options, not lame excuses.");`, "What mindset defines a pragmatic programmer?", ["Responsibility & ownership", "Blaming tools", "Writing zero code", "Ignoring bugs"], "Responsibility & ownership"],
    ["DRY - Don't Repeat Yourself", "Avoid duplication of knowledge.", "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system.", `function calculateTax(amount) { return amount * 0.1; }`, "What does DRY stand for?", ["Don't Repeat Yourself", "Do Repeat Yourself", "Data Repository Yarn", "Dynamic Route Yield"], "Don't Repeat Yourself"],
    ["Orthogonality", "Build decoupled, independent components.", "Eliminate effects between unrelated things. If one component changes, others shouldn't need modification.", `const decoupledModule = {};`, "What is the main benefit of orthogonal systems?", ["Easier testing and isolation", "Slower compilation", "Tighter coupling", "Complex dependencies"], "Easier testing and isolation"],
    ["Reversible Decisions", "Design software to adapt to change.", "Nothing is permanent. Avoid rigid design structures that prevent pivoting when requirements shift.", `const adapterPattern = () => {};`, "How should you treat design choices?", ["As flexible and reversible", "As set in stone", "As permanent barriers", "As unnecessary"], "As flexible and reversible"],
    ["Pragmatic Paranoia", "Design with defensive programming.", "You can't write perfect software, so write code that protects itself against unexpected inputs and errors.", `if (input == null) throw new IllegalArgumentException();`, "What is defensive programming?", ["Expecting errors and guarding against them", "Ignoring exceptions", "Hiding crash logs", "Deleting checks"], "Expecting errors and guarding against them"],
    ["Delighting Users", "Deliver functional, timely value.", "Understand user expectations and deliver working, well-tested features smoothly.", `console.log("Deliver early, iterate often.");`, "What is crucial for client satisfaction?", ["Delivering working solutions", "Waiting a year", "Complex documentation", "Zero interaction"], "Delivering working solutions"],
  ],
  6: [
    ["Asymptotic Analysis", "Measure algorithm efficiency using Big O.", "Big O notation describes the upper bound of time or space complexity as input size scales.", `// O(n) linear search\nfunction search(arr, val) { return arr.indexOf(val); }`, "What does Big O measure?", ["Growth rate of resource usage", "Exact execution milliseconds", "Line count", "Memory brand"], "Growth rate of resource usage"],
    ["Divide and Conquer", "Break problems into smaller subproblems.", "Algorithms like Merge Sort and Binary Search split a problem, solve subproblems, and combine results.", `function binarySearch(arr, x) { /* ... */ }`, "What is a classic divide and conquer algorithm?", ["Merge Sort", "Bubble Sort", "Linear Search", "Brute force"], "Merge Sort"],
    ["Sorting & Searching", "Organize data efficiently.", "Efficient sorting algorithms like Quicksort achieve O(n log n) average time complexity.", `const sorted = [1, 2, 3, 4].sort((a,b) => a - b);`, "What is the average time complexity of Quicksort?", ["O(n log n)", "O(n^2)", "O(1)", "O(n!)"], "O(n log n)"],
    ["Graph Algorithms", "Navigate networks and connections.", "Breadth-First Search (BFS) and Depth-First Search (DFS) explore nodes and edges in graph structures.", `const graphNode = { neighbors: [] };`, "Which algorithm uses a queue for level-order traversal?", ["Breadth-First Search (BFS)", "Depth-First Search (DFS)", "Binary search", "Linear sort"], "Breadth-First Search (BFS)"],
    ["Greedy Algorithms", "Make locally optimal choices.", "Greedy algorithms choose the best immediate option at each step with the goal of finding the global optimum.", `// Huffman coding / Kruskal's`, "What characterizes a greedy choice?", ["Locally optimal at each step", "Considers all future states", "Random selection", "Backtracking"], "Locally optimal at each step"],
    ["Dynamic Programming", "Solve overlapping subproblems efficiently.", "Dynamic programming stores solutions to subproblems (memoization or tabulation) to avoid redundant calculation.", `const memo = {};`, "What key technique prevents redundant subproblem calculations?", ["Memoization / Tabulation", "Infinite loops", "Random guessing", "Deleting results"], "Memoization / Tabulation"],
  ],
  7: [
    ["Intro to Patterns", "Reusable solutions to recurring problems.", "Design patterns capture best practices distilled by experienced object-oriented software engineers.", `const pattern = "Strategy";`, "What is a design pattern?", ["A tested reusable solution template", "A bug fix", "A syntax error", "A database server"], "Tested reusable solution template"],
    ["The Observer Pattern", "Publish-subscribe state notification.", "Defines a one-to-many dependency so that when one object changes state, all dependents are notified automatically.", `class Subject { constructor() { this.observers = []; } }`, "What does the Observer pattern manage?", ["Event notifications / subscriptions", "Database encryption", "CSS styles", "Array sorting"], "Event notifications / subscriptions"],
    ["The Decorator Pattern", "Dynamically attach new behaviors to objects.", "Decorators provide a flexible alternative to subclassing for extending functionality.", `class CoffeeWithMilk extends Coffee {}`, "How does a decorator modify behavior?", ["Wraps an object dynamically", "Modifies source code directly", "Deletes classes", "Compiles binary"], "Wraps an object dynamically"],
    ["The Factory Pattern", "Create objects without exposing instantiation logic.", "Factories use a common interface to create objects, letting subclasses decide which class to instantiate.", `class Creator { factoryMethod() {} }`, "What is the main benefit of a Factory?", ["Decouples object creation from usage", "Increases global variables", "Slows down code", "Removes constructors"], "Decouples object creation from usage"],
    ["The Singleton Pattern", "Ensure a class has only one instance.", "Provides a global point of access to that single instance throughout the application lifecycle.", `class DatabaseConnection { static getInstance() { /* ... */ } }`, "How many instances does a Singleton permit?", ["Exactly one", "Unlimited", "Two", "Zero"], "Exactly one"],
    ["The Command Pattern", "Encapsulate a request as an object.", "Allows parameterization of clients with queues, requests, and operations supporting undoable actions.", `class Command { execute() {} }`, "What can you do with encapsulated commands?", ["Queue, log, or undo requests", "Only delete them", "Format hard drives", "Style web pages"], "Queue, log, or undo requests"],
  ],
  8: [
    ["React Fundamentals & JSX", "Build declarative user interfaces.", "JSX combines markup and JavaScript logic into expressive element trees rendered by React.", `const element = <h1>Hello, React</h1>;`, "What syntax extension does React use?", ["JSX", "HTML5", "PHP", "VueTemplate"], "JSX"],
    ["Components & Props", "Modularize UI into reusable pieces.", "Components accept inputs called props and return React elements describing what should appear on screen.", `function Welcome(props) { return <h1>Hello {props.name}</h1>; }`, "What are component inputs called?", ["Props", "Attributes", "Global variables", "Params"], "Props"],
    ["Managing State & Hooks", "Handle dynamic local component data.", "The useState hook lets function components track state variables and trigger re-renders upon updates.", `const [count, setCount] = useState(0);`, "Which hook manages state in functional components?", ["useState", "useEffect", "useRef", "useContext"], "useState"],
    ["Handling Side Effects", "Synchronize components with external systems.", "The useEffect hook lets you perform data fetching, subscriptions, or manual DOM mutations after rendering.", `useEffect(() => { document.title = count; }, [count]);`, "When does useEffect run by default?", ["After every render", "Before render", "Never", "Only on server"], "After every render"],
    ["Context & Global State", "Share data without prop drilling.", "React Context provides a way to pass data through the component tree without manually passing props at every level.", `const ThemeContext = createContext('light');`, "What problem does React Context solve?", ["Prop drilling", "CSS styling", "Database queries", "Memory leaks"], "Prop drilling"],
    ["Custom Hooks & Performance", "Extract component logic and optimize speed.", "Custom hooks let you reuse stateful logic, while useMemo and useCallback optimize re-render performance.", `function useAuth() { /* ... */ }`, "What do custom hooks start with?", ["use", "custom", "hook", "get"], "use"],
  ],
  9: [
    ["Variables & Data Types", "Get started with Python syntax.", "Python uses clean indentation and dynamic typing for integers, floats, strings, and booleans.", `message = "Hello Python World!"\nprint(message);`, "Does Python require semicolons at line ends?", ["No, newline separates statements", "Yes, always", "Only in loops", "Only in functions"], "No, newline separates statements"],
    ["Lists & Loops", "Store and iterate over collections.", "Lists maintain ordered items. For loops iterate over items cleanly without explicit index counters.", `magicians = ['alice', 'david', 'carolina']\nfor m in magicians:\n    print(m)`, "How do you iterate through a Python list?", ["for item in list:", "foreach item", "while loop only", "iter(list)"], "for item in list:"],
    ["Dictionaries & Conditions", "Map keys to values and evaluate logic.", "Dictionaries store key-value pairs. If-elif-else statements handle branching decision paths.", `alien = {'color': 'green', 'points': 5}`, "What data structure stores key-value pairs in Python?", ["Dictionary", "List", "Tuple", "Set"], "Dictionary"],
    ["Functions & Modules", "Write reusable blocks of Python code.", "Functions are defined using the 'def' keyword. Modules allow importing code across separate files.", `def greet_user(username):\n    print(f"Hello, {username.title()}!")`, "Which keyword defines a function in Python?", ["def", "function", "fun", "lambda"], "def"],
    ["Classes & OOP", "Model real-world entities with objects.", "Classes define object attributes and methods, supporting object-oriented programming principles.", `class Dog:\n    def __init__(self, name):\n        self.name = name`, "What is the special method name for a Python constructor?", ["__init__", "__construct__", "initialize", "new"], "__init__"],
    ["Files & Exceptions", "Read files and handle runtime errors.", "Use 'with open()' for safe file handling and try-except blocks to catch exceptions gracefully.", `try:\n    print(5/0)\nexcept ZeroDivisionError:\n    print("Division by zero!")`, "What block handles runtime errors in Python?", ["try-except", "catch-throw", "error-rescue", "if-else"], "try-except"],
  ],
  10: [
    ["Creating & Destroying Objects", "Manage object creation best practices.", "Consider static factory methods instead of public constructors and manage object lifecycles efficiently.", `public static Boolean valueOf(boolean b) { return b ? TRUE : FALSE; }`, "What is an alternative to public constructors?", ["Static factory methods", "Global pointers", "New operator", "Void methods"], "Static factory methods"],
    ["Methods Common to All Objects", "Override equals, hashCode, and toString.", "Always override hashCode when you override equals so instances function correctly in hash-based collections.", `@Override public boolean equals(Object o) { /* ... */ }`, "Why override hashCode with equals?", ["To maintain hash collection invariants", "To speed up printing", "To create threads", "Required by syntax"], "To maintain hash collection invariants"],
    ["Classes and Interfaces", "Design robust type hierarchies.", "Favor interfaces over abstract classes and design robust class visibility encapsulations.", `public interface Comparable<T> { int compareTo(T t); }`, "What should be favored over abstract classes?", ["Interfaces", "Global variables", "Static classes", "Inheritance depth"], "Interfaces"],
    ["Generics & Enums", "Ensure type safety at compile time.", "Use bounded wildcards to increase API flexibility and replace int enum patterns with Java enum types.", `List<Number> list = new ArrayList<Integer>();`, "What do Java enums provide over int constants?", ["Type safety and rich methods", "Slower performance", "Unsafe casting", "Raw bytecodes"], "Type safety and rich methods"],
    ["Lambdas & Streams", "Process data functionally.", "Use lambda expressions and the Stream API to process bulk data collections concisely and expressively.", `int sum = list.stream().mapToInt(Integer::intValue).sum();`, "What API processes collections declaratively in Java 8+?", ["Stream API", "Reflection API", "Thread API", "JDBC"], "Stream API"],
    ["Concurrency Best Practices", "Write thread-safe Java applications.", "Use executors, tasks, and concurrent collections instead of raw threads and synchronized boilerplate.", `ExecutorService exec = Executors.newFixedThreadPool(4);`, "What should be used instead of raw threads?", ["ExecutorService / Concurrent utilities", "Thread.stop()", "Global locks", "Busy waiting"], "ExecutorService / Concurrent utilities"],
  ],
  11: [
    ["How to Build a Universe", "Explore the cosmic beginning.", "Bill Bryson recounts the unimaginable scale of the Big Bang, cosmic inflation, and how matter formed.", `// Cosmic origin studies`, "What scientific theory explains the beginning of our universe?", ["The Big Bang", "Steady State", "Geocentric Model", "Plate Tectonics"], "The Big Bang"],
    ["The Restless Earth", "Discover geology and plate tectonics.", "Earth's crust is fractured into moving plates driven by internal heat, creating earthquakes and mountain ranges.", `// Tectonic plate drift`, "What geological process moves continents?", ["Plate tectonics", "Ocean tides", "Solar wind", "Magnetic reversal"], "Plate tectonics"],
    ["The Dawn of Life", "Understand chemistry turning into biology.", "Life emerged in primordial oceans through organic chemistry, eventually forming complex cellular structures.", `// Abiogenesis concepts`, "Where did early life predominantly originate?", ["Primordial oceans", "Volcano craters", "Outer space meteors", "Glacial ice"], "Primordial oceans"],
    ["The Road to Us", "Trace human evolution and paleontology.", "Hominins evolved over millions of years through natural selection, adaptation, and migration out of Africa.", `// Fossil records`, "From which continent did modern humans originate?", ["Africa", "Europe", "Antarctica", "South America"], "Africa"],
    ["Dangerous Planet", "Examine extinction events and natural hazards.", "Earth has experienced multiple mass extinction events triggered by asteroid impacts, volcanism, and climate shifts.", `// K-Pg extinction event`, "What caused the dinosaur extinction 66 million years ago?", ["An asteroid impact", "Global freezing", "Extreme volcanic ash only", "Lack of food"], "An asteroid impact"],
    ["The Universe Today", "Reflect on humanity's place in space.", "Science bridges the vast vastness of the cosmos with our small, fragile, and precious blue home.", `// Astronomy overview`, "What science studies the universe beyond Earth?", ["Astronomy", "Astrology", "Alchemy", "Meteorology"], "Astronomy"],
  ],
  12: [
    ["An Animal of No Significance", "Examine early human history.", "For most of history, Homo sapiens was an insignificant animal sharing Earth with other human species.", `// 100,000 years ago`, "Was Homo sapiens always the sole human species?", ["No, others like Neanderthals existed", "Yes, always", "Only in America", "No other hominins ever existed"], "No, others like Neanderthals existed"],
    ["The Tree of Knowledge", "Discover the Cognitive Revolution.", "Around 70,000 years ago, accidental genetic mutations wired Sapiens' brains to communicate about fictional things.", `// Myth-making and gossip`, "What gave Sapiens global dominance?", ["Flexible language and shared myths", "Physical strength", "Venomous bites", "Fast running speed"], "Flexible language and shared myths"],
    ["A Day in the Life", "Understand foraging lifestyles.", "Ancient hunter-gatherers enjoyed diverse diets, deep ecological knowledge, and ample leisure time compared to modern workers.", `// Forager societies`, "How did ancient foragers live?", ["In nomadic bands with diverse diets", "In dense industrial cities", "As sedentary farmers", "Isolated individuals"], "In nomadic bands with diverse diets"],
    ["The Flood", "Analyze the Agricultural Revolution.", "Farming transformed human society, enabling population growth and surplus but also leading to disease and social hierarchy.", `// Wheat domesticated us`, "What was a major consequence of farming?", ["Population surplus and social hierarchy", "More leisure time", "Zero disease", "Universal peace"], "Population surplus and social hierarchy"],
    ["Building Pyramids", "Explore empires and unifying orders.", "Money, empires, and religion created imagined orders that allowed millions of strangers to cooperate peacefully.", `// Money and religion`, "What are primary examples of imagined human orders?", ["Money, religion, and laws", "DNA and atoms", "Gravity and friction", "Rocks and rivers"], "Money, religion, and laws"],
    ["The Scientific Revolution", "Trace humanity's modern awakening.", "Admitting ignorance 500 years ago propelled science, technology, imperialism, and capitalism forward.", `// Scientific method`, "What key realization triggered the Scientific Revolution?", ["Admitting what we do not know", "Knowing everything already", "Rejecting experiments", "Banning books"], "Admitting what we do not know"],
  ],
  13: [
    ["Shores of the Cosmic Ocean", "Journey across interstellar space.", "Carl Sagan introduces the vast expanse of galaxies, stars, and worlds comprising our universe.", `// 100 billion galaxies`, "Approximately how many galaxies exist in the observable universe?", ["Billions", "Just one", "Twelve", "A few thousand"], "Billions"],
    ["One Voice in Cosmic Fugue", "Connect biology and cosmic evolution.", "We are made of starstuff—atoms forged in the interiors of dying stars billions of years ago.", `// Carbon and oxygen origins`, "Where were the heavy atoms in our bodies forged?", ["Inside dying stars (stellar nucleosynthesis)", "On Earth's surface", "In comets", "Inside black holes"], "Inside dying stars (stellar nucleosynthesis)"],
    ["Harmony of Worlds", "Examine Kepler and planetary motion.", "Johannes Kepler discovered mathematical harmonies governing planetary orbits, replacing circular dogma with elliptical truth.", `// Elliptical orbits`, "What shape are planetary orbits?", ["Ellipses", "Perfect circles", "Squares", "Straight lines"], "Ellipses"],
    ["Heaven and Hell", "Compare Venus and Earth's greenhouse effect.", "Venus suffered a runaway greenhouse effect, becoming a scorching hell, while Earth nurtured life.", `// Runaway greenhouse`, "Why is Venus extremely hot?", ["Runaway greenhouse effect from CO2", "It is closest to the sun", "Nuclear explosions", "No atmosphere"], "Runaway greenhouse effect from CO2"],
    ["Blues for a Red Planet", "Explore Mars and the search for life.", "Mars fascinates humanity as a dusty, rust-red neighbor with ancient riverbeds hinting at past liquid water.", `// Martian channels`, "What evidence suggests Mars once had liquid water?", ["Ancient dried riverbeds and mineral deposits", "Active oceans today", "Green forests", "Rain storms"], "Ancient dried riverbeds and mineral deposits"],
    ["Travelers' Tales", "Reflect on space exploration probes.", "Robotic spacecraft like Voyager carry messages of Earth across interstellar space as humanity's emissaries.", `// Voyager Golden Record`, "What message did Voyager carry into space?", ["The Golden Record of Earth sounds and images", "A gold coin", "Human DNA samples", "A radio transmitter"], "The Golden Record of Earth sounds and images"],
  ],
  14: [
    ["No One's Crazy", "Understand personal financial behavior.", "People's financial decisions make sense to them based on their unique life experiences and generational backgrounds.", `// Unique worldviews`, "Why do people make seemingly irrational money choices?", ["Their life experiences shape different priorities", "They are uneducated", "Pure randomness", "Government orders"], "Their life experiences shape different priorities"],
    ["Luck and Risk", "Acknowledge invisible financial forces.", "Luck and risk are twins that play huge roles in financial success; never judge financial outcomes too harshly.", `// Bill Gates and success`, "What two forces dictate financial outcomes alongside effort?", ["Luck and risk", "Intelligence and height", "Age and location", "Grammar and spelling"], "Luck and risk"],
    ["Freedom", "Recognize wealth's greatest dividend.", "The highest form of wealth is the ability to wake up every morning and say, 'I can do whatever I want today.'", `// Control over time`, "What is the true highest dividend of wealth?", ["Control over your time and freedom", "Buying luxury cars", "Expensive watches", "Fame"], "Control over your time and freedom"],
    ["Compounding", "Witness the magic of long-term growth.", "Warren Buffett's skill is investing, but his secret is time. Compounding works wonders over decades.", `// 8th wonder of the world`, "What is the secret engine behind massive long-term wealth?", ["Compounding interest over long periods", "Quick day trading", "Lottery tickets", "High salary alone"], "Compounding interest over long periods"],
    ["Tails You Win", "Understand extreme outlier outcomes.", "In finance and business, a small number of events account for the majority of outcomes and returns.", `// Outlier success`, "What drives most returns in venture and investing?", ["A few outlier tail events", "Average steady daily gains", "Never taking risks", "Avoiding stocks entirely"], "A few outlier tail events"],
    ["Saving Money", "Build financial resilience.", "Wealth is what you don't see—money saved rather than spent on visible luxury goods.", `// Saving vs Spending`, "What distinguishes being wealthy from looking rich?", ["Wealth is accumulated unspent assets", "Having expensive clothes", "Driving sports cars", "High debt"], "Wealth is accumulated unspent assets"],
  ],
  15: [
    ["The Power of Atomic Habits", "Understand tiny changes making big differences.", "Habits are the compound interest of self-improvement. Getting 1% better every day counts immensely over a year.", `// 1.01^365 = 37.78`, "What happens if you get 1% better each day for a year?", ["You get nearly 38 times better", "You stay the same", "You improve by 365%", "You regress"], "You get nearly 38 times better"],
    ["Identity-Based Habits", "Focus on who you wish to become.", "True habit change is identity change. Start by focusing on the type of person you want to be.", `// 'I am a reader' vs 'I want to read'`, "What is more effective than outcome-based goals?", ["Identity-based habits", "Setting deadlines", "Strict willpower", "Punishing failure"], "Identity-based habits"],
    ["The Four Laws", "Master cue, craving, response, and reward.", "To build good habits: make it obvious, make it attractive, make it easy, and make it satisfying.", `// Behavior change loops`, "What are the four laws of behavior change?", ["Obvious, Attractive, Easy, Satisfying", "Loud, Fast, Hard, Expensive", "New, Old, Big, Small", "First, Second, Third, Fourth"], "Obvious, Attractive, Easy, Satisfying"],
    ["Make It Obvious", "Design your environment for cues.", "Environment is the invisible hand that shapes human behavior. Make cues for good habits prominent.", `// Visual reminders`, "What is the most powerful cue for starting a habit?", ["Visual cues in your immediate environment", "Hearing a loud alarm", "Reading a book", "Writing notes"], "Visual cues in your immediate environment"],
    ["Make It Easy", "Reduce friction for positive actions.", "Reduce the friction associated with good behaviors and increase friction for bad habits.", `// 2-minute rule`, "What is the 2-Minute Rule?", ["Scale down new habits to take two minutes or less", "Work for two hours", "Rest for two minutes", "Wait two days"], "Scale down new habits to take two minutes or less"],
    ["Make It Satisfying", "Ensure immediate reinforcement.", "What is immediately rewarded is repeated. What is immediately punished is avoided.", `// Habit trackers`, "Why do immediate rewards matter for habit formation?", ["The brain prioritizes present rewards over future ones", "They cost money", "They are unnecessary", "They cause stress"], "The brain prioritizes present rewards over future ones"],
  ],
  16: [
    ["Two Systems", "Explore System 1 and System 2 thinking.", "System 1 operates automatically and fast with little effort; System 2 allocates attention to complex mental computations.", `// Fast vs Slow cognition`, "Which system handles complex math problems?", ["System 2 (Slow, analytical)", "System 1 (Fast, intuitive)", "Neither", "Both equally"], "System 2 (Slow, analytical)"],
    ["Heuristics and Biases", "Examine mental shortcuts.", "The mind relies on heuristics (mental shortcuts) which can lead to predictable cognitive biases and errors in judgment.", `// Availability heuristic`, "What are mental shortcuts that simplify decisions called?", ["Heuristics", "Algorithms", "Compilers", "Syntaxes"], "Heuristics"],
    ["Overconfidence", "Recognize the illusion of validity.", "We frequently overestimate our knowledge and confidence in predicting uncertain future outcomes.", `// Narrative fallacy`, "What psychological illusion makes us trust our flawed forecasts?", ["Illusion of validity", "System 1 logic", "Memory loss", "Dopamine rush"], "Illusion of validity"],
    ["Prospect Theory", "Understand loss aversion in decision making.", "Losses loom larger than gains; people feel the pain of a loss much more acutely than the joy of an equivalent gain.", `// Pain of losing $100 vs winning $100`, "What psychological principle states losses hurt more than gains?", ["Loss aversion", "Gain seeking", "Risk neutrality", "Hedonic adaptation"], "Loss aversion"],
    ["Two Selves", "Differentiate experiencing and remembering selves.", "The experiencing self lives in the present, while the remembering self keeps score and tells the story of our lives.", `// Peak-end rule`, "Which self makes the ultimate choices based on memories?", ["The remembering self", "The experiencing self", "The subconscious self", "The physical body"], "The remembering self"],
    ["Rationality & Utility", "Evaluate economic human behavior.", "Traditional economics assumed rational actors, but behavioral economics reveals humans are systematically boundedly rational.", `// Bounded rationality`, "What does behavioral economics study?", ["How psychological factors influence economic decisions", "Only stock market graphs", "Computer coding logic", "Pure mathematical formulas"], "How psychological factors influence economic decisions"],
  ]
};

const categories = [
  "All", "Programming", "Knowledge", "JavaScript", "Python", "React",
  "Algorithms", "Java", "Science", "History", "Finance",
  "Self Development", "Psychology",
];

const formatLessons = (chapterObject) => {
  return Object.fromEntries(
    Object.entries(chapterObject).map(([courseId, chapters]) => [
      courseId,
      chapters.map(([title, description, content, code, question, options, answer]) => ({
        title, description, content, code, question, options, answer,
      })),
    ])
  );
};

// ==========================================
// REUSABLE EDITABLE FIELD COMPONENT
// ==========================================
function EditableField({ label, value, onSave, multiline = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className="profile-group">
      <div className="profile-group-header">
        <label>{label}</label>
        {!isEditing && (
          <button className="edit-icon-btn" onClick={() => setIsEditing(true)} aria-label={`Edit ${label}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        )}
      </div>
      {isEditing ? (
        <div className="edit-controls">
          {multiline ? (
            <textarea value={tempValue} onChange={(e) => setTempValue(e.target.value)} rows="3" />
          ) : (
            <input type="text" value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
          )}
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <p>{value || "Not set"}</p>
      )}
    </div>
  );
}

// ==========================================
// USER PROFILE SIDEBAR COMPONENT (Includes MetaMask Wallet Address)
// ==========================================
function UserProfileSidebar({ profileData, walletAddress, onUpdateProfile, isOpen, onClose }) {
  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile('avatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 2000 }}>
      <div className="profile-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-top">
          <button className="sidebar-close" onClick={onClose}>×</button>
          <div className="profile-header">
            <label className="profile-avatar-wrapper" htmlFor="avatar-upload">
              {profileData?.avatar ? (
                <img src={profileData.avatar} alt="Profile" className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar">👨‍💻</div>
              )}
              <div className="avatar-edit-overlay">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
              <input type="file" id="avatar-upload" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </label>
            <div className="profile-titles">
              <h2>Developer Profile</h2>
              <span className="profile-subtitle">Manage your personal information</span>
            </div>
          </div>
        </div>
        <div className="profile-details">
          {/* Display Connected MetaMask Wallet Address */}
          <div className="profile-group">
            <div className="profile-group-header">
              <label>METAMASK WALLET</label>
            </div>
            <p style={{ fontFamily: 'monospace', wordBreak: 'break-all', color: 'var(--orange-dark)', fontSize: '13px' }}>
              {walletAddress || localStorage.getItem("learnhub_wallet") || "Not Connected"}
            </p>
          </div>

          <EditableField label="NAME" value={profileData.name} onSave={(val) => onUpdateProfile('name', val)} />
          <EditableField label="EMAIL" value={profileData.email} onSave={(val) => onUpdateProfile('email', val)} />
          <EditableField label="PHONE NO." value={profileData.phone} onSave={(val) => onUpdateProfile('phone', val)} />
          <EditableField label="ROLE" value={profileData.role} onSave={(val) => onUpdateProfile('role', val)} />
          <EditableField label="EDUCATION" value={profileData.education} onSave={(val) => onUpdateProfile('education', val)} multiline />
          <EditableField label="EXPERIENCE" value={profileData.experience} onSave={(val) => onUpdateProfile('experience', val)} multiline />
          <EditableField label="PROJECTS" value={profileData.projects} onSave={(val) => onUpdateProfile('projects', val)} multiline />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CERTIFICATE MODAL COMPONENT
// ==========================================
function CertificateModal({ book, profileData, lessonData, onClose }) {
  const chapters = lessonData[book.id] || [];

  return (
    <div className="certificate-overlay" onClick={onClose}>
      <div className="certificate-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="certificate">
          <div className="certificate-border">
            <div className="certificate-logo">🏆</div>
            <div className="certificate-small">LEARNHUB</div>
            <h1>Certificate of Completion</h1>
            <p className="certificate-intro">This is to certify that</p>
            <h2>{profileData?.name || "Full Stack Developer"}</h2>
            <p className="certificate-body">has successfully completed the course</p>
            <h3>{book.title}</h3>
            <p className="certificate-description">
              Demonstrating proficiency in {book.category} and successfully completing all {chapters.length} chapters of rigorous learning and assessments.
            </p>
            <div className="certificate-meta">
              <div>
                <strong>LearnHub AI Tutor</strong>
                <span>Authorized Instructor</span>
              </div>
              <div>
                <strong>{new Date().toLocaleDateString()}</strong>
                <span>Date Issued</span>
              </div>
            </div>
            <div className="certificate-id">ID: LH-{Date.now().toString().slice(-8)}-{book.id}</div>
          </div>
        </div>
        <div className="certificate-actions">
          <button onClick={() => window.print()}>Print Certificate</button>
          <button style={{ background: '#f1f5f9', color: '#334155' }} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// BOOK CARD COMPONENT
// ==========================================
function BookCard({ book, lessonData, onOpen, progress, xp, isPurchased, onPurchase }) {
  const cost = book.xpCost || 100;

  return (
    <div className="book-card">
      <div className="book-cover" style={{ background: `linear-gradient(135deg, ${book.color}, #111827)` }}>
        <div className="book-icon">{book.icon}</div>
        <div className="book-type">{book.type === "Programming" ? "PROGRAMMING" : "KNOWLEDGE"}</div>
      </div>
      <div className="book-content">
        <div className="book-category">{book.category}</div>
        <h3>{book.title}</h3>
        <p className="author">by {book.author}</p>
        <div className="book-meta">
          <span>{book.level}</span>
          <span>{lessonData[book.id]?.length || 0} Chapters</span>
        </div>

        {isPurchased ? (
          <>
            <div className="progress-section">
              <div className="progress-label">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <button className="learn-button" onClick={() => onOpen(book)}>
              {progress > 0 ? "Continue Learning" : "Start Learning"} <span>→</span>
            </button>
          </>
        ) : (
          <button
            className="learn-button"
            style={{ background: xp >= cost ? 'var(--orange)' : '#cbd5e1' }}
            onClick={() => onPurchase(book.id, cost)}
          >
            Unlock for ⭐ {cost} XP <span>🔒</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// BOOK MODAL COMPONENT
// ==========================================
function BookModal({ book, profileData, lessonData, progress, onClose, onStart }) {
  const [showCertificate, setShowCertificate] = useState(false);
  if (!book) return null;

  const chapters = lessonData[book.id] || [];
  const isFullyComplete = progress >= 100;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="book-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={onClose} type="button" aria-label="Close">×</button>
          <div className="modal-cover" style={{ background: `linear-gradient(135deg, ${book.color}, #111827)` }}>
            <div>{book.icon}</div>
          </div>
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="modal-category" style={{ margin: 0 }}>{book.category}</span>
              {isFullyComplete && (
                <button className="small-certificate-btn" onClick={() => setShowCertificate(true)} title="Claim Certificate">
                  🏆 Claim
                </button>
              )}
            </div>
            <h2>{book.title}</h2>
            <p className="modal-author">by {book.author}</p>
            <div className="level-badge">{book.level}</div>
            <p className="description">{book.description}</p>
            <div className="course-summary">
              <strong>{chapters.length} Chapters</strong><span>•</span><strong>{progress}% Complete</strong>
            </div>
            <h4>Course Chapters</h4>
            <div className="chapter-list">
              {chapters.map((item, index) => {
                const requiredProgressForNext = Math.round((index / chapters.length) * 100);
                const isLocked = index > 0 && progress < requiredProgressForNext;
                const isCompleted = progress >= Math.round(((index + 1) / chapters.length) * 100);
                return (
                  <button
                    key={item.title}
                    type="button"
                    disabled={isLocked}
                    className={`chapter-item ${isCompleted ? "completed" : ""} ${isLocked ? "locked" : ""}`}
                    onClick={() => onStart(index)}
                  >
                    <span className="chapter-number">{isCompleted ? "✓" : isLocked ? "🔒" : index + 1}</span>
                    <div className="chapter-title">
                      <strong>Chapter {index + 1}: {item.title}</strong>
                      <small style={{ display: 'block', color: 'var(--muted)', marginTop: '4px', fontSize: '11px' }}>{item.description}</small>
                    </div>
                  </button>
                );
              })}
            </div>
            <h4>Topics</h4>
            <div className="topics">{book.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
            <button className="modal-start-button" onClick={() => onStart()} type="button">
              {isFullyComplete ? "Review Course" : progress > 0 ? "Continue Learning" : "Start Learning"} <span>→</span>
            </button>
          </div>
        </div>
      </div>
      {showCertificate && (
        <CertificateModal book={book} profileData={profileData} lessonData={lessonData} onClose={() => setShowCertificate(false)} />
      )}
    </>
  );
}

// ==========================================
// LEARNING SCREEN COMPONENT
// ==========================================
function LearningScreen({ book, lessons, lessonIndex, profileData, onBack, onNext, onProgress, progress = 0 }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setSidebarOpen(false);
  }, [lessonIndex, book?.id]);

  if (!book || !Array.isArray(lessons) || lessons.length === 0) return null;

  const currentLesson = lessons[lessonIndex];
  if (!currentLesson) return null;

  const { title = "Untitled", description = "", content = "", code = "", question = "", options = [], answer = "" } = currentLesson;
  const safeOptions = Array.isArray(options) ? options : [];
  const completedCount = progress >= 100 ? lessons.length : Math.min(lessons.length, Math.round((progress / 100) * lessons.length));
  const answerCorrect = selectedAnswer === answer;
  const isLastChapter = lessonIndex === lessons.length - 1;

  const handleAnswer = (option) => {
    if (showResult) return;
    setSelectedAnswer(option);
    setShowResult(true);

    if (option === answer) {
      const nextCompletedCount = Math.max(completedCount, lessonIndex + 1);
      const nextProgress = Math.round((nextCompletedCount / lessons.length) * 100);
      onProgress(book.id, nextProgress);
    }
  };

  const handleNext = () => {
    if (!showResult || !answerCorrect) return;
    if (isLastChapter) {
      onProgress(book.id, 100);
      setCourseCompleted(true);
      return;
    }
    onNext(lessonIndex + 1);
  };

  const goToChapter = (index) => {
    const requiredProgressForNext = Math.round((index / lessons.length) * 100);
    if (index > 0 && progress < requiredProgressForNext) return;
    if (index < 0 || index >= lessons.length) return;
    onNext(index);
    setSelectedAnswer(null);
    setShowResult(false);
    setSidebarOpen(false);
  };

  if (courseCompleted) {
    return (
      <div className="learning-screen">
        <div className="completion-screen">
          <div className="completion-card">
            <div className="completion-icon">🎉</div>
            <span className="completion-eyebrow">COURSE COMPLETE</span>
            <h1>Congratulations!</h1>
            <p>You completed <strong>{book.title}</strong>.</p>
            <div className="completion-stats">
              <div><strong>{lessons.length}</strong><span>Chapters</span></div>
              <div><strong>100%</strong><span>Complete</span></div>
              <div><strong>✓</strong><span>Finished</span></div>
            </div>

            <div className="completion-actions" style={{ flexDirection: 'column', gap: '12px' }}>
              <button type="button" className="primary-learning-button" style={{ background: '#16a34a', borderColor: '#16a34a', width: '100%', fontSize: '16px' }} onClick={() => setShowCertificate(true)}>
                🏆 Claim Certificate
              </button>
              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <button type="button" className="secondary-learning-button" style={{ flex: 1 }} onClick={onBack}>← Library</button>
                <button type="button" className="secondary-learning-button" style={{ flex: 1 }} onClick={() => { setCourseCompleted(false); onNext(0); }}>Review</button>
              </div>
            </div>
          </div>
        </div>

        {showCertificate && (
          <CertificateModal book={book} profileData={profileData} lessonData={{ [book.id]: lessons }} onClose={() => setShowCertificate(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="learning-screen">
      <header className="learning-header">
        <div className="learning-header-left">
          <button type="button" className="back-learning" onClick={onBack}>← <span>Back to Library</span></button>
          <div className="learning-course-brand">
            <div className="learning-book-icon" style={{ background: book.color }}>{book.icon}</div>
            <div><span>{book.category}</span><strong>{book.title}</strong></div>
          </div>
        </div>
        <button type="button" className="mobile-menu-button" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <div className="learning-header-right">
          <div className="header-progress-text">
            <span>Course Progress</span><strong>{progress}%</strong>
          </div>
          <div className="header-progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
          </div>
        </div>
      </header>

      <div className="learning-body">
        <aside className={`course-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-top">
            <div><span className="sidebar-label">COURSE CHAPTERS</span><h2>{book.title}</h2></div>
            <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>×</button>
          </div>
          <div className="sidebar-progress-card">
            <div className="sidebar-progress-row"><span>Progress</span><span>{progress}% complete</span></div>
            <div className="sidebar-progress-bar"><div style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} /></div>
          </div>
          <div className="sidebar-chapters">
            {lessons.map((lesson, index) => {
              const chapterCompleted = progress >= Math.round(((index + 1) / lessons.length) * 100);
              const active = index === lessonIndex;
              const requiredProgressForNext = Math.round((index / lessons.length) * 100);
              const isLocked = index > 0 && progress < requiredProgressForNext;
              let classNames = "sidebar-chapter";
              if (active) classNames += " chapter-current";
              if (chapterCompleted) classNames += " chapter-completed";
              if (isLocked) classNames += " chapter-locked";

              return (
                <button type="button" key={`${lesson.title}-${index}`} className={classNames} disabled={isLocked} onClick={() => goToChapter(index)}>
                  <div className="chapter-status">{chapterCompleted ? "✓" : isLocked ? "🔒" : index + 1}</div>
                  <div className="sidebar-chapter-info"><span>CHAPTER {index + 1}</span><strong>{lesson.title}</strong></div>
                  {active && <div className="current-dot"></div>}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="lesson-main">
          <div className="lesson-main-inner">
            <div className="lesson-heading">
              <div>
                <span className="chapter-badge">CHAPTER {lessonIndex + 1} OF {lessons.length}</span>
                <h1>{title}</h1>
                <p className="lesson-description">{description}</p>
              </div>
            </div>
            <section className="lesson-card">
              <h2>📖 Learn</h2>
              <div className="lesson-text">
                {String(content).split("\n").map((line, index) => <p key={`${lessonIndex}-${index}`}>{line || "\u00A0"}</p>)}
              </div>
            </section>
            {code && (
              <section className="example-card">
                <div className="code-header">
                  <div><span>💻 Example</span><strong>{book.category}</strong></div>
                  <div className="code-language">JS</div>
                </div>
                <pre><code>{code}</code></pre>
              </section>
            )}
            <section className="quiz-card">
              <div className="quiz-top"><span className="quiz-label">QUICK CHECK</span></div>
              <h2>{question}</h2>
              <div className="quiz-options">
                {safeOptions.map((option, i) => {
                  const isCorrect = option === answer;
                  const isSelected = option === selectedAnswer;
                  let className = "quiz-option";
                  if (showResult && isCorrect) className += " correct";
                  if (showResult && isSelected && !isCorrect) className += " wrong";
                  return (
                    <button type="button" key={option} className={className} onClick={() => handleAnswer(option)} disabled={showResult}>
                      <div className="option-letter">{String.fromCharCode(65 + i)}</div>
                      <span className="option-text">{option}</span>
                      {showResult && isCorrect && <span className="option-result">✓</span>}
                      {showResult && isSelected && !isCorrect && <span className="option-result">✕</span>}
                    </button>
                  );
                })}
              </div>
              {showResult && (
                <div className={`answer-message ${answerCorrect ? "correct-message" : "wrong-message"}`}>
                  {answerCorrect ? "🎉 Correct! Great job." : `❌ Not quite. The correct answer is "${answer}".`}
                </div>
              )}
            </section>
            <div className="lesson-actions">
              <button type="button" className="previous-button" disabled={lessonIndex === 0} onClick={() => onNext(Math.max(0, lessonIndex - 1))}>← Previous</button>
              <div className="lesson-step">
                <span>{lessonIndex + 1} / {lessons.length}</span>
                <div className="step-dots">{lessons.map((_, index) => <span key={index} className={index <= lessonIndex ? "dot-active" : ""} />)}</div>
              </div>
              {!showResult ? (
                <button type="button" className="next-button disabled-next" disabled>Answer to continue →</button>
              ) : answerCorrect ? (
                <button type="button" className="next-button" onClick={handleNext}>{isLastChapter ? "Complete Course ✓" : "Next Chapter →"}</button>
              ) : (
                <button type="button" className="next-button retry-button" onClick={() => { setSelectedAnswer(null); setShowResult(false); }}>Try Again ↻</button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("learnhub_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch { return null; }
  });

  const [profileData, setProfileData] = useState(() => {
    try {
      const savedProfile = localStorage.getItem("learnhub_profile");
      if (savedProfile) return JSON.parse(savedProfile);
      return {
        name: user?.name || "Shubham Karsh",
        email: user?.email || "shubhamkarsh7000@gmail.com",
        phone: "+91 0000000000",
        role: "Full Stack Web Developer",
        education: "MCA, Visvesvaraya Technological University",
        experience: "Software Engineer Intern, Paperbill Tech Pvt. Ltd.",
        projects: "iText Converter",
        avatar: null
      };
    } catch { return {}; }
  });

  // --- WALLET & XP STATES ---
  const [xp, setXp] = useState(() => {
    try { return JSON.parse(localStorage.getItem("learnhub_xp")) || 150; } catch { return 150; }
  });
  const [walletAddress] = useState(() => localStorage.getItem("learnhub_wallet") || null);
  const [purchasedCourses, setPurchasedCourses] = useState(() => {
    try { return JSON.parse(localStorage.getItem("learnhub_purchased")) || [1, 2, 11]; } catch { return [1, 2, 11]; }
  });

  // --- API STATE VARIABLES ---
  const [books, setBooks] = useState([]);
  const [lessonData, setLessonData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [apiError] = useState(null);

  const [authScreen, setAuthScreen] = useState("login");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBook, setSelectedBook] = useState(null);
  const [learningBook, setLearningBook] = useState(null);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Home");
  const [showProfile, setShowProfile] = useState(false);
  const [animateClass, setAnimateClass] = useState("");

  // Course Purchase Logic
  const handlePurchaseCourse = (courseId, cost) => {
    if (xp >= cost) {
      setXp(prev => prev - cost);
      setPurchasedCourses(prev => [...prev, courseId]);
      alert("🎉 Successfully unlocked course using XP!");
    } else {
      alert("❌ Insufficient XP! Win more games in Challenges to earn XP.");
    }
  };

  // Add XP from winning games
  const handleWinGame = (rewardAmount) => {
    setXp(prev => prev + rewardAmount);
    alert(`🏆 You won ${rewardAmount} XP from the challenge!`);
  };

  useEffect(() => {
    localStorage.setItem("learnhub_xp", JSON.stringify(xp));
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("learnhub_purchased", JSON.stringify(purchasedCourses));
  }, [purchasedCourses]);

  useEffect(() => {
    setAnimateClass("tab-effect-active");
    const timer = setTimeout(() => { setAnimateClass(""); }, 450);
    return () => clearTimeout(timer);
  }, [activeTab, activeCategory]);

  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem("learnhub-progress")) || {}; } catch { return {}; }
  });

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://api.npoint.io/YOUR_JSON_ENDPOINT");
        if (!response.ok) throw new Error("API not found, falling back to local data");
        const data = await response.json();
        setBooks(data.books);
        setLessonData(formatLessons(data.chapterSets));
      } catch (err) {
        console.warn(err.message);
        setBooks(FALLBACK_BOOKS);
        setLessonData(formatLessons(FALLBACK_CHAPTERS));
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, []);

  useEffect(() => {
    localStorage.setItem("learnhub_profile", JSON.stringify(profileData));
  }, [profileData]);

  useEffect(() => {
    localStorage.setItem("learnhub-progress", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleUpdateProfile = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const filteredBooks = useMemo(() => {
    const query = search.toLowerCase().trim();
    return books.filter((book) => {
      const matchesSearch = !query || book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query) || book.category.toLowerCase().includes(query) || book.topics.some((t) => t.toLowerCase().includes(query));
      const matchesCategory = activeCategory === "All" || book.type === activeCategory || book.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, books]);

  const programmingBooks = books.filter((book) => book.type === "Programming");
  const knowledgeBooks = books.filter((book) => book.type === "Knowledge");
  const getProgress = (bookId) => progress[bookId] || 0;

  const startLearning = (book, chapterIndex = null) => {
    const lessons = lessonData[book.id];
    if (!lessons?.length) { alert("Lessons not available for this course yet."); return; }
    const savedProgress = getProgress(book.id);
    let nextIndex = 0;
    if (chapterIndex !== null && chapterIndex >= 0 && chapterIndex < lessons.length) {
      nextIndex = chapterIndex;
    } else if (savedProgress > 0 && savedProgress < 100) {
      nextIndex = Math.min(lessons.length - 1, Math.floor((savedProgress / 100) * lessons.length));
    } else if (savedProgress >= 100) {
      nextIndex = lessons.length - 1;
    }
    setLearningBook(book);
    setLessonIndex(nextIndex);
    setSelectedBook(null);
  };

  const updateProgress = (bookId, value) => {
    setProgress((current) => ({ ...current, [bookId]: Math.max(current[bookId] || 0, value) }));
  };

  const closeLearning = () => {
    setLearningBook(null);
    setLessonIndex(0);
  };

  const showCategory = (category) => {
    setActiveCategory(category);
    setActiveTab(category === "All" ? "Home" : "Search");
    setSearch("");
  };

  const handleLogin = (loggedInUser) => setUser(loggedInUser);
  const handleRegister = (registeredUser) => setUser(registeredUser);
  const handleLogout = () => {
    localStorage.removeItem("learnhub_token");
    localStorage.removeItem("learnhub_user");
    localStorage.removeItem("learnhub_wallet");
    setUser(null);
    setAuthScreen("login");
  };

  if (!user) {
    return authScreen === "login" ? (
      <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthScreen("register")} />
    ) : (
      <Register onRegister={handleRegister} onSwitchToLogin={() => setAuthScreen("login")} />
    );
  }

  return (
    <div className="app">
      <UserProfileSidebar profileData={profileData} walletAddress={walletAddress} onUpdateProfile={handleUpdateProfile} isOpen={showProfile} onClose={() => setShowProfile(false)} />

      <header className="navbar">
        <div className="logo-section">
          <button className="header-menu-button" aria-label="Open Profile Menu" onClick={() => setShowProfile(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <button className="logo" type="button" onClick={() => { setActiveTab("Home"); setActiveCategory("All"); setSearch(""); }}>LH</button>
          <div>
            <h1>LearnHub</h1>
            <span>Explore and Grow</span>
          </div>
        </div>

        <nav className="main-nav">
          <button type="button" className={activeTab === "Home" && activeCategory === "All" ? "nav-active" : ""} onClick={() => { setActiveTab("Home"); setActiveCategory("All"); setSearch(""); }}>Home</button>
          <button type="button" className={activeCategory === "Programming" && activeTab !== "Games" ? "nav-active" : ""} onClick={() => { showCategory("Programming"); setActiveTab("Home"); }}>Programming</button>
          <button type="button" className={activeCategory === "Knowledge" && activeTab !== "Games" ? "nav-active" : ""} onClick={() => { showCategory("Knowledge"); setActiveTab("Home"); }}>Knowledge</button>
          <button type="button" className={activeTab === "Games" ? "nav-active" : ""} onClick={() => { setActiveTab("Games"); setActiveCategory("All"); setSearch(""); }}>Challenges</button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* XP Badge */}
          <div className="xp-badge" style={{ background: 'var(--orange-light)', color: 'var(--orange-dark)', padding: '8px 12px', borderRadius: '12px', fontWeight: '800', fontSize: '13px' }}>
            ⭐ {xp} XP
          </div>

          <div className="user-menu">
            {profileData?.avatar ? (
              <img src={profileData.avatar} alt="Profile" className="header-avatar-img" />
            ) : (
              <div className="header-avatar-placeholder">👨‍💻</div>
            )}
            <button type="button" className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">LEARNHUB TUTOR</span>
          <h1>Learn. Build.<br /><span>Grow.</span></h1>
          <p>Explore programming, technology, science, history, finance and more — all in one place.</p>
        </div>
      </section>

      <section className="search-section">
        <div className="search-box">
          <span>🔎</span>
          <input
            type="text"
            placeholder="Search courses, authors, topics..."
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              setActiveTab(value ? "Search" : "Home");
              if (!value) setActiveCategory("All");
            }}
          />
          {search && <button type="button" onClick={() => { setSearch(""); setActiveTab("Home"); setActiveCategory("All"); }}>×</button>}
        </div>
      </section>

      <section className="category-section">
        <div className="category-scroll">
          {categories.map((cat) => (
            <button key={cat} type="button" className={activeCategory === cat ? "category-active" : ""} onClick={() => showCategory(cat)}>{cat}</button>
          ))}
        </div>
      </section>

      <main className="main-content">
        <div key={`${activeTab}-${activeCategory}`} className={`page-content-wrapper ${animateClass}`}>

          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0', color: 'var(--orange-dark)' }}>
              <h2>Loading courses...</h2>
            </div>
          )}

          {apiError && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#dc2626' }}>
              <h2>{apiError}</h2>
              <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', cursor: 'pointer' }}>Retry Connection</button>
            </div>
          )}

          {!isLoading && !apiError && activeTab === "Games" && (
            <BrainGames onWinGame={handleWinGame} onClaimXP={(claimedAmount) => {
              setXp(prev => prev + claimedAmount);
            }} />
          )}

          {!isLoading && !apiError && activeTab === "Home" && activeCategory === "All" && !search && (
            <>
              <section className="section">
                <div className="section-header">
                  <div>
                    <span className="section-label">CODE & TECHNOLOGY</span>
                    <h2>Programming Library</h2>
                    <p>Unlock courses using your earned XP from challenges.</p>
                  </div>
                  <button className="view-all" type="button" onClick={() => showCategory("Programming")}>View All →</button>
                </div>
                <div className="book-grid">
                  {programmingBooks.slice(0, 6).map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      lessonData={lessonData}
                      progress={getProgress(book.id)}
                      onOpen={setSelectedBook}
                      xp={xp}
                      isPurchased={purchasedCourses.includes(book.id)}
                      onPurchase={handlePurchaseCourse}
                    />
                  ))}
                </div>
              </section>

              <section className="knowledge-banner">
                <div>
                  <span>EXPAND YOUR MIND</span>
                  <h2>Knowledge is<br /><strong>power.</strong></h2>
                  <p>Discover science, history, psychology, finance, habits, and ideas beyond programming.</p>
                </div>
                <div className="knowledge-icon">🧠</div>
              </section>

              <section className="section">
                <div className="section-header">
                  <div>
                    <span className="section-label">DISCOVER</span>
                    <h2>Knowledge Library</h2>
                    <p>Interactive six-chapter knowledge courses.</p>
                  </div>
                  <button className="view-all" type="button" onClick={() => showCategory("Knowledge")}>View All →</button>
                </div>
                <div className="book-grid">
                  {knowledgeBooks.slice(0, 6).map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      lessonData={lessonData}
                      progress={getProgress(book.id)}
                      onOpen={setSelectedBook}
                      xp={xp}
                      isPurchased={purchasedCourses.includes(book.id)}
                      onPurchase={handlePurchaseCourse}
                    />
                  ))}
                </div>
              </section>
            </>
          )}

          {!isLoading && !apiError && (activeCategory !== "All" || search || activeTab === "Search") && (
            <section className="section">
              <div className="section-header">
                <div>
                  <span className="section-label">YOUR RESULTS</span>
                  <h2>{search ? "Search Results" : `${activeCategory} Library`}</h2>
                  <p>{filteredBooks.length} courses</p>
                </div>
              </div>
              {filteredBooks.length > 0 ? (
                <div className="book-grid">
                  {filteredBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      lessonData={lessonData}
                      progress={getProgress(book.id)}
                      onOpen={setSelectedBook}
                      xp={xp}
                      isPurchased={purchasedCourses.includes(book.id)}
                      onPurchase={handlePurchaseCourse}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div>🔍</div>
                  <h3>No courses found</h3>
                  <p>Try searching for JavaScript, React, Python, Science, Finance, History, or Psychology.</p>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">LH</span>
              LearnHub
            </div>
            <p>Empowering developers and lifelong learners to explore, build, and grow every single day.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} LearnHub. All rights reserved.</p>
          <div className="footer-status">
            <span className="status-indicator"></span>
            <span>Progressive Web App • Works Offline</span>
          </div>
        </div>
      </footer>

      <BookModal
        book={selectedBook}
        profileData={profileData}
        lessonData={lessonData}
        progress={selectedBook ? getProgress(selectedBook.id) : 0}
        onClose={() => setSelectedBook(null)}
        onStart={(chapterIndex = null) => { if (selectedBook) startLearning(selectedBook, chapterIndex); }}
      />

      {learningBook && (
        <LearningScreen
          book={learningBook}
          lessons={lessonData[learningBook.id]}
          lessonIndex={lessonIndex}
          profileData={profileData}
          progress={getProgress(learningBook.id)}
          onBack={closeLearning}
          onNext={setLessonIndex}
          onProgress={updateProgress}
        />
      )}

      <AITutor book={learningBook} lesson={learningBook ? lessonData[learningBook.id]?.[lessonIndex] : null} />
      <ReloadPrompt />
    </div>
  );
}